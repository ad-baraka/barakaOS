import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, GitBranch, Bug, Rocket } from "lucide-react";

export default function EngineeringDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Engineering Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Track development progress and engineering metrics
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active PRs</CardTitle>
            <GitBranch className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">Open pull requests</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Bugs</CardTitle>
            <Bug className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">To be fixed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deployments</CardTitle>
            <Rocket className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Code Coverage</CardTitle>
            <Code2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground mt-1">Percentage</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <Code2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-lg font-semibold mb-2">Engineering Module Coming Soon</h3>
          <p className="text-muted-foreground">
            Sprint tracking, code metrics, and CI/CD monitoring will be available here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
