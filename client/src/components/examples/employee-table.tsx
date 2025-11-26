import { EmployeeTable } from "../employee-table";

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
];

export default function EmployeeTableExample() {
  return (
    <div className="p-6">
      <EmployeeTable
        employees={mockEmployees}
        onView={(id) => console.log("View employee:", id)}
        onRemind={(id) => console.log("Remind employee:", id)}
      />
    </div>
  );
}
