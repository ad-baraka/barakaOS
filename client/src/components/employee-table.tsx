import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Eye, Send } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: "not_started" | "in_progress" | "submitted" | "completed";
  dueDate: string;
}

interface EmployeeTableProps {
  employees: Employee[];
  onView?: (id: string) => void;
  onRemind?: (id: string) => void;
}

const statusConfig = {
  not_started: { label: "Not Started", variant: "secondary" as const },
  in_progress: { label: "In Progress", variant: "default" as const },
  submitted: { label: "Submitted", variant: "outline" as const },
  completed: { label: "Completed", variant: "outline" as const },
};

export function EmployeeTable({ employees, onView, onRemind }: EmployeeTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.map((employee) => {
            const statusInfo = statusConfig[employee.status];
            const initials = employee.name
              .split(" ")
              .map((n) => n[0])
              .join("");

            return (
              <TableRow key={employee.id} data-testid={`row-employee-${employee.id}`}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={employee.avatar} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{employee.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{employee.role}</TableCell>
                <TableCell>
                  <Badge variant={statusInfo.variant} data-testid={`badge-status-${employee.id}`}>
                    {statusInfo.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">{employee.dueDate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" data-testid={`button-menu-${employee.id}`}>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => onView?.(employee.id)}
                        data-testid={`button-view-${employee.id}`}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      {employee.status !== "completed" && (
                        <DropdownMenuItem
                          onClick={() => onRemind?.(employee.id)}
                          data-testid={`button-remind-${employee.id}`}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Send Reminder
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
