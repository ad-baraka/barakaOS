import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";

interface ReviewCycleCardProps {
  name: string;
  startDate: Date;
  endDate: Date;
  status: "not_started" | "in_progress" | "submitted" | "completed";
  progress?: number;
  daysRemaining?: number;
  onStart?: () => void;
  onContinue?: () => void;
  onView?: () => void;
}

const statusConfig = {
  not_started: { label: "Not Started", variant: "secondary" as const },
  in_progress: { label: "In Progress", variant: "default" as const },
  submitted: { label: "Submitted", variant: "outline" as const },
  completed: { label: "Completed", variant: "outline" as const },
};

export function ReviewCycleCard({
  name,
  startDate,
  endDate,
  status,
  progress = 0,
  daysRemaining,
  onStart,
  onContinue,
  onView,
}: ReviewCycleCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <Card data-testid={`card-review-cycle-${name.toLowerCase().replace(/\s+/g, "-")}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <CardTitle>{name}</CardTitle>
            <CardDescription className="mt-1">
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
                </span>
                {daysRemaining !== undefined && daysRemaining > 0 && (
                  <span className="flex items-center gap-1 text-orange-600 dark:text-orange-500">
                    <Clock className="h-3 w-3" />
                    {daysRemaining} days left
                  </span>
                )}
              </div>
            </CardDescription>
          </div>
          <Badge variant={statusInfo.variant} data-testid="badge-status">
            {statusInfo.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "in_progress" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
        <div className="flex gap-2">
          {status === "not_started" && (
            <Button onClick={onStart} className="flex-1" data-testid="button-start-review">
              Start Review
            </Button>
          )}
          {status === "in_progress" && (
            <Button onClick={onContinue} className="flex-1" data-testid="button-continue-review">
              Continue Review
            </Button>
          )}
          {(status === "submitted" || status === "completed") && (
            <Button onClick={onView} variant="outline" className="flex-1" data-testid="button-view-review">
              View Review
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
