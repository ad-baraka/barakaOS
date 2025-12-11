import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertBadge } from "./AlertBadge";
import { Eye, Search, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Alert {
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
}

interface AlertsTableProps {
  alerts: Alert[];
  onViewAlert: (alert: Alert) => void;
}

export function AlertsTable({ alerts, onViewAlert }: AlertsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const perPage = 10;

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.customerName.toLowerCase().includes(search.toLowerCase()) ||
      alert.customerId.toLowerCase().includes(search.toLowerCase()) ||
      alert.id.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || alert.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || alert.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredAlerts.length / perPage);
  const paginatedAlerts = filteredAlerts.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search alerts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-alerts"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="escalated">Escalated</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-priority-filter">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="low">Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Alert ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Rule Triggered</TableHead>
              <TableHead className="text-center">Risk Score</TableHead>
              <TableHead className="text-center">Priority</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedAlerts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No alerts found
                </TableCell>
              </TableRow>
            ) : (
              paginatedAlerts.map((alert) => (
                <TableRow key={alert.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onViewAlert(alert)}>
                  <TableCell className="font-mono text-xs">{alert.id}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{alert.customerName}</div>
                      <div className="text-xs text-muted-foreground font-mono">{alert.customerId}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm">{alert.ruleTriggered}</TableCell>
                  <TableCell className="text-center">
                    <span className={`font-semibold ${
                      alert.riskScore >= 80 ? "text-red-600 dark:text-red-400" :
                      alert.riskScore >= 50 ? "text-amber-600 dark:text-amber-400" :
                      "text-green-600 dark:text-green-400"
                    }`}>
                      {alert.riskScore}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <AlertBadge type="priority" value={alert.priority} />
                  </TableCell>
                  <TableCell className="text-center">
                    <AlertBadge type="status" value={alert.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{alert.timestamp}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewAlert(alert);
                      }}
                      data-testid={`button-view-alert-${alert.id}`}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * perPage + 1} to {Math.min(page * perPage, filteredAlerts.length)} of {filteredAlerts.length} alerts
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              data-testid="button-prev-page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
              data-testid="button-next-page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
