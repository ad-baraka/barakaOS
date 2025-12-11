import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertsByRuleChart, AlertsByStatusChart, AlertTrendChart } from "@/components/compliance";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Clock, Target, TrendingUp, Users } from "lucide-react";
import { useState } from "react";

const mockAlertsByRule = [
  { rule: "Large Transaction", count: 145 },
  { rule: "Rapid Trading", count: 98 },
  { rule: "PEP Match", count: 52 },
  { rule: "Sanctions Match", count: 28 },
  { rule: "New Account Activity", count: 87 },
  { rule: "Cross-Border", count: 112 },
];

const mockAlertsByStatus = [
  { name: "New", value: 142, color: "hsl(217, 91%, 60%)" },
  { name: "In Progress", value: 98, color: "hsl(45, 93%, 47%)" },
  { name: "Escalated", value: 45, color: "hsl(271, 91%, 65%)" },
  { name: "Closed", value: 312, color: "hsl(142, 71%, 45%)" },
];

const mockAlertTrend = [
  { date: "Week 1", alerts: 45, resolved: 38 },
  { date: "Week 2", alerts: 62, resolved: 55 },
  { date: "Week 3", alerts: 38, resolved: 42 },
  { date: "Week 4", alerts: 78, resolved: 65 },
];

const mockMetrics = {
  avgResolutionTime: "3.2 hours",
  falsePositiveRate: "18%",
  complianceCoverage: "100%",
  strFilingRate: "100%",
  alertsPerDay: 24,
  investigatorEfficiency: "92%",
};

export default function AMLAnalytics() {
  const [period, setPeriod] = useState("30d");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Analytics & Insights</h1>
          <p className="text-muted-foreground mt-1">
            Performance metrics and compliance analytics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[150px]" data-testid="select-period">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" data-testid="button-export-analytics">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Avg Resolution Time
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{mockMetrics.avgResolutionTime}</div>
            <Badge variant="secondary" className="mt-1 text-xs">
              Target: &lt;4h
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              False Positive Rate
            </CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{mockMetrics.falsePositiveRate}</div>
            <Badge className="mt-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              -5% vs target
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Compliance Coverage
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{mockMetrics.complianceCoverage}</div>
            <Badge className="mt-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              All accounts
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              STR Filing Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{mockMetrics.strFilingRate}</div>
            <Badge className="mt-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              On time
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Alerts / Day
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{mockMetrics.alertsPerDay}</div>
            <Badge variant="secondary" className="mt-1 text-xs">
              Avg this month
            </Badge>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">
              Team Efficiency
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-semibold">{mockMetrics.investigatorEfficiency}</div>
            <Badge className="mt-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              Above target
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <AlertsByRuleChart data={mockAlertsByRule} />
        <AlertsByStatusChart data={mockAlertsByStatus} />
      </div>

      <AlertTrendChart data={mockAlertTrend} />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key Performance Indicators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Mean Time to Triage</p>
              <p className="text-2xl font-semibold mt-1">2.1 hrs</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Target: &lt;4 hrs</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Cases Closed Within 7 Days</p>
              <p className="text-2xl font-semibold mt-1">94%</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">+8% from last period</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Regulatory Breaches</p>
              <p className="text-2xl font-semibold mt-1">0</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Zero incidents</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">Team Satisfaction</p>
              <p className="text-2xl font-semibold mt-1">8.5/10</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Above target</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
