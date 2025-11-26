import { StatusCard } from "@/components/status-card";
import { ReviewCycleCard } from "@/components/review-cycle-card";
import { CheckCircle2, Clock, Target } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Welcome back, John</h1>
        <p className="text-muted-foreground mt-1">
          Here's your performance review overview
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatusCard
          title="Active Reviews"
          value="2"
          description="In progress"
          icon={Clock}
        />
        <StatusCard
          title="Completed"
          value="8"
          description="All time"
          icon={CheckCircle2}
        />
        <StatusCard
          title="Average Rating"
          value="4.2"
          description="Last 3 cycles"
          icon={Target}
          trend={{ value: 5, isPositive: true }}
        />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Current Review Cycles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReviewCycleCard
            name="Q4 2025 Performance Review"
            startDate={new Date("2025-10-01")}
            endDate={new Date("2025-12-31")}
            status="in_progress"
            progress={65}
            daysRemaining={14}
            onContinue={() => console.log("Continue review")}
          />
          <ReviewCycleCard
            name="Annual Development Plan"
            startDate={new Date("2025-11-01")}
            endDate={new Date("2026-01-15")}
            status="not_started"
            daysRemaining={28}
            onStart={() => console.log("Start review")}
          />
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Past Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ReviewCycleCard
            name="Q3 2025 Performance Review"
            startDate={new Date("2025-07-01")}
            endDate={new Date("2025-09-30")}
            status="completed"
            onView={() => console.log("View review")}
          />
          <ReviewCycleCard
            name="Q2 2025 Performance Review"
            startDate={new Date("2025-04-01")}
            endDate={new Date("2025-06-30")}
            status="completed"
            onView={() => console.log("View review")}
          />
        </div>
      </div>
    </div>
  );
}
