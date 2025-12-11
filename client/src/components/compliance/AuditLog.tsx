import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Lock, User, Settings, FileText, AlertTriangle, Eye } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AuditEntry {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: "view" | "update" | "create" | "delete" | "escalate" | "close" | "export" | "login" | "config_change";
  resource: string;
  resourceId?: string;
  details?: string;
  ipAddress?: string;
}

interface AuditLogProps {
  entries: AuditEntry[];
}

const actionConfig = {
  view: { label: "View", icon: Eye, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  update: { label: "Update", icon: Settings, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  create: { label: "Create", icon: FileText, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  delete: { label: "Delete", icon: AlertTriangle, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  escalate: { label: "Escalate", icon: AlertTriangle, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
  close: { label: "Close", icon: FileText, color: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400" },
  export: { label: "Export", icon: Download, color: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400" },
  login: { label: "Login", icon: User, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  config_change: { label: "Config", icon: Settings, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
};

export function AuditLog({ entries }: AuditLogProps) {
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [userFilter, setUserFilter] = useState<string>("all");

  const uniqueUsers = Array.from(new Set(entries.map((e) => e.userName)));

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.resource.toLowerCase().includes(search.toLowerCase()) ||
      entry.details?.toLowerCase().includes(search.toLowerCase()) ||
      entry.resourceId?.toLowerCase().includes(search.toLowerCase());
    const matchesAction = actionFilter === "all" || entry.action === actionFilter;
    const matchesUser = userFilter === "all" || entry.userName === userFilter;
    return matchesSearch && matchesAction && matchesUser;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg">Audit Log</CardTitle>
            <Badge variant="secondary" className="gap-1">
              <Lock className="h-3 w-3" />
              Immutable
            </Badge>
          </div>
          <Button variant="outline" size="sm" data-testid="button-export-audit">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search audit log..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
              data-testid="input-search-audit"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[140px]" data-testid="select-action-filter">
              <SelectValue placeholder="Action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="view">View</SelectItem>
              <SelectItem value="update">Update</SelectItem>
              <SelectItem value="create">Create</SelectItem>
              <SelectItem value="escalate">Escalate</SelectItem>
              <SelectItem value="close">Close</SelectItem>
              <SelectItem value="export">Export</SelectItem>
              <SelectItem value="config_change">Config</SelectItem>
            </SelectContent>
          </Select>
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-[160px]" data-testid="select-user-filter">
              <SelectValue placeholder="User" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {uniqueUsers.map((user) => (
                <SelectItem key={user} value={user}>{user}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredEntries.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No audit entries found</p>
          ) : (
            filteredEntries.map((entry) => {
              const config = actionConfig[entry.action];
              const Icon = config.icon;
              return (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
                >
                  <div className={`p-1.5 rounded ${config.color}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm">{entry.userName}</span>
                      <Badge variant="outline" className="text-xs">
                        {config.label}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{entry.resource}</span>
                      {entry.resourceId && (
                        <span className="text-xs font-mono text-muted-foreground">{entry.resourceId}</span>
                      )}
                    </div>
                    {entry.details && (
                      <p className="text-xs text-muted-foreground mt-1">{entry.details}</p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{entry.timestamp}</span>
                      {entry.ipAddress && (
                        <span className="text-xs text-muted-foreground font-mono">{entry.ipAddress}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
