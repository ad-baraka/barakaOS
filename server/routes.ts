import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, createUserSchema } from "@shared/schema";
import Papa from "papaparse";
import type {
  BankStatementRow,
  DatabaseRow,
  ReconciliationResult,
  ReconciliationResponse,
  ReconciliationStats,
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const result = loginSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ message: "Invalid credentials format" });
      }

      const { email, password } = result.data;
      const user = await storage.getUserByEmail(email);

      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (user.password !== password) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      if (!user.isActive) {
        return res.status(401).json({ message: "Account is deactivated" });
      }

      // Return user without password
      const { password: _, ...safeUser } = user;
      return res.json({ user: safeUser });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.get("/api/auth/me", async (req: Request, res: Response) => {
    // In a real app, you'd get the user from the session
    // For now, we'll return null if not logged in
    const userId = req.headers["x-user-id"] as string;
    if (!userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const { password: _, ...safeUser } = user;
    return res.json({ user: safeUser });
  });

  // User management routes (Super Admin only)
  app.get("/api/users", async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers();
      return res.json(users);
    } catch (error) {
      console.error("Get users error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/users", async (req: Request, res: Response) => {
    try {
      const result = createUserSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          message: "Invalid user data",
          errors: result.error.flatten().fieldErrors
        });
      }

      // Check if email already exists
      const existingUser = await storage.getUserByEmail(result.data.email);
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const user = await storage.createUser(result.data);
      return res.status(201).json(user);
    } catch (error) {
      console.error("Create user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.patch("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const user = await storage.updateUser(id, req.body);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json(user);
    } catch (error) {
      console.error("Update user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  app.delete("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteUser(id);
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.json({ message: "User deleted" });
    } catch (error) {
      console.error("Delete user error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });

  // ============================================================
  // Finance Module - Reconciliation Routes
  // ============================================================

  // Currency mapping based on account number
  const accountToCurrency: Record<string, string> = {
    "7625814984908": "QAR",
    "7625814984907": "OMR",
    "1025814984904": "USD",
    "1015814984903": "AED",
    "1025814984906": "SAR",
    "7625814984909": "KWD",
    "7625814984910": "BHD",
  };

  function extractCurrencyFromCsv(csvContent: string): string {
    const firstLine = csvContent.split('\n')[0]?.trim() || "";
    const match = firstLine.match(/Account Number\s*:\s*(\d+)/i);
    if (match && match[1]) {
      const accountNumber = match[1].trim();
      return accountToCurrency[accountNumber] || "UNKNOWN";
    }
    return "UNKNOWN";
  }

  app.post("/api/reconcile", async (req: Request, res: Response) => {
    try {
      const { bankStatementCsvArray, databaseCsv, valueDateFilter } = req.body;

      const bankCsvArray: string[] = bankStatementCsvArray || (req.body.bankStatementCsv ? [req.body.bankStatementCsv] : []);

      if (bankCsvArray.length === 0 || !databaseCsv) {
        return res.status(400).json({
          error: "Bank statement files and databaseCsv are required",
        });
      }

      const allBankData: BankStatementRow[] = [];
      let checkoutAed = 0;
      let checkoutUsd = 0;
      let tapUsd = 0;

      const matchesValueDateFilter = (rowValueDate: string, filter: string): boolean => {
        if (!filter) return true;

        const filterParts = filter.split("/");
        const filterDay = filterParts[0];
        const filterMonth = filterParts[1];
        const filterYear = filterParts[2];

        if (rowValueDate === filter) return true;
        if (rowValueDate === `${filterDay}-${filterMonth}-${filterYear}`) return true;

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthName = monthNames[parseInt(filterMonth, 10) - 1];
        if (rowValueDate === `${filterDay}-${monthName}-${filterYear}`) return true;
        if (rowValueDate === `${filterDay} ${monthName} ${filterYear}`) return true;
        if (rowValueDate === `${filterYear}-${filterMonth}-${filterDay}`) return true;

        return false;
      };

      for (const bankStatementCsv of bankCsvArray) {
        const currency = extractCurrencyFromCsv(bankStatementCsv);
        const csvLines = bankStatementCsv.split('\n');
        const bankStatementCsvData = csvLines.slice(2).join('\n');

        const bankStatementParsed = Papa.parse<BankStatementRow>(bankStatementCsvData, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header: string) => header.trim(),
        });

        if (bankStatementParsed.errors.length > 0) {
          return res.status(400).json({
            error: "Failed to parse bank statement CSV",
            details: bankStatementParsed.errors,
          });
        }

        for (const row of bankStatementParsed.data) {
          if (row["Account Number"] === "Account Number") continue;
          if (!row["Transaction Reference"]) continue;
          const debit = parseFloat(row.Debit?.replace(/,/g, "") || "0");
          if (debit !== 0) continue;

          const narration = row.Narration?.trim().toUpperCase() || "";
          const rowValueDate = row["Value Date"]?.trim() || "";

          if (valueDateFilter && !matchesValueDateFilter(rowValueDate, valueDateFilter)) {
            continue;
          }

          if (narration.startsWith("INWARD")) {
            const credit = parseFloat(row.Credit?.replace(/,/g, "") || "0");

            if (narration.includes("CHECKOUT")) {
              if (currency === "AED") {
                checkoutAed += credit;
              } else if (currency === "USD") {
                checkoutUsd += credit;
              }
            } else if (narration.includes("TAP") && currency === "USD") {
              tapUsd += credit;
            }
            continue;
          }

          allBankData.push({
            ...row,
            Currency: currency,
          });
        }
      }

      const databaseParsed = Papa.parse<DatabaseRow>(databaseCsv, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
      });

      if (databaseParsed.errors.length > 0) {
        return res.status(400).json({
          error: "Failed to parse MetaBase CSV",
          details: databaseParsed.errors,
        });
      }

      const bankStatementData = allBankData;
      const databaseData = databaseParsed.data.filter((row) => row.vam_reference_number);

      const bankMap = new Map<string, BankStatementRow>();
      const dbMap = new Map<string, DatabaseRow>();

      bankStatementData.forEach((row) => {
        const ref = row["Transaction Reference"]?.trim();
        if (ref) bankMap.set(ref, row);
      });

      databaseData.forEach((row) => {
        const ref = row.vam_reference_number?.trim();
        if (ref) dbMap.set(ref, row);
      });

      const results: ReconciliationResult[] = [];
      const processedRefs = new Set<string>();

      bankMap.forEach((bankRow, ref) => {
        processedRefs.add(ref);
        const dbRow = dbMap.get(ref);

        if (dbRow) {
          const bankCredit = bankRow.Credit?.trim() || "";
          const dbAmount = dbRow.transaction_amount?.trim() || "";
          const bankAmount = parseFloat(bankCredit.replace(/,/g, '')) || 0;
          const databaseAmount = parseFloat(dbAmount.replace(/,/g, '')) || 0;

          if (bankAmount === databaseAmount) {
            results.push({
              matchStatus: "matched",
              transactionReference: ref,
              bankData: bankRow,
              databaseData: dbRow,
            });
          } else {
            results.push({
              matchStatus: "bank_only",
              transactionReference: ref,
              bankData: bankRow,
              databaseData: null,
            });
            results.push({
              matchStatus: "database_only",
              transactionReference: ref,
              bankData: null,
              databaseData: dbRow,
            });
          }
        } else {
          results.push({
            matchStatus: "bank_only",
            transactionReference: ref,
            bankData: bankRow,
            databaseData: null,
          });
        }
      });

      dbMap.forEach((dbRow, ref) => {
        if (!processedRefs.has(ref)) {
          results.push({
            matchStatus: "database_only",
            transactionReference: ref,
            bankData: null,
            databaseData: dbRow,
          });
        }
      });

      const byCurrency: Record<string, { bankCredit: number; transactionAmount: number; deductedAmount: number }> = {};

      bankStatementData.forEach((row) => {
        const currency = row.Currency || "UNKNOWN";
        if (!byCurrency[currency]) {
          byCurrency[currency] = { bankCredit: 0, transactionAmount: 0, deductedAmount: 0 };
        }
        const credit = parseFloat(row.Credit?.replace(/,/g, '') || '0');
        byCurrency[currency].bankCredit += credit;
      });

      databaseData.forEach((row) => {
        const currency = row.transaction_currency || row.original_currency || "UNKNOWN";
        if (!byCurrency[currency]) {
          byCurrency[currency] = { bankCredit: 0, transactionAmount: 0, deductedAmount: 0 };
        }
        const transactionAmt = parseFloat(row.transaction_amount?.replace(/,/g, '') || '0');
        const deductedAmt = parseFloat(row.deducted_amount_in_usd?.replace(/,/g, '') || '0');
        byCurrency[currency].transactionAmount += transactionAmt;
        byCurrency[currency].deductedAmount += deductedAmt;
      });

      const totalBankCredit = Object.values(byCurrency).reduce((sum, c) => sum + c.bankCredit, 0);
      const totalTransactionAmount = Object.values(byCurrency).reduce((sum, c) => sum + c.transactionAmount, 0);
      const totalDeductedAmount = Object.values(byCurrency).reduce((sum, c) => sum + c.deductedAmount, 0);

      const totalMetaBaseAmount = databaseData.reduce((sum, row) => {
        const amount = parseFloat(row.amount?.replace(/,/g, '') || '0');
        return sum + amount;
      }, 0);

      const stats: ReconciliationStats = {
        totalMatched: results.filter((r) => r.matchStatus === "matched").length,
        totalBankOnly: results.filter((r) => r.matchStatus === "bank_only").length,
        totalDatabaseOnly: results.filter((r) => r.matchStatus === "database_only").length,
        totalRecords: results.length,
        totalBankCredit: totalBankCredit,
        totalMetaBaseAmount: totalMetaBaseAmount,
        totalDeductedAmount: totalDeductedAmount,
        totalTransactionAmount: totalTransactionAmount,
        byCurrency: byCurrency,
        specialTransactions: {
          checkoutAed,
          checkoutUsd,
          tapUsd,
        },
      };

      const response: ReconciliationResponse = {
        results,
        stats,
      };

      // Auto-save reconciliation
      try {
        const { bankStatementFilenames, databaseFilename } = req.body;
        const bankFilenameStr = Array.isArray(bankStatementFilenames)
          ? bankStatementFilenames.join(", ")
          : (bankStatementFilenames || req.body.bankStatementFilename || null);

        await storage.saveReconciliationRun(
          {
            bankStatementFilename: bankFilenameStr,
            databaseFilename: databaseFilename || null,
            valueDateFilter: valueDateFilter || null,
            totalMatched: stats.totalMatched,
            totalBankOnly: stats.totalBankOnly,
            totalDatabaseOnly: stats.totalDatabaseOnly,
            totalRecords: stats.totalRecords,
            totalBankCredit: Math.round(stats.totalBankCredit),
            totalMetaBaseAmount: Math.round(stats.totalMetaBaseAmount),
            totalDeductedAmount: Math.round(stats.totalDeductedAmount),
            totalTransactionAmount: Math.round(stats.totalTransactionAmount),
            checkoutAed: Math.round(checkoutAed * 100),
            checkoutUsd: Math.round(checkoutUsd * 100),
            tapUsd: Math.round(tapUsd * 100),
          },
          results
        );
      } catch (saveError) {
        console.error("Failed to save reconciliation:", saveError);
      }

      return res.json(response);
    } catch (error) {
      console.error("Reconciliation error:", error);
      return res.status(500).json({
        error: "Internal server error during reconciliation",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get all reconciliation runs history
  app.get("/api/reconciliations", async (req: Request, res: Response) => {
    try {
      const runs = await storage.getAllReconciliationRuns();
      return res.json(runs);
    } catch (error) {
      console.error("Error fetching reconciliation history:", error);
      return res.status(500).json({
        error: "Failed to fetch reconciliation history",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  // Get specific reconciliation run with results
  app.get("/api/reconciliations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid reconciliation ID" });
      }

      const run = await storage.getReconciliationRunById(id);
      if (!run) {
        return res.status(404).json({ error: "Reconciliation not found" });
      }

      const results = await storage.getReconciliationResultsByRunId(id);

      const byCurrency: Record<string, { bankCredit: number; transactionAmount: number; deductedAmount: number }> = {};

      const getCurrencyFromAccount = (accountNumber: string): string => {
        const mapping: Record<string, string> = {
          "7625814984908": "QAR",
          "7625814984907": "OMR",
          "1025814984904": "USD",
          "1015814984903": "AED",
          "1025814984906": "SAR",
          "7625814984909": "KWD",
          "7625814984910": "BHD",
        };
        return mapping[accountNumber] || "UNKNOWN";
      };

      results.forEach((r: any) => {
        if (r.bankData) {
          const accountNumber = String(r.bankData["Account Number"] || '');
          const currency = r.bankData.Currency || getCurrencyFromAccount(accountNumber);
          if (!byCurrency[currency]) {
            byCurrency[currency] = { bankCredit: 0, transactionAmount: 0, deductedAmount: 0 };
          }
          const credit = parseFloat(String(r.bankData.Credit || '0').replace(/,/g, ''));
          byCurrency[currency].bankCredit += credit;
        }
        if (r.databaseData) {
          const currency = r.databaseData.transaction_currency || r.databaseData.original_currency || "UNKNOWN";
          if (!byCurrency[currency]) {
            byCurrency[currency] = { bankCredit: 0, transactionAmount: 0, deductedAmount: 0 };
          }
          const transactionAmt = parseFloat(String(r.databaseData.transaction_amount || '0').replace(/,/g, ''));
          const deductedAmt = parseFloat(String(r.databaseData.deducted_amount_in_usd || '0').replace(/,/g, ''));
          byCurrency[currency].transactionAmount += transactionAmt;
          byCurrency[currency].deductedAmount += deductedAmt;
        }
      });

      const checkoutAed = (run.checkoutAed || 0) / 100;
      const checkoutUsd = (run.checkoutUsd || 0) / 100;
      const tapUsd = (run.tapUsd || 0) / 100;

      const totalBankCredit = Object.values(byCurrency).reduce((sum, c) => sum + c.bankCredit, 0);
      const totalTransactionAmount = Object.values(byCurrency).reduce((sum, c) => sum + c.transactionAmount, 0);
      const totalDeductedAmount = Object.values(byCurrency).reduce((sum, c) => sum + c.deductedAmount, 0);

      const response = {
        results,
        stats: {
          totalMatched: run.totalMatched,
          totalBankOnly: run.totalBankOnly,
          totalDatabaseOnly: run.totalDatabaseOnly,
          totalRecords: run.totalRecords,
          totalBankCredit: totalBankCredit,
          totalMetaBaseAmount: run.totalMetaBaseAmount || 0,
          totalDeductedAmount: totalDeductedAmount,
          totalTransactionAmount: totalTransactionAmount,
          byCurrency: byCurrency,
          specialTransactions: {
            checkoutAed,
            checkoutUsd,
            tapUsd,
          },
        },
        metadata: {
          id: run.id,
          createdAt: run.createdAt,
          bankStatementFilename: run.bankStatementFilename,
          databaseFilename: run.databaseFilename,
          valueDateFilter: run.valueDateFilter,
        },
      };

      return res.json(response);
    } catch (error) {
      console.error("Error fetching reconciliation:", error);
      return res.status(500).json({
        error: "Failed to fetch reconciliation",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
