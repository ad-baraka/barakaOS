import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface RatingScaleProps {
  value?: number;
  onChange?: (value: number) => void;
  labels?: string[];
  disabled?: boolean;
}

const defaultLabels = [
  "Needs Improvement",
  "Below Expectations",
  "Meets Expectations",
  "Exceeds Expectations",
  "Outstanding",
];

export function RatingScale({
  value,
  onChange,
  labels = defaultLabels,
  disabled = false,
}: RatingScaleProps) {
  const [internalValue, setInternalValue] = useState<number | undefined>(value);
  const currentValue = value ?? internalValue;

  const handleClick = (rating: number) => {
    if (disabled) return;
    setInternalValue(rating);
    onChange?.(rating);
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((rating) => (
          <Button
            key={rating}
            variant={currentValue === rating ? "default" : "outline"}
            className={cn(
              "flex-1 h-12 flex flex-col items-center justify-center gap-1",
              currentValue === rating && "ring-2 ring-ring ring-offset-2"
            )}
            onClick={() => handleClick(rating)}
            disabled={disabled}
            data-testid={`button-rating-${rating}`}
          >
            <span className="text-lg font-semibold">{rating}</span>
          </Button>
        ))}
      </div>
      {currentValue && (
        <p className="text-sm text-center text-muted-foreground" data-testid="text-rating-label">
          {labels[currentValue - 1]}
        </p>
      )}
    </div>
  );
}
