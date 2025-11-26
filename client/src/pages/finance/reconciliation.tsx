import { useState, useCallback, useMemo } from "react";
import { FileUploadZone } from "@/components/finance/FileUploadZone";
import { MultiFileUploadZone } from "@/components/finance/MultiFileUploadZone";
import { StatisticsCard } from "@/components/finance/StatisticsCard";
import { ReconciliationTable } from "@/components/finance/ReconciliationTable";
import { ReconciliationHistory } from "@/components/finance/ReconciliationHistory";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, AlertTriangle, Info, Download, RefreshCw, Loader2, History, CalendarIcon, Plus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ReconciliationResponse } from "@shared/schema";
import Papa from "papaparse";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ModificationState {
  AED: { transactionAmount: number; deductedAmount: number };
  USD: { transactionAmount: number; deductedAmount: number };
}

interface AdjustmentPair {
  id: number;
  currency: "AED" | "USD";
  value: string;
}

export default function ReconciliationPage() {
  const [bankStatementFiles, setBankStatementFiles] = useState<File[]>([]);
  const [databaseFile, setDatabaseFile] = useState<File | null>(null);
  const [reconciliationData, setReconciliationData] = useState<ReconciliationResponse | null>(null);
  const [selectedHistoryId, setSelectedHistoryId] = useState<number | undefined>();
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [valueDateFilter, setValueDateFilter] = useState<Date | undefined>();
  const [adjustmentPairs, setAdjustmentPairs] = useState<AdjustmentPair[]>([
    { id: 1, currency: "AED", value: "" }
  ]);
  const [nextPairId, setNextPairId] = useState(2);
  const [modifications, setModifications] = useState<ModificationState>({
    AED: { transactionAmount: 0, deductedAmount: 0 },
    USD: { transactionAmount: 0, deductedAmount: 0 },
  });
  const { toast } = useToast();

  const addAdjustmentPair = useCallback(() => {
    setAdjustmentPairs(prev => [...prev, { id: nextPairId, currency: "AED", value: "" }]);
    setNextPairId(prev => prev + 1);
  }, [nextPairId]);

  const removeAdjustmentPair = useCallback((id: number) => {
    setAdjustmentPairs(prev => {
      if (prev.length === 1) return prev;
      return prev.filter(pair => pair.id !== id);
    });
  }, []);

  const updateAdjustmentPair = useCallback((id: number, field: "currency" | "value", newValue: string) => {
    setAdjustmentPairs(prev => prev.map(pair =>
      pair.id === id
        ? { ...pair, [field]: field === "currency" ? newValue as "AED" | "USD" : newValue }
        : pair
    ));
  }, []);

  const handleModify = useCallback(() => {
    const validPairs = adjustmentPairs.filter(pair => {
      const value = parseFloat(pair.value);
      return !isNaN(value) && value !== 0;
    });

    if (validPairs.length === 0) {
      toast({
        title: "No Valid Values",
        description: "Please enter at least one valid number.",
        variant: "destructive",
      });
      return;
    }

    const newModifications: ModificationState = {
      AED: { transactionAmount: 0, deductedAmount: 0 },
      USD: { transactionAmount: 0, deductedAmount: 0 },
    };

    validPairs.forEach(pair => {
      const value = parseFloat(pair.value);
      if (pair.currency === "AED") {
        newModifications.AED.transactionAmount += value;
        newModifications.AED.deductedAmount += (value * 0.0075) / 3.685;
      } else {
        newModifications.USD.transactionAmount += value;
        newModifications.USD.deductedAmount += (value * 0.0075);
      }
    });

    setModifications(newModifications);

    toast({
      title: "Modifications Applied",
      description: `Applied ${validPairs.length} adjustment(s) to calculations.`,
    });
  }, [adjustmentPairs, toast]);

  const resetModifications = useCallback(() => {
    setModifications({
      AED: { transactionAmount: 0, deductedAmount: 0 },
      USD: { transactionAmount: 0, deductedAmount: 0 },
    });
    setAdjustmentPairs([{ id: 1, currency: "AED", value: "" }]);
    setNextPairId(2);
    toast({
      title: "Modifications Reset",
      description: "All manual modifications have been cleared.",
    });
  }, [toast]);

  // Fetch historical reconciliation when selected
  const { data: historicalData, isLoading: isLoadingHistory } = useQuery<ReconciliationResponse>({
    queryKey: ["/api/reconciliations", selectedHistoryId],
    queryFn: async () => {
      if (!selectedHistoryId) throw new Error("No ID selected");
      const response = await apiRequest("GET", `/api/reconciliations/${selectedHistoryId}`);
      return await response.json() as ReconciliationResponse;
    },
    enabled: !!selectedHistoryId,
  });

  const reconcileMutation = useMutation({
    mutationFn: async ({
      bankDataArray,
      dbData,
      bankFilenames,
      dbFilename,
      valueDateFilter
    }: {
      bankDataArray: string[];
      dbData: string;
      bankFilenames: string[];
      dbFilename: string;
      valueDateFilter?: string;
    }) => {
      const response = await apiRequest("POST", "/api/reconcile", {
        bankStatementCsvArray: bankDataArray,
        databaseCsv: dbData,
        bankStatementFilenames: bankFilenames,
        databaseFilename: dbFilename,
        valueDateFilter,
      });
      return await response.json() as ReconciliationResponse;
    },
    onSuccess: (data) => {
      setReconciliationData(data);
      setModifications({
        AED: { transactionAmount: 0, deductedAmount: 0 },
        USD: { transactionAmount: 0, deductedAmount: 0 },
      });
      setAdjustmentPairs([{ id: 1, currency: "AED", value: "" }]);
      setNextPairId(2);
      toast({
        title: "Reconciliation Complete",
        description: `Processed ${data.stats.totalRecords} records successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Reconciliation Failed",
        description: error instanceof Error ? error.message : "An error occurred during reconciliation",
        variant: "destructive",
      });
    },
  });

  const handleReconcile = useCallback(async () => {
    if (bankStatementFiles.length === 0 || !databaseFile) {
      toast({
        title: "Missing Files",
        description: "Please upload bank statement files and MetaBase file before reconciling.",
        variant: "destructive",
      });
      return;
    }

    try {
      const bankDataArray = await Promise.all(
        bankStatementFiles.map(file => file.text())
      );
      const dbData = await databaseFile.text();

      reconcileMutation.mutate({
        bankDataArray,
        dbData,
        bankFilenames: bankStatementFiles.map(f => f.name),
        dbFilename: databaseFile.name,
        valueDateFilter: valueDateFilter ? format(valueDateFilter, "dd/MM/yyyy") : undefined,
      });
    } catch (error) {
      toast({
        title: "File Read Error",
        description: "Failed to read uploaded files.",
        variant: "destructive",
      });
    }
  }, [bankStatementFiles, databaseFile, reconcileMutation, toast, valueDateFilter]);

  // Determine which data to display
  const displayData = selectedHistoryId && historicalData ? historicalData : reconciliationData;

  const handleExport = useCallback(() => {
    if (!displayData) return;

    const exportData = displayData.results.map((result) => ({
      Status: result.matchStatus,
      "Transaction Reference": result.transactionReference,
      "Bank - Account Number": result.bankData?.["Account Number"] || "",
      "Bank - Transaction Date": result.bankData?.["Transaction Date"] || "",
      "Bank - Value Date": result.bankData?.["Value Date"] || "",
      "Bank - Narration": result.bankData?.Narration || "",
      "Bank - Debit": result.bankData?.Debit || "",
      "Bank - Credit": result.bankData?.Credit || "",
      "Bank - Running Balance": result.bankData?.["Running Balance"] || "",
      "Bank - Currency": result.bankData?.Currency || "",
      "DB - First Name": result.databaseData?.firstname || "",
      "DB - Last Name": result.databaseData?.lastname || "",
      "DB - Created At": result.databaseData?.created_at || "",
      "DB - Amount(excl. rev)": result.databaseData?.amount || "",
      "DB - Deducted Amount (USD)": result.databaseData?.deducted_amount_in_usd || "",
      "DB - Total Amount": result.databaseData?.total_amount_in_original_currency || "",
      "DB - Currency": result.databaseData?.original_currency || "",
      "DB - Fee Name": result.databaseData?.fee_name || "",
      "DB - VA Number": result.databaseData?.va_number || "",
      "DB - User ID": result.databaseData?.user_id || "",
      "DB - Deposit ID": result.databaseData?.deposit_id || "",
      "DB - Transaction Currency": result.databaseData?.transaction_currency || "",
      "DB - Transaction Amount": result.databaseData?.transaction_amount || "",
    }));

    const transactionCsv = Papa.unparse(exportData);
    const blob = new Blob([transactionCsv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute("download", `reconciliation_${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export Successful",
      description: "Reconciliation results have been downloaded.",
    });
  }, [displayData, toast]);

  const handleClearAll = useCallback(() => {
    setBankStatementFiles([]);
    setDatabaseFile(null);
    setReconciliationData(null);
    setSelectedHistoryId(undefined);
    setModifications({
      AED: { transactionAmount: 0, deductedAmount: 0 },
      USD: { transactionAmount: 0, deductedAmount: 0 },
    });
    setAdjustmentPairs([{ id: 1, currency: "AED", value: "" }]);
    setNextPairId(2);
  }, []);

  const handleRemoveBankFile = useCallback((index: number) => {
    setBankStatementFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSelectHistory = useCallback((id: number) => {
    setSelectedHistoryId(id);
    setReconciliationData(null);
    setIsHistoryOpen(false);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-page-title">
            Deposit Reconciliation
          </h1>
          <p className="text-muted-foreground mt-1">Upload bank statement and MetaBase files to reconcile transactions</p>
        </div>

        <Sheet open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="lg" className="gap-2" data-testid="button-toggle-history">
              <History className="w-5 h-5" />
              History
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[500px] sm:w-[700px] flex flex-col">
            <SheetHeader>
              <SheetTitle>Reconciliation History</SheetTitle>
            </SheetHeader>
            <div className="mt-6 flex-1 overflow-hidden">
              <ReconciliationHistory
                onSelectReconciliation={handleSelectHistory}
                selectedId={selectedHistoryId}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* File upload zones - only when NOT viewing historical data */}
      {!selectedHistoryId && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MultiFileUploadZone
              label="Drop Bank Statement CSV(s) here"
              description="Multiple files supported (AED, USD, OMR, QAR, SAR, KWD, BHD)"
              files={bankStatementFiles}
              onFilesSelect={setBankStatementFiles}
              onFileClear={handleRemoveBankFile}
              onClearAll={() => setBankStatementFiles([])}
            />
            <FileUploadZone
              label="Drop MetaBase CSV here"
              description="or click to browse"
              file={databaseFile}
              onFileSelect={setDatabaseFile}
              onFileClear={() => setDatabaseFile(null)}
            />
          </div>

          <div className="flex items-end gap-4">
            <div className="space-y-3">
              <Label htmlFor="value-date-filter">Value Date Filter</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="value-date-filter"
                    variant="outline"
                    size="lg"
                    className={cn(
                      "w-[200px] justify-start text-left font-normal gap-2",
                      !valueDateFilter && "text-muted-foreground"
                    )}
                    data-testid="button-date-picker"
                  >
                    <CalendarIcon className="h-4 w-4" />
                    {valueDateFilter ? format(valueDateFilter, "dd/MM/yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={valueDateFilter}
                    onSelect={setValueDateFilter}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            {valueDateFilter && (
              <Button
                size="lg"
                variant="ghost"
                onClick={() => setValueDateFilter(undefined)}
                data-testid="button-clear-date"
              >
                Clear Date
              </Button>
            )}
          </div>

          <div className="flex gap-4">
            {!displayData ? (
              <Button
                size="lg"
                onClick={handleReconcile}
                disabled={bankStatementFiles.length === 0 || !databaseFile || reconcileMutation.isPending}
                data-testid="button-reconcile"
                className="gap-2"
              >
                {reconcileMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    Reconcile
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleExport}
                  data-testid="button-export"
                  className="gap-2"
                >
                  <Download className="w-5 h-5" />
                  Export to CSV
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleClearAll}
                  data-testid="button-clear-all"
                  className="gap-2"
                >
                  Clear All
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Historical metadata when viewing historical data */}
      {selectedHistoryId && displayData?.metadata && (
        <div className="border rounded-lg overflow-hidden">
          <div className="bg-muted/50 px-6 py-3 border-b">
            <h3 className="font-semibold text-foreground">Historical Reconciliation Details</h3>
          </div>
          <div className="p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground text-sm">Bank Statement Files</Label>
                <p className="text-foreground mt-1">{displayData.metadata.bankStatementFilename || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">MetaBase File</Label>
                <p className="text-foreground mt-1">{displayData.metadata.databaseFilename || "N/A"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Value Date Filter</Label>
                <p className="text-foreground mt-1">{displayData.metadata.valueDateFilter || "None"}</p>
              </div>
              <div>
                <Label className="text-muted-foreground text-sm">Created At</Label>
                <p className="text-foreground mt-1">
                  {format(new Date(displayData.metadata.createdAt), "MMM d, yyyy HH:mm")}
                </p>
              </div>
            </div>
            <div className="flex gap-4 pt-2">
              <Button
                size="lg"
                variant="outline"
                onClick={handleExport}
                data-testid="button-export-history"
                className="gap-2"
              >
                <Download className="w-5 h-5" />
                Export to CSV
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleClearAll}
                data-testid="button-back-to-new"
                className="gap-2"
              >
                Back to New Reconciliation
              </Button>
            </div>
          </div>
        </div>
      )}

      {isLoadingHistory && selectedHistoryId && (
        <div className="text-center py-12">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground mt-4">Loading historical data...</p>
        </div>
      )}

      {displayData && !isLoadingHistory && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatisticsCard
              icon={CheckCircle}
              label="Matched Transactions"
              value={displayData.stats.totalMatched}
              variant="success"
            />
            <StatisticsCard
              icon={AlertTriangle}
              label="Bank Only"
              value={displayData.stats.totalBankOnly}
              variant="warning"
            />
            <StatisticsCard
              icon={Info}
              label="Database Only"
              value={displayData.stats.totalDatabaseOnly}
              variant="info"
            />
          </div>

          {/* Bank Only Modification Controls */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/50 px-6 py-3 border-b">
              <h3 className="font-semibold text-foreground">Bank Only Transaction Adjustment</h3>
            </div>
            <div className="p-4 space-y-3">
              {adjustmentPairs.map((pair, index) => (
                <div key={pair.id} className="flex items-end gap-3 flex-wrap">
                  <div className="space-y-2">
                    {index === 0 && <Label>Currency</Label>}
                    <Select
                      value={pair.currency}
                      onValueChange={(val) => updateAdjustmentPair(pair.id, "currency", val)}
                    >
                      <SelectTrigger className="w-[120px]" data-testid={`select-currency-${pair.id}`}>
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AED">AED</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    {index === 0 && <Label>Value</Label>}
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      value={pair.value}
                      onChange={(e) => updateAdjustmentPair(pair.id, "value", e.target.value)}
                      className="w-[180px]"
                      data-testid={`input-value-${pair.id}`}
                    />
                  </div>
                  {adjustmentPairs.length > 1 && (
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => removeAdjustmentPair(pair.id)}
                      data-testid={`button-remove-pair-${pair.id}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={addAdjustmentPair}
                  className="gap-2"
                  data-testid="button-add-pair"
                >
                  <Plus className="h-4 w-4" />
                  Add Pair
                </Button>
                <Button onClick={handleModify} data-testid="button-modify">
                  Modify
                </Button>
                {(modifications.AED.transactionAmount !== 0 || modifications.USD.transactionAmount !== 0) && (
                  <Button variant="outline" onClick={resetModifications} data-testid="button-reset-modifications">
                    Reset Modifications
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Amount Summary Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-muted/50 px-6 py-3 border-b">
              <h3 className="font-semibold text-foreground">Amount Summary by Currency</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-muted/30">
                    <th className="text-left px-6 py-3 font-medium text-muted-foreground sticky left-0 bg-muted/30">Metric</th>
                    {displayData.stats.byCurrency && Object.keys(displayData.stats.byCurrency).sort().map((currency) => (
                      <th key={currency} className="text-right px-6 py-3 font-medium text-muted-foreground min-w-[140px]">
                        {currency}
                      </th>
                    ))}
                    <th className="text-right px-6 py-3 font-bold text-foreground bg-muted/50 min-w-[140px]">Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t bg-blue-50/50 dark:bg-blue-950/20">
                    <td className="px-6 py-4 sticky left-0 bg-blue-50/50 dark:bg-blue-950/20">
                      <span className="text-blue-700 dark:text-blue-300 font-medium">
                        Sum of Credit (Bank)
                      </span>
                    </td>
                    {displayData.stats.byCurrency && Object.keys(displayData.stats.byCurrency).sort().map((currency) => (
                      <td key={currency} className="px-6 py-4 text-right font-medium text-foreground tabular-nums">
                        {displayData.stats.byCurrency[currency].bankCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    ))}
                    <td className="px-6 py-4 text-right font-bold text-foreground tabular-nums bg-muted/30" data-testid="stat-total-bank-credit">
                      {displayData.stats.totalBankCredit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                  <tr className="border-t bg-purple-50/50 dark:bg-purple-950/20">
                    <td className="px-6 py-4 sticky left-0 bg-purple-50/50 dark:bg-purple-950/20">
                      <span className="text-purple-700 dark:text-purple-300 font-medium">
                        Sum of Transaction Amount (DB)
                      </span>
                    </td>
                    {displayData.stats.byCurrency && Object.keys(displayData.stats.byCurrency).sort().map((currency) => {
                      const baseValue = displayData.stats.byCurrency[currency].transactionAmount;
                      const modValue = currency === "AED" ? modifications.AED.transactionAmount :
                        currency === "USD" ? modifications.USD.transactionAmount : 0;
                      const finalValue = baseValue + modValue;
                      const isModified = modValue !== 0;
                      return (
                        <td key={currency} className={cn("px-6 py-4 text-right font-medium tabular-nums", isModified ? "text-red-600 dark:text-red-400" : "text-foreground")}>
                          {finalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      );
                    })}
                    {(() => {
                      const baseTotal = displayData.stats.totalTransactionAmount || 0;
                      const modTotal = modifications.AED.transactionAmount + modifications.USD.transactionAmount;
                      const finalTotal = baseTotal + modTotal;
                      const isModified = modTotal !== 0;
                      return (
                        <td className={cn("px-6 py-4 text-right font-bold tabular-nums bg-muted/30", isModified ? "text-red-600 dark:text-red-400" : "text-foreground")} data-testid="stat-total-transaction-amount">
                          {finalTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      );
                    })()}
                  </tr>
                  <tr className="border-t bg-purple-50/50 dark:bg-purple-950/20">
                    <td className="px-6 py-4 sticky left-0 bg-purple-50/50 dark:bg-purple-950/20">
                      <span className="text-purple-700 dark:text-purple-300 font-medium">
                        Sum of Deducted Amount (USD)
                      </span>
                    </td>
                    {displayData.stats.byCurrency && Object.keys(displayData.stats.byCurrency).sort().map((currency) => {
                      const baseValue = displayData.stats.byCurrency[currency].deductedAmount;
                      const modValue = currency === "AED" ? modifications.AED.deductedAmount :
                        currency === "USD" ? modifications.USD.deductedAmount : 0;
                      const finalValue = baseValue + modValue;
                      const isModified = modValue !== 0;
                      return (
                        <td key={currency} className={cn("px-6 py-4 text-right font-medium tabular-nums", isModified ? "text-red-600 dark:text-red-400" : "text-foreground")}>
                          {finalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      );
                    })}
                    {(() => {
                      const baseTotal = displayData.stats.totalDeductedAmount || 0;
                      const modTotal = modifications.AED.deductedAmount + modifications.USD.deductedAmount;
                      const finalTotal = baseTotal + modTotal;
                      const isModified = modTotal !== 0;
                      return (
                        <td className={cn("px-6 py-4 text-right font-bold tabular-nums bg-muted/30", isModified ? "text-red-600 dark:text-red-400" : "text-foreground")} data-testid="stat-total-deducted-amount">
                          {finalTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </td>
                      );
                    })()}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Special Transactions Summary */}
          {displayData.stats.specialTransactions && (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-muted/50 px-6 py-3 border-b">
                <h3 className="font-semibold text-foreground">Special Transactions Summary</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/30">
                      <th className="text-left px-6 py-3 font-medium text-muted-foreground">Transaction Type</th>
                      <th className="text-right px-6 py-3 font-medium text-muted-foreground min-w-[140px]">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t bg-amber-50/50 dark:bg-amber-950/20">
                      <td className="px-6 py-4">
                        <span className="text-amber-700 dark:text-amber-300 font-medium">CHECKOUT - AED</span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-foreground tabular-nums" data-testid="stat-checkout-aed">
                        {displayData.stats.specialTransactions.checkoutAed.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="border-t bg-amber-50/50 dark:bg-amber-950/20">
                      <td className="px-6 py-4">
                        <span className="text-amber-700 dark:text-amber-300 font-medium">CHECKOUT - USD</span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-foreground tabular-nums" data-testid="stat-checkout-usd">
                        {displayData.stats.specialTransactions.checkoutUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                    <tr className="border-t bg-teal-50/50 dark:bg-teal-950/20">
                      <td className="px-6 py-4">
                        <span className="text-teal-700 dark:text-teal-300 font-medium">TAP - USD</span>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-foreground tabular-nums" data-testid="stat-tap-usd">
                        {displayData.stats.specialTransactions.tapUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="mb-4">
            <h2 className="text-2xl font-medium text-foreground mb-2">
              Reconciliation Results
              {selectedHistoryId && (
                <span className="text-base text-muted-foreground ml-2">(Historical)</span>
              )}
            </h2>
            <p className="text-sm text-muted-foreground">
              {displayData.stats.totalRecords} total records
            </p>
          </div>

          <ReconciliationTable results={displayData.results} />
        </>
      )}
    </div>
  );
}
