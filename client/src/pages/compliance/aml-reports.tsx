import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  FileText,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Plus,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface Report {
  id: string;
  type: "str" | "sar" | "monthly" | "quarterly";
  title: string;
  status: "draft" | "submitted" | "acknowledged";
  createdDate: string;
  submittedDate?: string;
  customerId?: string;
  customerName?: string;
}

const mockReports: Report[] = [
  {
    id: "STR-2024-015",
    type: "str",
    title: "Suspicious Transaction Report - Mohamed Hassan",
    status: "submitted",
    createdDate: "2024-11-26",
    submittedDate: "2024-11-27",
    customerId: "CUS-89012",
    customerName: "Mohamed Hassan",
  },
  {
    id: "STR-2024-014",
    type: "str",
    title: "Suspicious Transaction Report - Ahmad Al-Rashid",
    status: "draft",
    createdDate: "2024-11-27",
    customerId: "CUS-78234",
    customerName: "Ahmad Al-Rashid",
  },
  {
    id: "SAR-2024-008",
    type: "sar",
    title: "Suspicious Activity Report - Multiple Accounts",
    status: "acknowledged",
    createdDate: "2024-11-20",
    submittedDate: "2024-11-21",
  },
  {
    id: "RPT-2024-Q3",
    type: "quarterly",
    title: "Q3 2024 Compliance Report",
    status: "submitted",
    createdDate: "2024-10-15",
    submittedDate: "2024-10-16",
  },
  {
    id: "RPT-2024-11",
    type: "monthly",
    title: "November 2024 AML Summary",
    status: "draft",
    createdDate: "2024-11-25",
  },
];

export default function AMLReports() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showNewReport, setShowNewReport] = useState(false);

  const filteredReports = mockReports.filter((report) => {
    const matchesType = typeFilter === "all" || report.type === typeFilter;
    const matchesStatus = statusFilter === "all" || report.status === statusFilter;
    return matchesType && matchesStatus;
  });

  const typeLabels = {
    str: "STR",
    sar: "SAR",
    monthly: "Monthly",
    quarterly: "Quarterly",
  };

  const typeColors = {
    str: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    sar: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    monthly: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    quarterly: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };

  const statusConfig = {
    draft: { icon: FileText, color: "text-muted-foreground", label: "Draft" },
    submitted: { icon: Clock, color: "text-amber-600 dark:text-amber-400", label: "Submitted" },
    acknowledged: { icon: CheckCircle, color: "text-green-600 dark:text-green-400", label: "Acknowledged" },
  };

  const strCount = mockReports.filter((r) => r.type === "str").length;
  const draftCount = mockReports.filter((r) => r.status === "draft").length;
  const submittedCount = mockReports.filter((r) => r.status === "submitted" || r.status === "acknowledged").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Regulatory Reports</h1>
          <p className="text-muted-foreground mt-1">
            STR/SAR submissions and compliance reports
          </p>
        </div>
        <Dialog open={showNewReport} onOpenChange={setShowNewReport}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-report">
              <Plus className="h-4 w-4 mr-2" />
              New Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Report</DialogTitle>
              <DialogDescription>
                Start a new regulatory report for submission to FIU/DFSA
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select defaultValue="str">
                  <SelectTrigger data-testid="select-report-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="str">Suspicious Transaction Report (STR)</SelectItem>
                    <SelectItem value="sar">Suspicious Activity Report (SAR)</SelectItem>
                    <SelectItem value="monthly">Monthly Summary</SelectItem>
                    <SelectItem value="quarterly">Quarterly Report</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Related Alert/Case ID (optional)</Label>
                <Input placeholder="e.g., ALT-2024-001" data-testid="input-related-alert" />
              </div>
              <div className="space-y-2">
                <Label>Summary</Label>
                <Textarea
                  placeholder="Brief description of suspicious activity..."
                  className="min-h-[100px]"
                  data-testid="textarea-report-summary"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowNewReport(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                console.log("Creating new report");
                setShowNewReport(false);
              }} data-testid="button-create-report">
                Create Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total STRs Filed
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{strCount}</div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Drafts Pending
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{draftCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Submitted
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{submittedCount}</div>
            <p className="text-xs text-muted-foreground">To FIU/DFSA</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[180px]" data-testid="select-type-filter">
            <SelectValue placeholder="Report Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="str">STR</SelectItem>
            <SelectItem value="sar">SAR</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="quarterly">Quarterly</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="submitted">Submitted</SelectItem>
            <SelectItem value="acknowledged">Acknowledged</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredReports.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12 text-muted-foreground">
              No reports found matching your criteria
            </CardContent>
          </Card>
        ) : (
          filteredReports.map((report) => {
            const StatusIcon = statusConfig[report.status].icon;
            return (
              <Card key={report.id} className="cursor-pointer hover:bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-muted">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{report.title}</h3>
                          <Badge className={typeColors[report.type]}>
                            {typeLabels[report.type]}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground font-mono mt-1">{report.id}</p>
                        {report.customerName && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Customer: {report.customerName} ({report.customerId})
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created: {report.createdDate}
                          </div>
                          {report.submittedDate && (
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              Submitted: {report.submittedDate}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`flex items-center gap-1 ${statusConfig[report.status].color}`}>
                        <StatusIcon className="h-4 w-4" />
                        <span className="text-sm font-medium">{statusConfig[report.status].label}</span>
                      </div>
                      <Button variant="outline" size="sm" data-testid={`button-download-${report.id}`}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
