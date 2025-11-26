import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "./status-badge";
import { Button } from "@/components/ui/button";
import { Eye, Send } from "lucide-react";
import type { NewJoiner } from "@shared/schema";

interface JoinerCardProps {
  joiner: NewJoiner;
  onViewDetails?: (id: string) => void;
  onSendDocuments?: (id: string) => void;
}

export function JoinerCard({ joiner, onViewDetails, onSendDocuments }: JoinerCardProps) {
  return (
    <Card data-testid={`card-joiner-${joiner.id}`}>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">
          {joiner.firstName} {joiner.lastName}
        </CardTitle>
        <StatusBadge status={joiner.offerLetterStatus as any} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Email</span>
            <span className="font-medium text-xs">{joiner.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Position</span>
            <span className="font-medium" data-testid={`text-position-${joiner.id}`}>{joiner.position}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Department</span>
            <span className="font-medium">{joiner.department}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Start Date</span>
            <span className="font-medium">{joiner.startDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Salary</span>
            <span className="font-medium">${Number(joiner.salary).toLocaleString()}</span>
          </div>
          {joiner.equityShares && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Equity Shares</span>
              <span className="font-medium">{joiner.equityShares}</span>
            </div>
          )}
          {joiner.vestingYears && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vesting Years</span>
              <span className="font-medium">{joiner.vestingYears}</span>
            </div>
          )}
          {joiner.cliffYears && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Cliff Years</span>
              <span className="font-medium">{joiner.cliffYears}</span>
            </div>
          )}
          {joiner.vacationDays && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Vacation Days</span>
              <span className="font-medium">{joiner.vacationDays}</span>
            </div>
          )}
          {joiner.remoteVacationDays && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Remote Vacation Days</span>
              <span className="font-medium">{joiner.remoteVacationDays}</span>
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onViewDetails?.(joiner.id)}
            data-testid={`button-view-${joiner.id}`}
          >
            <Eye className="w-4 h-4 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onSendDocuments?.(joiner.id)}
            data-testid={`button-send-${joiner.id}`}
          >
            <Send className="w-4 h-4 mr-1" />
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
