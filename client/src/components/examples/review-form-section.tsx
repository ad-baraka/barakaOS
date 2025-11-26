import { ReviewFormSection } from "../review-form-section";
import { useState } from "react";

export default function ReviewFormSectionExample() {
  const [text, setText] = useState("");
  const [rating, setRating] = useState(4);

  return (
    <div className="p-6 max-w-3xl space-y-8">
      <ReviewFormSection
        title="Key Achievements"
        description="Describe your most significant accomplishments this quarter"
        type="text"
        value={text}
        onChange={(val) => setText(val as string)}
        placeholder="List your key achievements..."
        required
      />
      <ReviewFormSection
        title="Overall Performance"
        description="Rate your overall performance this quarter"
        type="rating"
        value={rating}
        onChange={(val) => setRating(val as number)}
        required
      />
    </div>
  );
}
