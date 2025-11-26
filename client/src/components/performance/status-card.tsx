import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatusCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatusCard({ title, value, description, icon: Icon, trend }: StatusCardProps) {
  return (
    <Card data-testid={`card-status-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold" data-testid={`text-status-value-${title.toLowerCase().replace(/\s+/g, "-")}`}>{value}</div>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
        {trend && (
          <p className={`text-sm mt-1 ${trend.isPositive ? "text-green-600 dark:text-green-500" : "text-red-600 dark:text-red-500"}`}>
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}% from last cycle
          </p>
        )}
      </CardContent>
    </Card>
  );
}
