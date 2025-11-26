import { Badge } from "@/components/ui/badge";

type StatusType = "active" | "prospect" | "paused" | "archived" | "draft" | "completed" | "pending" | "approved" | "paid" | "open" | "in_progress" | "cancelled" | "applied" | "shortlisted" | "accepted" | "rejected";

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; variant: "default" | "secondary" | "outline" | "destructive" }> = {
  active: { label: "Active", variant: "default" },
  prospect: { label: "Prospect", variant: "secondary" },
  paused: { label: "Paused", variant: "outline" },
  archived: { label: "Archived", variant: "secondary" },
  draft: { label: "Draft", variant: "secondary" },
  completed: { label: "Completed", variant: "default" },
  pending: { label: "Pending", variant: "outline" },
  approved: { label: "Approved", variant: "default" },
  paid: { label: "Paid", variant: "default" },
  open: { label: "Open", variant: "default" },
  in_progress: { label: "In Progress", variant: "outline" },
  cancelled: { label: "Cancelled", variant: "destructive" },
  applied: { label: "Applied", variant: "secondary" },
  shortlisted: { label: "Shortlisted", variant: "outline" },
  accepted: { label: "Accepted", variant: "default" },
  rejected: { label: "Rejected", variant: "destructive" },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={className} data-testid={`badge-status-${status}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-current mr-1.5"></span>
      {config.label}
    </Badge>
  );
}
