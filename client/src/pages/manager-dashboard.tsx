import { StatusCard } from "@/components/status-card";
import { EmployeeTable } from "@/components/employee-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2, Clock, AlertCircle, Search, Download } from "lucide-react";
import { useState } from "react";

const mockEmployees = [
  {
    id: "1",
    name: "Sarah Chen",
    role: "Senior Engineer",
    status: "completed" as const,
    dueDate: "Dec 15, 2025",
  },
  {
    id: "2",
    name: "Michael Roberts",
    role: "Product Designer",
    status: "submitted" as const,
    dueDate: "Dec 15, 2025",
  },
  {
    id: "3",
    name: "Emily Thompson",
    role: "Engineering Manager",
    status: "in_progress" as const,
    dueDate: "Dec 15, 2025",
  },
  {
    id: "4",
    name: "David Martinez",
    role: "Software Engineer",
    status: "not_started" as const,
    dueDate: "Dec 15, 2025",
  },
  {
    id: "5",
    name: "Jessica Wang",
    role: "UX Researcher",
    status: "in_progress" as const,
    dueDate: "Dec 15, 2025",
  },
];

export default function ManagerDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmployees = mockEmployees.filter((emp) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Team Reviews</h1>
          <p className="text-muted-foreground mt-2">
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
          value="80%"
          description="4 of 5 completed"
          icon={CheckCircle2}
          trend={{ value: 12, isPositive: true }}
        />
        <StatusCard
          title="Pending Reviews"
          value="2"
          description="Awaiting submission"
          icon={Clock}
        />
        <StatusCard
          title="Needs Attention"
          value="1"
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
          employees={filteredEmployees}
          onView={(id) => console.log("View employee:", id)}
          onRemind={(id) => console.log("Remind employee:", id)}
        />
      </div>
    </div>
  );
}
