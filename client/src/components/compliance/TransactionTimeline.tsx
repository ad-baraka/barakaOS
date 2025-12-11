import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Banknote } from "lucide-react";

interface Transaction {
  id: string;
  type: "buy" | "sell" | "deposit" | "withdrawal" | "transfer";
  instrument?: string;
  amount: number;
  currency: string;
  quantity?: number;
  timestamp: string;
  status: "completed" | "pending" | "failed";
}

interface TransactionTimelineProps {
  transactions: Transaction[];
}

export function TransactionTimeline({ transactions }: TransactionTimelineProps) {
  const getIcon = (type: Transaction["type"]) => {
    switch (type) {
      case "buy":
        return <ArrowDownLeft className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "sell":
        return <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case "deposit":
        return <Banknote className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case "withdrawal":
        return <Banknote className="h-4 w-4 text-amber-600 dark:text-amber-400" />;
      case "transfer":
        return <ArrowLeftRight className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
    }
  };

  const getTypeLabel = (type: Transaction["type"]) => {
    const labels = {
      buy: "Buy Order",
      sell: "Sell Order",
      deposit: "Deposit",
      withdrawal: "Withdrawal",
      transfer: "Transfer",
    };
    return labels[type];
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div key={tx.id} className="relative pl-10">
                <div className="absolute left-2 top-1 h-5 w-5 rounded-full bg-card border-2 border-border flex items-center justify-center">
                  {getIcon(tx.type)}
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{getTypeLabel(tx.type)}</span>
                        {tx.instrument && (
                          <span className="text-xs font-mono bg-muted px-1.5 py-0.5 rounded">{tx.instrument}</span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground font-mono mt-1">{tx.id}</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">
                        {tx.type === "sell" || tx.type === "withdrawal" ? "-" : "+"}
                        {formatAmount(tx.amount, tx.currency)}
                      </div>
                      {tx.quantity && (
                        <div className="text-xs text-muted-foreground">{tx.quantity} shares</div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{tx.timestamp}</span>
                    <span className={`text-xs font-medium ${
                      tx.status === "completed" ? "text-green-600 dark:text-green-400" :
                      tx.status === "pending" ? "text-amber-600 dark:text-amber-400" :
                      "text-red-600 dark:text-red-400"
                    }`}>
                      {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
