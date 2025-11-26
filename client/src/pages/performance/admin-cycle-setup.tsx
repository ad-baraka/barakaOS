import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { id: 1, name: "Basic Info", description: "Cycle details" },
  { id: 2, name: "Template", description: "Choose template" },
  { id: 3, name: "Participants", description: "Select participants" },
  { id: 4, name: "Review", description: "Confirm & launch" },
];

export default function AdminCycleSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [cycleName, setCycleName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [template, setTemplate] = useState("quarterly");
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLaunch = () => {
    toast({
      title: "Review cycle created",
      description: "The review cycle has been launched successfully.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Create Review Cycle</h1>
        <p className="text-muted-foreground mt-1">
          Set up a new performance review cycle
        </p>
      </div>

      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                  currentStep >= step.id
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted bg-background"
                }`}
              >
                {currentStep > step.id ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </div>
              <div className="hidden md:block">
                <div className="text-sm font-medium">{step.name}</div>
                <div className="text-xs text-muted-foreground">{step.description}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <Separator className="flex-1 mx-4" />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[currentStep - 1].name}</CardTitle>
          <CardDescription>{steps[currentStep - 1].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cycle-name">Cycle Name</Label>
                <Input
                  id="cycle-name"
                  placeholder="e.g., Q4 2025 Performance Review"
                  value={cycleName}
                  onChange={(e) => setCycleName(e.target.value)}
                  data-testid="input-cycle-name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    data-testid="input-start-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    data-testid="input-end-date"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <RadioGroup value={template} onValueChange={setTemplate}>
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 rounded-lg border hover-elevate">
                  <RadioGroupItem value="quarterly" id="quarterly" data-testid="radio-quarterly" />
                  <div className="flex-1">
                    <Label htmlFor="quarterly" className="text-base font-medium cursor-pointer">
                      Quarterly Lite
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Streamlined template for quarterly check-ins (4 sections, ~20 min)
                    </p>
                  </div>
                  <Badge variant="secondary">Recommended</Badge>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border hover-elevate">
                  <RadioGroupItem value="biannual" id="biannual" data-testid="radio-biannual" />
                  <div className="flex-1">
                    <Label htmlFor="biannual" className="text-base font-medium cursor-pointer">
                      Bi-annual Full
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Comprehensive template for detailed reviews (8 sections, ~30 min)
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 rounded-lg border hover-elevate">
                  <RadioGroupItem value="manager" id="manager" data-testid="radio-manager" />
                  <div className="flex-1">
                    <Label htmlFor="manager" className="text-base font-medium cursor-pointer">
                      Manager-only Calibration
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Internal manager assessment without employee self-review
                    </p>
                  </div>
                </div>
              </div>
            </RadioGroup>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked data-testid="checkbox-all" />
                  <span className="font-medium">All Employees</span>
                </div>
                <Badge>24 participants</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                All employees with assigned managers will be automatically included in this review cycle.
              </p>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Cycle Name</span>
                    <p className="font-medium">{cycleName || "Not set"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Template</span>
                    <p className="font-medium capitalize">{template.replace("_", " ")}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Start Date</span>
                    <p className="font-medium">{startDate || "Not set"}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">End Date</span>
                    <p className="font-medium">{endDate || "Not set"}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-sm">
                  Launching this cycle will send email notifications to all 24 participants. They will be able to start their reviews immediately.
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          data-testid="button-back"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        {currentStep < steps.length ? (
          <Button onClick={handleNext} data-testid="button-next">
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleLaunch} data-testid="button-launch">
            Launch Cycle
          </Button>
        )}
      </div>
    </div>
  );
}
