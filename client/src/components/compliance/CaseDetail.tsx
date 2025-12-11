import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertBadge } from "./AlertBadge";
import { CustomerProfile } from "./CustomerProfile";
import { TransactionTimeline } from "./TransactionTimeline";
import {
  ArrowUp,
  Check,
  X,
  FileText,
  Clock,
  AlertTriangle,
  User,
  History
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CaseDetailProps {
  alert: {
    id: string;
    customerId: string;
    customerName: string;
    ruleTriggered: string;
    riskScore: number;
    priority: "high" | "medium" | "low";
    status: "new" | "in_progress" | "escalated" | "closed";
    timestamp: string;
    amount?: number;
    currency?: string;
    description?: string;
  };
  customer: {
    id: string;
    name: string;
    type: "retail" | "high_net_worth" | "institutional";
    riskRating: "low" | "medium" | "high";
    isPEP: boolean;
    isSanctioned: boolean;
    accountOpenDate: string;
    country: string;
    phone?: string;
    email?: string;
    beneficialOwner?: string;
  };
  transactions: Array<{
    id: string;
    type: "buy" | "sell" | "deposit" | "withdrawal" | "transfer";
    instrument?: string;
    amount: number;
    currency: string;
    quantity?: number;
    timestamp: string;
    status: "completed" | "pending" | "failed";
  }>;
  onClose: () => void;
}

export function CaseDetail({ alert, customer, transactions, onClose }: CaseDetailProps) {
  const [notes, setNotes] = useState("");
  const [outcome, setOutcome] = useState<string>("");
  const [showEscalateDialog, setShowEscalateDialog] = useState(false);
  const [showCloseDialog, setShowCloseDialog] = useState(false);

  const handleEscalate = () => {
    console.log("Escalating case:", alert.id, { notes });
    setShowEscalateDialog(false);
  };

  const handleClose = () => {
    console.log("Closing case:", alert.id, { outcome, notes });
    setShowCloseDialog(false);
    onClose();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-semibold">Case Investigation</h2>
            <AlertBadge type="priority" value={alert.priority} />
            <AlertBadge type="status" value={alert.status} />
          </div>
          <p className="text-sm text-muted-foreground font-mono mt-1">{alert.id}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowCloseDialog(true)}
            data-testid="button-close-case"
          >
            <X className="h-4 w-4 mr-2" />
            Close Case
          </Button>
          <Button
            variant="default"
            onClick={() => setShowEscalateDialog(true)}
            data-testid="button-escalate-case"
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Escalate to MLRO
          </Button>
        </div>
      </div>

      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <h4 className="font-semibold">{alert.ruleTriggered}</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Triggered on {alert.timestamp}. Risk score: <span className="font-semibold">{alert.riskScore}</span>
              </p>
              {alert.amount && (
                <p className="text-sm text-muted-foreground">
                  Transaction amount: <span className="font-semibold">{alert.currency} {alert.amount.toLocaleString()}</span>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 max-w-md">
          <TabsTrigger value="overview" data-testid="tab-overview">
            <FileText className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="customer" data-testid="tab-customer">
            <User className="h-4 w-4 mr-2" />
            Customer
          </TabsTrigger>
          <TabsTrigger value="transactions" data-testid="tab-transactions">
            <History className="h-4 w-4 mr-2" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="notes" data-testid="tab-notes">
            <Clock className="h-4 w-4 mr-2" />
            Notes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Alert Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Alert ID</span>
                  <span className="font-mono">{alert.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Customer</span>
                  <span>{alert.customerName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Rule Triggered</span>
                  <span>{alert.ruleTriggered}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Risk Score</span>
                  <span className={`font-semibold ${
                    alert.riskScore >= 80 ? "text-red-600 dark:text-red-400" :
                    alert.riskScore >= 50 ? "text-amber-600 dark:text-amber-400" :
                    "text-green-600 dark:text-green-400"
                  }`}>{alert.riskScore}/100</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span>{alert.timestamp}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" data-testid="button-view-kyc">
                  <FileText className="h-4 w-4 mr-2" />
                  View KYC Documents
                </Button>
                <Button variant="outline" className="w-full justify-start" data-testid="button-view-prior-alerts">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  View Prior Alerts (3)
                </Button>
                <Button variant="outline" className="w-full justify-start" data-testid="button-prepare-str">
                  <FileText className="h-4 w-4 mr-2" />
                  Prepare STR/SAR
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="customer" className="mt-6">
          <CustomerProfile customer={customer} />
        </TabsContent>

        <TabsContent value="transactions" className="mt-6">
          <TransactionTimeline transactions={transactions} />
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Investigation Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Add your investigation notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[150px]"
                data-testid="textarea-notes"
              />
              <Button data-testid="button-save-notes" onClick={() => console.log("Notes saved:", notes)}>
                <Check className="h-4 w-4 mr-2" />
                Save Notes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={showEscalateDialog} onOpenChange={setShowEscalateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escalate to MLRO</DialogTitle>
            <DialogDescription>
              This will escalate the case to the Money Laundering Reporting Officer for review.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Textarea
              placeholder="Reason for escalation..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
              data-testid="textarea-escalation-reason"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEscalateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleEscalate} data-testid="button-confirm-escalate">
              Confirm Escalation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Close Case</DialogTitle>
            <DialogDescription>
              Select the outcome and provide a rationale for closing this case.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Select value={outcome} onValueChange={setOutcome}>
              <SelectTrigger data-testid="select-outcome">
                <SelectValue placeholder="Select outcome" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false_positive">False Positive</SelectItem>
                <SelectItem value="no_suspicious_activity">No Suspicious Activity</SelectItem>
                <SelectItem value="str_filed">STR/SAR Filed</SelectItem>
                <SelectItem value="account_action_taken">Account Action Taken</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Rationale for closing..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-[100px]"
              data-testid="textarea-close-rationale"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCloseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleClose} disabled={!outcome} data-testid="button-confirm-close">
              Close Case
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
