import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ReconciliationRun } from "@shared/schema";
import { format } from "date-fns";

interface ReconciliationHistoryProps {
  onSelectReconciliation: (id: number) => void;
  selectedId?: number;
}

export function ReconciliationHistory({
  onSelectReconciliation,
  selectedId
}: ReconciliationHistoryProps) {
  const { data: runs, isLoading } = useQuery<ReconciliationRun[]>({
    queryKey: ["/api/reconciliations"],
  });

  if (isLoading) {
    return (
      <div className="py-8">
        <p className="text-sm text-muted-foreground text-center">Loading history...</p>
      </div>
    );
  }

  if (!runs || runs.length === 0) {
    return (
      <div className="py-8">
        <p className="text-sm text-muted-foreground text-center">
          No reconciliations yet. Run your first reconciliation to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pr-3">
      <div className="space-y-2 pb-4">
        {runs.map((run) => (
          <Button
            key={run.id}
            variant={selectedId === run.id ? "default" : "outline"}
            className="w-full justify-start h-auto p-4"
            onClick={() => onSelectReconciliation(run.id)}
            data-testid={`history-item-${run.id}`}
          >
            <div className="flex flex-col items-start gap-2 w-full">
              <div className="flex items-center gap-2 w-full">
                <FileText className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm font-medium truncate">
                  {format(new Date(run.createdAt), "MMM d, yyyy")}
                </span>
                <span className="text-xs text-muted-foreground ml-auto">
                  {format(new Date(run.createdAt), "HH:mm")}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 w-full">
                <Badge
                  variant="outline"
                  className="gap-1 border-green-600/30 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                >
                  <CheckCircle className="w-3 h-3" />
                  {run.totalMatched}
                </Badge>
                <Badge
                  variant="outline"
                  className="gap-1 border-yellow-600/30 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-400"
                >
                  <AlertTriangle className="w-3 h-3" />
                  {run.totalBankOnly}
                </Badge>
                <Badge
                  variant="outline"
                  className="gap-1 border-blue-600/30 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400"
                >
                  <Info className="w-3 h-3" />
                  {run.totalDatabaseOnly}
                </Badge>
              </div>

              {run.bankStatementFilename && (
                <span className="text-xs text-muted-foreground truncate w-full">
                  {run.bankStatementFilename}
                </span>
              )}
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
}
