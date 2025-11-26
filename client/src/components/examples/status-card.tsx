import { StatusCard } from "../status-card";
import { CheckCircle2, Clock, AlertCircle } from "lucide-react";

export default function StatusCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
      <StatusCard
        title="Completion Rate"
        value="92%"
        description="Current cycle"
        icon={CheckCircle2}
        trend={{ value: 8, isPositive: true }}
      />
      <StatusCard
        title="Pending Reviews"
        value="12"
        description="Awaiting completion"
        icon={Clock}
      />
      <StatusCard
        title="Overdue"
        value="3"
        description="Need attention"
        icon={AlertCircle}
      />
    </div>
  );
}
