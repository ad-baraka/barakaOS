import { Users, Megaphone, CheckSquare, DollarSign } from "lucide-react";
import { KPICard } from "@/components/marketing/KPICard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlatformIcon } from "@/components/marketing/PlatformIcon";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

// TODO: Remove mock data
const performanceData = [
  { date: 'Jan', clicks: 4200, installs: 2400, signups: 1800, funded: 800 },
  { date: 'Feb', clicks: 5100, installs: 3100, signups: 2200, funded: 1100 },
  { date: 'Mar', clicks: 6800, installs: 4200, signups: 3100, funded: 1600 },
  { date: 'Apr', clicks: 7500, installs: 4800, signups: 3500, funded: 1900 },
  { date: 'May', clicks: 8900, installs: 5600, signups: 4200, funded: 2400 },
  { date: 'Jun', clicks: 9200, installs: 6100, signups: 4600, funded: 2700 },
];

const recentActivity = [
  {
    id: 1,
    influencer: "Sarah Johnson",
    platform: "instagram" as const,
    action: "Applied to Summer Campaign 2024",
    time: "2 hours ago",
    type: "application" as const,
  },
  {
    id: 2,
    influencer: "Ahmed Al-Rashid",
    platform: "tiktok" as const,
    action: "Campaign notification sent",
    time: "5 hours ago",
    type: "notification" as const,
  },
  {
    id: 3,
    influencer: "Maria Garcia",
    platform: "youtube" as const,
    action: "Call scheduled for Q2 planning",
    time: "1 day ago",
    type: "interaction" as const,
  },
  {
    id: 4,
    influencer: "John Smith",
    platform: "instagram" as const,
    action: "Application accepted",
    time: "2 days ago",
    type: "application" as const,
  },
];

export default function MarketingDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="text-page-title">Marketing Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your influencer campaigns and performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Influencers"
          value="247"
          icon={Users}
          trend={{ value: "+12% from last month", isPositive: true }}
        />
        <KPICard
          title="Active Campaigns"
          value="18"
          icon={Megaphone}
          trend={{ value: "+3 new this week", isPositive: true }}
        />
        <KPICard
          title="Open Tasks"
          value="34"
          icon={CheckSquare}
          trend={{ value: "-8% from last week", isPositive: true }}
        />
        <KPICard
          title="Pending Payouts"
          value="$45,200"
          icon={DollarSign}
          trend={{ value: "12 awaiting approval", isPositive: false }}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis
                  className="text-xs"
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  name="Clicks"
                />
                <Line
                  type="monotone"
                  dataKey="installs"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  name="Installs"
                />
                <Line
                  type="monotone"
                  dataKey="signups"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={2}
                  name="Signups"
                />
                <Line
                  type="monotone"
                  dataKey="funded"
                  stroke="hsl(var(--chart-4))"
                  strokeWidth={2}
                  name="Funded Accounts"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                data-testid={`activity-${activity.id}`}
              >
                <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <PlatformIcon platform={activity.platform} className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{activity.influencer}</p>
                  <p className="text-sm text-muted-foreground">{activity.action}</p>
                </div>
                <div className="text-xs text-muted-foreground flex-shrink-0">
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
