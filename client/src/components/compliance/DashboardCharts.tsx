import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";

interface AlertsByRuleData {
  rule: string;
  count: number;
}

interface AlertsByStatusData {
  name: string;
  value: number;
  color: string;
}

interface AlertTrendData {
  date: string;
  alerts: number;
  resolved: number;
}

interface DashboardChartsProps {
  alertsByRule: AlertsByRuleData[];
  alertsByStatus: AlertsByStatusData[];
  alertTrend: AlertTrendData[];
}

export function AlertsByRuleChart({ data }: { data: AlertsByRuleData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Alerts by Rule Type</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="rule"
                tick={{ fontSize: 11 }}
                width={120}
                tickFormatter={(value) => value.length > 18 ? value.substring(0, 18) + "..." : value}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function AlertsByStatusChart({ data }: { data: AlertsByStatusData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Alerts by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span className="text-sm">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function AlertTrendChart({ data }: { data: AlertTrendData[] }) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base">Alert Trend (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ left: 0, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="alerts"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="New Alerts"
              />
              <Line
                type="monotone"
                dataKey="resolved"
                stroke="hsl(var(--chart-3))"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Resolved"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardCharts({ alertsByRule, alertsByStatus, alertTrend }: DashboardChartsProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <AlertsByRuleChart data={alertsByRule} />
      <AlertsByStatusChart data={alertsByStatus} />
      <AlertTrendChart data={alertTrend} />
    </div>
  );
}
