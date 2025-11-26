import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, Send, XCircle } from "lucide-react";

type DocumentStatus = "pending" | "sent" | "signed" | "failed";

interface StatusBadgeProps {
  status: DocumentStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      label: "Pending",
      variant: "secondary" as const,
      icon: Clock,
    },
    sent: {
      label: "Sent",
      variant: "default" as const,
      icon: Send,
    },
    signed: {
      label: "Signed",
      variant: "default" as const,
      icon: CheckCircle2,
    },
    failed: {
      label: "Failed",
      variant: "destructive" as const,
      icon: XCircle,
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1" data-testid={`badge-status-${status}`}>
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}
