import { Badge } from "@/components/ui/badge";
import { AlertTriangle, AlertCircle, Info, CheckCircle, Clock, ArrowUp } from "lucide-react";

type Priority = "high" | "medium" | "low";
type Status = "new" | "in_progress" | "escalated" | "closed";

interface AlertBadgeProps {
  type: "priority" | "status";
  value: Priority | Status;
}

const priorityConfig = {
  high: {
    label: "High",
    className: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
    icon: AlertTriangle,
  },
  medium: {
    label: "Medium",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    icon: AlertCircle,
  },
  low: {
    label: "Low",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    icon: Info,
  },
};

const statusConfig = {
  new: {
    label: "New",
    className: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    icon: AlertCircle,
  },
  in_progress: {
    label: "In Progress",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
    icon: Clock,
  },
  escalated: {
    label: "Escalated",
    className: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800",
    icon: ArrowUp,
  },
  closed: {
    label: "Closed",
    className: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    icon: CheckCircle,
  },
};

export function AlertBadge({ type, value }: AlertBadgeProps) {
  const config = type === "priority"
    ? priorityConfig[value as Priority]
    : statusConfig[value as Status];
  const Icon = config.icon;

  return (
    <Badge variant="outline" className={`${config.className} gap-1`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
