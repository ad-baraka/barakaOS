import { RatingScale } from "../rating-scale";
import { useState } from "react";

export default function RatingScaleExample() {
  const [rating, setRating] = useState<number>(3);

  return (
    <div className="p-6 max-w-2xl">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Rate Performance</h3>
          <RatingScale value={rating} onChange={setRating} />
        </div>
        <div className="text-sm text-muted-foreground">
          Selected rating: {rating}
        </div>
      </div>
    </div>
  );
}
