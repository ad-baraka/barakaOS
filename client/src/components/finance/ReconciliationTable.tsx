import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";
import type { ReconciliationResult } from "@shared/schema";

// Fuzzy matching using Levenshtein distance
function levenshteinDistance(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();

  const m = s1.length;
  const n = s2.length;

  const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

function calculateFuzzyScore(name1: string, name2: string): number {
  if (!name1 || !name2 || name1 === "—" || name2 === "—") return 0;

  const normalized1 = name1.toUpperCase().trim().replace(/\s+/g, ' ');
  const normalized2 = name2.toUpperCase().trim().replace(/\s+/g, ' ');

  if (normalized1 === normalized2) return 100;
  if (normalized1.length === 0 || normalized2.length === 0) return 0;

  const distance = levenshteinDistance(normalized1, normalized2);
  const maxLen = Math.max(normalized1.length, normalized2.length);

  const similarity = ((maxLen - distance) / maxLen) * 100;
  return Math.max(0, Math.round(similarity));
}

function extractNameFromNarration(narration: string): string {
  if (!narration) return "—";

  const stopWords = [
    'PERSONAL', 'FINANCIAL', 'GOODS', 'OWN', 'FUNDS',
    'STOCKING', 'EQUITY', 'INSURANCE', 'AIR', 'BUY', 'PREMISES',
    'SERVICES', 'INVESTMENTS', 'INVESTMENT', 'INVEST', 'SENT', 'PURCHASED',
    'PURCHASE', 'ACCOUNT', 'BOUGHT', 'SOLD', 'TRANSPORT', 'PAYMENT',
    'MONEY', 'SALARY', 'INCOME', 'EXPENSE', 'FEE', 'FEES', 'CHARGE',
    'DEPOSIT', 'WITHDRAWAL', 'CREDIT', 'DEBIT', 'BALANCE', 'TRANSACTION',
    'BANK', 'BRANCH', 'LTD', 'LLC', 'INC', 'CORP', 'CO', 'PVT', 'PRIVATE',
    'PUBLIC', 'LIMITED', 'COMPANY', 'TRADING', 'ENTERPRISES', 'GROUP',
    'HOLDING', 'HOLDINGS', 'INTERNATIONAL', 'GLOBAL', 'WORLD', 'NATIONAL',
    'ENTS', 'MENT', 'MENTS'
  ];

  const skipWords = [
    'RE', 'FOR', 'FROM', 'TO', 'THE', 'AND', 'OF', 'IN', 'ON', 'BY', 'WITH',
    'REF', 'REFERENCE', 'NO', 'NUMBER', 'ID', 'CODE', 'TYPE', 'STATUS',
    'VA', 'TT', 'TRF', 'TRANSFER', 'REFNO', 'CREDITIPI', 'IPI'
  ];

  const cleanNarration = narration.toUpperCase().trim();

  // Pattern: After "REF:" followed by numbers, extract name
  const refNumberPattern = /REF[:\s]*(?:NO[:\s]*)?\s*(\d+)\s+([A-Z][A-Z\s]+?)(?:\s+(?:PERSONAL|FINANCIAL|INVEST|OWN|FUNDS|VA:|VAM\d|AE\d)|$)/i;
  let match = cleanNarration.match(refNumberPattern);

  if (match && match[2]) {
    const extracted = extractCleanName(match[2], stopWords, skipWords);
    if (extracted) return extracted;
  }

  // Pattern: Currency amount followed by name
  const currencyPattern = /(?:AED|USD|OMR|QAR|SAR|EUR|GBP|INR|PKR|BDT|PHP|EGP)\s+[\d,]+(?:\.\d+)?\s+([A-Z][A-Z\s]+?)(?:\s+(?:PERSONAL|FINANCIAL|INVEST|OWN|FUNDS|VA:|REFNO|REF\s*:|REF\s*NO)|$)/i;
  match = cleanNarration.match(currencyPattern);

  if (match && match[1]) {
    const extracted = extractCleanName(match[1], stopWords, skipWords);
    if (extracted) return extracted;
  }

  // Pattern: "TRANSFER FROM [NAME]"
  const transferFromPattern = /(?:TRANSFER|TRF)\s+FROM\s+([A-Z][A-Z\s]+?)(?:\s+(?:AE\d|REFNO|VA:|REF|TO\s|PERSONAL|FINANCIAL)|$)/i;
  match = cleanNarration.match(transferFromPattern);

  if (match && match[1]) {
    const extracted = extractCleanName(match[1], stopWords, skipWords);
    if (extracted) return extracted;
  }

  // Pattern: 2-3 word name patterns before common stop words
  const beforeStopWordPattern = /\b([A-Z][A-Z]+\s+[A-Z][A-Z]+(?:\s+[A-Z][A-Z]+)?)\s+(?:PERSONAL|FINANCIAL|INVEST|OWN|FUNDS|PAYMENT|SALARY|SERVICES)/i;
  match = cleanNarration.match(beforeStopWordPattern);

  if (match && match[1]) {
    const extracted = extractCleanName(match[1], stopWords, skipWords);
    if (extracted) return extracted;
  }

  return "—";
}

function extractCleanName(text: string, stopWords: string[], skipWords: string[]): string | null {
  const words = text.trim().split(/\s+/);
  const nameWords: string[] = [];

  for (const word of words) {
    const upperWord = word.trim().toUpperCase();

    if (stopWords.includes(upperWord)) break;
    if (skipWords.includes(upperWord)) continue;
    if (/[0-9\/\\:;,.]/.test(word)) break;
    if (word.length === 1) continue;
    if (word.length > 3 && !/[AEIOU]/.test(upperWord)) continue;
    if (/^(VA|TT|TRF|REF|IPI|VAM|AE)\d*$/i.test(word)) continue;

    nameWords.push(word);
  }

  while (nameWords.length > 0 && nameWords[nameWords.length - 1].length === 1) {
    nameWords.pop();
  }

  const name = nameWords.join(' ').trim();

  if (name.length >= 3 && name.length <= 60 && name.split(' ').length >= 2) {
    return name;
  }

  if (name.length >= 4 && name.length <= 60) {
    return name;
  }

  return null;
}

interface ReconciliationTableProps {
  results: ReconciliationResult[];
}

export function ReconciliationTable({ results }: ReconciliationTableProps) {
  const [statusFilters, setStatusFilters] = useState<Set<string>>(new Set(["matched", "bank_only", "database_only"]));

  const toggleStatusFilter = (status: string) => {
    setStatusFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(status)) {
        newFilters.delete(status);
      } else {
        newFilters.add(status);
      }
      return newFilters;
    });
  };

  const filteredResults = useMemo(() => {
    return results.filter(result => statusFilters.has(result.matchStatus));
  }, [results, statusFilters]);

  const sortedResults = useMemo(() => {
    return [...filteredResults].sort((a, b) => {
      return a.matchStatus.localeCompare(b.matchStatus);
    });
  }, [filteredResults]);

  const getMatchStatusBadge = (status: ReconciliationResult["matchStatus"]) => {
    switch (status) {
      case "matched":
        return (
          <Badge variant="outline" className="gap-1 border-green-600/30 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400" data-testid="badge-matched">
            <CheckCircle className="w-3 h-3" />
            Matched
          </Badge>
        );
      case "bank_only":
        return (
          <Badge variant="outline" className="gap-1 border-yellow-600/30 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400" data-testid="badge-bank-only">
            <AlertTriangle className="w-3 h-3" />
            Bank Only
          </Badge>
        );
      case "database_only":
        return (
          <Badge variant="outline" className="gap-1 border-blue-600/30 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400" data-testid="badge-database-only">
            <Info className="w-3 h-3" />
            Database Only
          </Badge>
        );
    }
  };

  const getRowClasses = (status: ReconciliationResult["matchStatus"]) => {
    switch (status) {
      case "matched":
        return "bg-green-50/50 hover:bg-green-50 dark:bg-green-950/20 dark:hover:bg-green-950/30";
      case "bank_only":
        return "bg-yellow-50/50 hover:bg-yellow-50 dark:bg-yellow-950/20 dark:hover:bg-yellow-950/30";
      case "database_only":
        return "bg-blue-50/50 hover:bg-blue-50 dark:bg-blue-950/20 dark:hover:bg-blue-950/30";
    }
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground" data-testid="table-empty-state">
        <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p className="text-base">No reconciliation results to display</p>
        <p className="text-sm mt-2">Upload both CSV files to begin reconciliation</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-md border">
        <span className="text-sm font-medium text-foreground">Filter by Status:</span>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={statusFilters.has("matched")}
              onChange={() => toggleStatusFilter("matched")}
              className="w-4 h-4 rounded border-gray-300"
              data-testid="filter-matched"
            />
            <Badge variant="outline" className="gap-1 border-green-600/30 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400">
              <CheckCircle className="w-3 h-3" />
              Matched
            </Badge>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={statusFilters.has("bank_only")}
              onChange={() => toggleStatusFilter("bank_only")}
              className="w-4 h-4 rounded border-gray-300"
              data-testid="filter-bank-only"
            />
            <Badge variant="outline" className="gap-1 border-yellow-600/30 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400">
              <AlertTriangle className="w-3 h-3" />
              Bank Only
            </Badge>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={statusFilters.has("database_only")}
              onChange={() => toggleStatusFilter("database_only")}
              className="w-4 h-4 rounded border-gray-300"
              data-testid="filter-database-only"
            />
            <Badge variant="outline" className="gap-1 border-blue-600/30 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400">
              <Info className="w-3 h-3" />
              Database Only
            </Badge>
          </label>
        </div>
        <span className="ml-auto text-sm text-muted-foreground">
          Showing {sortedResults.length} of {results.length} records
        </span>
      </div>

      {/* Results Table */}
      <div className="relative border rounded-md h-[600px] overflow-auto">
        <table className="w-full caption-bottom text-sm relative">
          <TableHeader>
            <TableRow>
              <TableHead className="sticky top-0 left-0 z-30 bg-muted border-r w-[150px] font-bold">
                Status
              </TableHead>
              <TableHead className="sticky top-0 bg-muted z-20 border-r w-[200px] font-bold">
                Reference
              </TableHead>

              {/* Bank Statement Columns */}
              <TableHead className="sticky top-0 bg-blue-50 dark:bg-blue-950/30 border-l-2 border-l-blue-300 dark:border-l-blue-700 z-20 font-bold">
                <span className="text-blue-700 dark:text-blue-300">Bank:</span> Account Number
              </TableHead>
              <TableHead className="sticky top-0 bg-blue-50 dark:bg-blue-950/30 z-20 font-bold">
                <span className="text-blue-700 dark:text-blue-300">Bank:</span> Transaction Date
              </TableHead>
              <TableHead className="sticky top-0 bg-blue-50 dark:bg-blue-950/30 z-20 font-bold">
                <span className="text-blue-700 dark:text-blue-300">Bank:</span> Credit
              </TableHead>
              <TableHead className="sticky top-0 bg-blue-50 dark:bg-blue-950/30 z-20 font-bold">
                <span className="text-blue-700 dark:text-blue-300">Bank:</span> Currency
              </TableHead>
              <TableHead className="sticky top-0 bg-blue-50 dark:bg-blue-950/30 z-20 font-bold min-w-[400px]">
                <span className="text-blue-700 dark:text-blue-300">Bank:</span> Narration
              </TableHead>
              <TableHead className="sticky top-0 bg-blue-50 dark:bg-blue-950/30 z-20 font-bold">
                <span className="text-blue-700 dark:text-blue-300">Bank:</span> Extracted Name
              </TableHead>
              <TableHead className="sticky top-0 bg-green-50 dark:bg-green-950/30 border-r-2 border-r-green-300 dark:border-r-green-700 z-20 font-bold">
                <span className="text-green-700 dark:text-green-300">Match:</span> Name Score
              </TableHead>

              {/* Database Columns */}
              <TableHead className="sticky top-0 bg-purple-50 dark:bg-purple-950/30 border-l-2 border-l-purple-300 dark:border-l-purple-700 z-20 font-bold">
                <span className="text-purple-700 dark:text-purple-300">DB:</span> First Name
              </TableHead>
              <TableHead className="sticky top-0 bg-purple-50 dark:bg-purple-950/30 z-20 font-bold">
                <span className="text-purple-700 dark:text-purple-300">DB:</span> Last Name
              </TableHead>
              <TableHead className="sticky top-0 bg-purple-50 dark:bg-purple-950/30 z-20 font-bold">
                <span className="text-purple-700 dark:text-purple-300">DB:</span> Amount
              </TableHead>
              <TableHead className="sticky top-0 bg-purple-50 dark:bg-purple-950/30 z-20 font-bold">
                <span className="text-purple-700 dark:text-purple-300">DB:</span> Transaction Amount
              </TableHead>
              <TableHead className="sticky top-0 bg-purple-50 dark:bg-purple-950/30 z-20 font-bold">
                <span className="text-purple-700 dark:text-purple-300">DB:</span> VA Number
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedResults.map((result, index) => (
              <TableRow
                key={`${result.transactionReference}-${index}`}
                className={getRowClasses(result.matchStatus)}
                data-testid={`row-${result.matchStatus}-${index}`}
              >
                <TableCell className="sticky left-0 z-10 bg-muted border-r font-medium">
                  {getMatchStatusBadge(result.matchStatus)}
                </TableCell>
                <TableCell className="bg-muted border-r font-mono text-xs" data-testid={`cell-reference-${index}`}>
                  {result.transactionReference}
                </TableCell>

                {/* Bank Statement Data */}
                <TableCell className="bg-blue-50/50 dark:bg-blue-950/20 border-l-2 border-l-blue-200 dark:border-l-blue-800 text-sm">
                  {result.bankData?.["Account Number"] || "—"}
                </TableCell>
                <TableCell className="bg-blue-50/50 dark:bg-blue-950/20 text-sm">
                  {result.bankData?.["Transaction Date"] || "—"}
                </TableCell>
                <TableCell className="bg-blue-50/50 dark:bg-blue-950/20 text-sm tabular-nums text-right font-medium">
                  {result.bankData?.Credit || "—"}
                </TableCell>
                <TableCell className="bg-blue-50/50 dark:bg-blue-950/20 text-sm">
                  {result.bankData?.Currency || "—"}
                </TableCell>
                <TableCell className="bg-blue-50/50 dark:bg-blue-950/20 text-sm min-w-[400px] max-w-[600px]">
                  <div className="whitespace-normal break-words">
                    {result.bankData?.Narration || "—"}
                  </div>
                </TableCell>
                <TableCell className="bg-blue-50/50 dark:bg-blue-950/20 text-sm">
                  {extractNameFromNarration(result.bankData?.Narration || "")}
                </TableCell>
                <TableCell className="bg-green-50/50 dark:bg-green-950/20 border-r-2 border-r-green-200 dark:border-r-green-800 text-sm text-center">
                  {(() => {
                    const extractedName = extractNameFromNarration(result.bankData?.Narration || "");
                    const dbFullName = `${result.databaseData?.firstname || ""} ${result.databaseData?.lastname || ""}`.trim();
                    const score = calculateFuzzyScore(extractedName, dbFullName);

                    if (score === 0) return <span className="text-muted-foreground">—</span>;

                    let colorClass = "text-red-600 dark:text-red-400";
                    if (score >= 80) colorClass = "text-green-600 dark:text-green-400";
                    else if (score >= 60) colorClass = "text-yellow-600 dark:text-yellow-400";
                    else if (score >= 40) colorClass = "text-orange-600 dark:text-orange-400";

                    return (
                      <span className={`font-medium ${colorClass}`}>
                        {score}%
                      </span>
                    );
                  })()}
                </TableCell>

                {/* Database Data */}
                <TableCell className="bg-purple-50/50 dark:bg-purple-950/20 border-l-2 border-l-purple-200 dark:border-l-purple-800 text-sm">
                  {result.databaseData?.firstname || "—"}
                </TableCell>
                <TableCell className="bg-purple-50/50 dark:bg-purple-950/20 text-sm">
                  {result.databaseData?.lastname || "—"}
                </TableCell>
                <TableCell className="bg-purple-50/50 dark:bg-purple-950/20 text-sm tabular-nums text-right font-medium">
                  {result.databaseData?.amount || "—"}
                </TableCell>
                <TableCell className="bg-purple-50/50 dark:bg-purple-950/20 text-sm tabular-nums text-right">
                  {result.databaseData?.transaction_amount || "—"}
                </TableCell>
                <TableCell className="bg-purple-50/50 dark:bg-purple-950/20 text-sm font-mono">
                  {result.databaseData?.va_number || "—"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </table>
      </div>
    </div>
  );
}
