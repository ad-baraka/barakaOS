import { ReviewCycleCard } from "../review-cycle-card";

export default function ReviewCycleCardExample() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 max-w-5xl">
      <ReviewCycleCard
        name="Q4 2025 Review"
        startDate={new Date("2025-10-01")}
        endDate={new Date("2025-12-31")}
        status="in_progress"
        progress={65}
        daysRemaining={14}
        onContinue={() => console.log("Continue clicked")}
      />
      <ReviewCycleCard
        name="Q3 2025 Review"
        startDate={new Date("2025-07-01")}
        endDate={new Date("2025-09-30")}
        status="completed"
        onView={() => console.log("View clicked")}
      />
    </div>
  );
}
