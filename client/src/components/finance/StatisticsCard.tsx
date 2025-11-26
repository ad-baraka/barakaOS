import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatisticsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
  variant?: "default" | "success" | "warning" | "info";
}

export function StatisticsCard({
  icon: Icon,
  label,
  value,
  variant = "default",
}: StatisticsCardProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "border-green-600/20 bg-green-50/50 dark:border-green-600/30 dark:bg-green-950/20";
      case "warning":
        return "border-yellow-600/20 bg-yellow-50/50 dark:border-yellow-600/30 dark:bg-yellow-950/20";
      case "info":
        return "border-blue-600/20 bg-blue-50/50 dark:border-blue-600/30 dark:bg-blue-950/20";
      default:
        return "";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "success":
        return "text-green-700 dark:text-green-400";
      case "warning":
        return "text-yellow-700 dark:text-yellow-400";
      case "info":
        return "text-blue-700 dark:text-blue-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <Card className={`p-6 ${getVariantClasses()}`} data-testid={`stat-card-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-2xl font-bold text-foreground mb-1" data-testid={`stat-value-${label.toLowerCase().replace(/\s+/g, "-")}`}>
            {value.toLocaleString()}
          </p>
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {label}
          </p>
        </div>
        <Icon className={`w-6 h-6 ${getIconColor()}`} />
      </div>
    </Card>
  );
}
