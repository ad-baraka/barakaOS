import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RatingScale } from "./rating-scale";
import { useState } from "react";

interface ReviewFormSectionProps {
  title: string;
  description?: string;
  type: "text" | "rating";
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  required?: boolean;
}

export function ReviewFormSection({
  title,
  description,
  type,
  value,
  onChange,
  placeholder,
  required = false,
}: ReviewFormSectionProps) {
  const [internalValue, setInternalValue] = useState(value);
  const currentValue = value ?? internalValue;

  const handleChange = (newValue: string | number) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-base font-medium">
          {title}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
        {description && (
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {type === "text" && (
        <Textarea
          value={currentValue as string}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[120px] resize-none"
          data-testid={`input-${title.toLowerCase().replace(/\s+/g, "-")}`}
        />
      )}
      {type === "rating" && (
        <RatingScale
          value={currentValue as number}
          onChange={(rating) => handleChange(rating)}
        />
      )}
    </div>
  );
}
