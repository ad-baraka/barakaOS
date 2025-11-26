import { StatusCard } from "@/components/status-card";
import { EmployeeTable } from "@/components/employee-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Clock, AlertCircle, Search, Download, Loader2, Users } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context";
import type { Employee } from "@shared/schema";

interface DirectReportWithStatus extends Employee {
  reviewStatus: "completed" | "submitted" | "in_progress" | "not_started";
  dueDate: string;
}

export default function ManagerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  const { data: currentEmployee, isLoading: isLoadingEmployee } = useQuery({
    queryKey: ["employee-by-user", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const res = await apiRequest("GET", `/api/employees/by-user/${user.id}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to fetch employee");
      }
      return res.json() as Promise<Employee>;
    },
    enabled: !!user?.id,
  });

  const { data: directReports = [], isLoading: isLoadingReports } = useQuery({
    queryKey: ["direct-reports", currentEmployee?.employeeId],
    queryFn: async () => {
      if (!currentEmployee?.employeeId) return [];
      const res = await apiRequest("GET", `/api/employees/${currentEmployee.employeeId}/reports`);
      if (!res.ok) {
        throw new Error("Failed to fetch direct reports");
      }
      const reports = await res.json() as Employee[];
      return reports.map((emp): DirectReportWithStatus => ({
        ...emp,
        reviewStatus: getRandomStatus(),
        dueDate: "Dec 15, 2025",
      }));
    },
    enabled: !!currentEmployee?.employeeId,
  });

  const getRandomStatus = (): DirectReportWithStatus["reviewStatus"] => {
    const statuses: DirectReportWithStatus["reviewStatus"][] = [
      "completed", "submitted", "in_progress", "not_started"
    ];
    return statuses[Math.floor(Math.random() * statuses.length)];
  };

  const filteredEmployees = directReports.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const employeesForTable = filteredEmployees.map((emp) => ({
    id: emp.employeeId,
    name: emp.name,
    role: emp.position || "Team Member",
    status: emp.reviewStatus,
    dueDate: emp.dueDate,
  }));

  const completedCount = directReports.filter(e => e.reviewStatus === "completed" || e.reviewStatus === "submitted").length;
  const pendingCount = directReports.filter(e => e.reviewStatus === "in_progress").length;
  const needsAttentionCount = directReports.filter(e => e.reviewStatus === "not_started").length;
  const totalCount = directReports.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const isLoading = isLoadingEmployee || isLoadingReports;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!currentEmployee) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Team Reviews</h1>
          <p className="text-muted-foreground mt-1">
            Q4 2025 Performance Review Cycle
          </p>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[300px] border rounded-lg bg-muted/50">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No Employee Profile Found</p>
          <p className="text-muted-foreground text-center max-w-md mt-2">
            Your user account is not linked to an employee profile. Please contact your administrator to link your account.
          </p>
        </div>
      </div>
    );
  }

  if (directReports.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Team Reviews</h1>
            <p className="text-muted-foreground mt-1">
              Q4 2025 Performance Review Cycle
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center min-h-[300px] border rounded-lg bg-muted/50">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">No Direct Reports</p>
          <p className="text-muted-foreground text-center max-w-md mt-2">
            You don't have any direct reports assigned in the system.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Team Reviews</h1>
          <p className="text-muted-foreground mt-1">
            Q4 2025 Performance Review Cycle
          </p>
        </div>
        <Button variant="outline" data-testid="button-export">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          title="Completion Rate"
          value={`${completionRate}%`}
          description={`${completedCount} of ${totalCount} completed`}
          icon={CheckCircle2}
          trend={{ value: 12, isPositive: true }}
        />
        <StatusCard
          title="Pending Reviews"
          value={String(pendingCount)}
          description="Awaiting submission"
          icon={Clock}
        />
        <StatusCard
          title="Needs Attention"
          value={String(needsAttentionCount)}
          description="Not started"
          icon={AlertCircle}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
              data-testid="input-search"
            />
          </div>
        </div>

        <EmployeeTable
          employees={employeesForTable}
          onView={(id) => console.log("View employee:", id)}
          onRemind={(id) => console.log("Remind employee:", id)}
        />
      </div>
    </div>
  );
}
