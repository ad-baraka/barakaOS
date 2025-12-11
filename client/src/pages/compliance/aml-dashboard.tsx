import { useState } from "react";
import { StatCard, AlertsTable, DashboardCharts, CaseDetail, type Alert } from "@/components/compliance";
import {
  AlertTriangle,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const mockAlerts: Alert[] = [
  {
    id: "ALT-2024-001",
    customerId: "CUS-78234",
    customerName: "Ahmad Al-Rashid",
    ruleTriggered: "Large transaction threshold exceeded",
    riskScore: 85,
    priority: "high",
    status: "new",
    timestamp: "2024-11-27 14:32:15",
    amount: 250000,
    currency: "AED",
  },
  {
    id: "ALT-2024-002",
    customerId: "CUS-45123",
    customerName: "Sarah Johnson",
    ruleTriggered: "Rapid trading pattern detected",
    riskScore: 72,
    priority: "medium",
    status: "in_progress",
    timestamp: "2024-11-27 12:15:43",
  },
  {
    id: "ALT-2024-003",
    customerId: "CUS-89012",
    customerName: "Mohamed Hassan",
    ruleTriggered: "PEP match detected",
    riskScore: 95,
    priority: "high",
    status: "escalated",
    timestamp: "2024-11-27 09:45:22",
  },
  {
    id: "ALT-2024-004",
    customerId: "CUS-34567",
    customerName: "James Wilson",
    ruleTriggered: "New account unusual activity",
    riskScore: 45,
    priority: "low",
    status: "closed",
    timestamp: "2024-11-26 16:20:11",
  },
  {
    id: "ALT-2024-005",
    customerId: "CUS-56789",
    customerName: "Fatima Al-Maktoum",
    ruleTriggered: "Multiple transfers to new accounts",
    riskScore: 78,
    priority: "high",
    status: "new",
    timestamp: "2024-11-27 11:00:00",
  },
];

const mockCustomer = {
  id: "CUS-78234",
  name: "Ahmad Al-Rashid",
  type: "high_net_worth" as const,
  riskRating: "high" as const,
  isPEP: true,
  isSanctioned: false,
  accountOpenDate: "2022-03-15",
  country: "United Arab Emirates",
  phone: "+971 50 123 4567",
  email: "a.rashid@example.com",
  beneficialOwner: "Al-Rashid Holdings LLC",
};

const mockTransactions = [
  {
    id: "TXN-2024-11270001",
    type: "buy" as const,
    instrument: "AAPL",
    amount: 125000,
    currency: "AED",
    quantity: 500,
    timestamp: "2024-11-27 14:32:15",
    status: "completed" as const,
  },
  {
    id: "TXN-2024-11270002",
    type: "sell" as const,
    instrument: "MSFT",
    amount: 85000,
    currency: "AED",
    quantity: 200,
    timestamp: "2024-11-27 13:15:42",
    status: "completed" as const,
  },
  {
    id: "TXN-2024-11260001",
    type: "deposit" as const,
    amount: 500000,
    currency: "AED",
    timestamp: "2024-11-26 09:00:00",
    status: "completed" as const,
  },
];

const mockAlertsByRule = [
  { rule: "Large Transaction", count: 45 },
  { rule: "Rapid Trading", count: 32 },
  { rule: "PEP Match", count: 18 },
  { rule: "Sanctions Match", count: 12 },
  { rule: "New Account Activity", count: 28 },
];

const mockAlertsByStatus = [
  { name: "New", value: 42, color: "hsl(217, 91%, 60%)" },
  { name: "In Progress", value: 28, color: "hsl(45, 93%, 47%)" },
  { name: "Escalated", value: 15, color: "hsl(271, 91%, 65%)" },
  { name: "Closed", value: 67, color: "hsl(142, 71%, 45%)" },
];

const mockAlertTrend = [
  { date: "Nov 21", alerts: 12, resolved: 8 },
  { date: "Nov 22", alerts: 18, resolved: 15 },
  { date: "Nov 23", alerts: 8, resolved: 12 },
  { date: "Nov 24", alerts: 22, resolved: 14 },
  { date: "Nov 25", alerts: 15, resolved: 18 },
  { date: "Nov 26", alerts: 25, resolved: 20 },
  { date: "Nov 27", alerts: 19, resolved: 16 },
];

export default function AMLDashboard() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  if (selectedAlert) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedAlert(null)}
          className="mb-4"
          data-testid="button-back-to-dashboard"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
        <CaseDetail
          alert={{
            ...selectedAlert,
            description: "Alert generated based on rule trigger",
          }}
          customer={mockCustomer}
          transactions={mockTransactions}
          onClose={() => setSelectedAlert(null)}
        />
      </div>
    );
  }

  const newAlerts = mockAlerts.filter((a) => a.status === "new").length;
  const inProgress = mockAlerts.filter((a) => a.status === "in_progress").length;
  const closed = mockAlerts.filter((a) => a.status === "closed").length;
  const highPriority = mockAlerts.filter((a) => a.priority === "high").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">AML Monitoring Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Overview of AML monitoring and alert status
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="New Alerts"
          value={newAlerts}
          subtitle="Pending review"
          icon={AlertTriangle}
          trend={{ value: 12, isPositive: false }}
        />
        <StatCard
          title="In Progress"
          value={inProgress}
          subtitle="Under investigation"
          icon={Clock}
        />
        <StatCard
          title="Resolved Today"
          value={closed}
          subtitle="Cases closed"
          icon={CheckCircle}
          trend={{ value: 8, isPositive: true }}
        />
        <StatCard
          title="High Priority"
          value={highPriority}
          subtitle="Require immediate attention"
          icon={TrendingUp}
        />
      </div>

      <DashboardCharts
        alertsByRule={mockAlertsByRule}
        alertsByStatus={mockAlertsByStatus}
        alertTrend={mockAlertTrend}
      />

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
        <AlertsTable
          alerts={mockAlerts}
          onViewAlert={(alert) => setSelectedAlert(alert)}
        />
      </div>
    </div>
  );
}
