import { ReviewFormSection } from "@/components/performance";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

interface EmployeeData {
  employeeId: string;
  name: string;
  email: string;
  department: string | null;
  position?: string;
  manager: string | null;
  managerId: string | null;
}

export default function ManagerReview() {
  const [managerFeedback, setManagerFeedback] = useState("");
  const [strengths, setStrengths] = useState("");
  const [improvements, setImprovements] = useState("");
  const [overallRating, setOverallRating] = useState<number>(0);
  const [managerData, setManagerData] = useState<EmployeeData | null>(null);
  const [currentEmployee, setCurrentEmployee] = useState<EmployeeData | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    async function fetchManagerData() {
      if (!user?.id) return;
      
      try {
        const empResponse = await fetch(`/api/employees/by-user/${user.id}`);
        if (empResponse.ok) {
          const empData = await empResponse.json();
          setCurrentEmployee(empData);
          
          if (empData.managerId) {
            const managerResponse = await fetch(`/api/employees/${empData.managerId}`);
            if (managerResponse.ok) {
              const manager = await managerResponse.json();
              setManagerData(manager);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching manager data:", error);
      }
    }
    
    fetchManagerData();
  }, [user?.id]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const managerName = managerData?.name || "No Manager Assigned";
  const managerPosition = managerData?.position || "Manager";
  const managerDepartment = managerData?.department || "";

  const handleShare = () => {
    toast({
      title: "Review shared",
      description: `The review has been shared with ${managerName}.`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <Avatar className="h-16 w-16">
                <AvatarImage src="" />
                <AvatarFallback>{managerData ? getInitials(managerName) : "NA"}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <CardTitle>{managerName} - Q4 2025 Review</CardTitle>
                <CardDescription className="mt-1">
                  {managerPosition}{managerDepartment ? ` • ${managerDepartment} Team` : ""}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline">Submitted</Badge>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="self-review" className="space-y-6">
        <TabsList>
          <TabsTrigger value="self-review" data-testid="tab-self-review">Self Review</TabsTrigger>
          <TabsTrigger value="manager-assessment" data-testid="tab-manager-assessment">Manager Assessment</TabsTrigger>
          <TabsTrigger value="previous" data-testid="tab-previous">Previous Reviews</TabsTrigger>
        </TabsList>

        <TabsContent value="self-review" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Employee Self-Assessment</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Key Achievements</h3>
                <p className="text-sm text-muted-foreground">
                  Led the migration of our authentication system to OAuth 2.0, improving security and user experience. Implemented automated testing that reduced bugs by 40%. Mentored two junior engineers.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Challenges & Growth</h3>
                <p className="text-sm text-muted-foreground">
                  Initially struggled with project scope management but improved through better communication with stakeholders. Learned to balance technical debt with feature development.
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Self-Ratings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Technical Skills</span>
                    <Badge>4 - Exceeds Expectations</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Overall Performance</span>
                    <Badge>4 - Exceeds Expectations</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manager-assessment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manager Assessment</CardTitle>
              <CardDescription>
                Provide your evaluation and feedback for this review cycle
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <ReviewFormSection
                title="Overall Feedback"
                description="Provide comprehensive feedback on the employee's performance"
                type="text"
                value={managerFeedback}
                onChange={(val) => setManagerFeedback(val as string)}
                placeholder="Share your overall assessment of their performance, contributions, and impact..."
                required
              />

              <Separator />

              <ReviewFormSection
                title="Key Strengths"
                description="Highlight the employee's strongest areas"
                type="text"
                value={strengths}
                onChange={(val) => setStrengths(val as string)}
                placeholder="List their top strengths and what they excel at..."
                required
              />

              <Separator />

              <ReviewFormSection
                title="Areas for Improvement"
                description="Identify opportunities for growth and development"
                type="text"
                value={improvements}
                onChange={(val) => setImprovements(val as string)}
                placeholder="Suggest areas where they can continue to grow..."
                required
              />

              <Separator />

              <ReviewFormSection
                title="Overall Performance Rating"
                description="Rate their overall performance this cycle"
                type="rating"
                value={overallRating}
                onChange={(val) => setOverallRating(val as number)}
                required
              />
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" data-testid="button-save-draft">
              Save Draft
            </Button>
            <Button onClick={handleShare} data-testid="button-share-review">
              <Share2 className="h-4 w-4 mr-2" />
              Share with Employee
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="previous">
          <Card>
            <CardHeader>
              <CardTitle>Previous Reviews</CardTitle>
              <CardDescription>Historical performance data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Q3 2025 Review</h4>
                    <p className="text-sm text-muted-foreground">Completed September 2025</p>
                  </div>
                  <Badge>4 - Exceeds Expectations</Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <h4 className="font-medium">Q2 2025 Review</h4>
                    <p className="text-sm text-muted-foreground">Completed June 2025</p>
                  </div>
                  <Badge>3 - Meets Expectations</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
