import { ReviewFormSection } from "@/components/performance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Save, Send, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SelfReview() {
  const [achievements, setAchievements] = useState("");
  const [challenges, setChallenges] = useState("");
  const [growth, setGrowth] = useState("");
  const [overallRating, setOverallRating] = useState<number>(0);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const filled = [achievements, challenges, growth, overallRating].filter(Boolean).length;
    setProgress((filled / 4) * 100);
  }, [achievements, challenges, growth, overallRating]);

  const handleSave = () => {
    toast({
      title: "Progress saved",
      description: "Your review has been saved automatically.",
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Review submitted",
      description: "Your review has been submitted successfully.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <CardTitle>Q4 2025 Performance Review</CardTitle>
                <Badge variant="default">In Progress</Badge>
              </div>
              <CardDescription className="mt-2">
                Due December 31, 2025 • 14 days remaining
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle className="h-4 w-4" />
              <span>Auto-saved</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{Math.round(progress)}% complete</span>
            </div>
            <Progress value={progress} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Self-Assessment</CardTitle>
          <CardDescription>
            Reflect on your performance and achievements this quarter
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <ReviewFormSection
            title="Key Achievements"
            description="What were your most significant accomplishments this quarter?"
            type="text"
            value={achievements}
            onChange={(val) => setAchievements(val as string)}
            placeholder="Describe your key achievements, projects completed, and impact made..."
            required
          />

          <Separator />

          <ReviewFormSection
            title="Challenges"
            description="What challenges did you face this quarter?"
            type="text"
            value={challenges}
            onChange={(val) => setChallenges(val as string)}
            placeholder="Discuss any obstacles you encountered..."
            required
          />

          <Separator />

          <ReviewFormSection
            title="Growth"
            description="What do you want to learn going forward?"
            type="text"
            value={growth}
            onChange={(val) => setGrowth(val as string)}
            placeholder="Describe skills or areas you'd like to develop..."
            required
          />

          <Separator />

          <ReviewFormSection
            title="Overall Performance"
            description="How would you rate your overall performance?"
            type="rating"
            value={overallRating}
            onChange={(val) => setOverallRating(val as number)}
            required
          />
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3 sticky bottom-6">
        <Button variant="outline" onClick={handleSave} data-testid="button-save">
          <Save className="h-4 w-4 mr-2" />
          Save Draft
        </Button>
        <Button onClick={handleSubmit} disabled={progress < 100} data-testid="button-submit">
          <Send className="h-4 w-4 mr-2" />
          Submit Review
        </Button>
      </div>
    </div>
  );
}
