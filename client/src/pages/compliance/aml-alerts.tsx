import { useState } from "react";
import { AlertsTable, CaseDetail, type Alert } from "@/components/compliance";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";

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
  {
    id: "ALT-2024-006",
    customerId: "CUS-11223",
    customerName: "David Chen",
    ruleTriggered: "Unusual trading hours",
    riskScore: 52,
    priority: "medium",
    status: "new",
    timestamp: "2024-11-27 08:30:00",
  },
  {
    id: "ALT-2024-007",
    customerId: "CUS-44556",
    customerName: "Emma Williams",
    ruleTriggered: "High-frequency small transactions",
    riskScore: 65,
    priority: "medium",
    status: "in_progress",
    timestamp: "2024-11-26 15:45:00",
  },
  {
    id: "ALT-2024-008",
    customerId: "CUS-77889",
    customerName: "Omar Khan",
    ruleTriggered: "Sanctions screening match",
    riskScore: 92,
    priority: "high",
    status: "escalated",
    timestamp: "2024-11-26 10:20:00",
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

export default function AMLAlerts() {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  if (selectedAlert) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedAlert(null)}
          className="mb-4"
          data-testid="button-back-to-alerts"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Alerts
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Alerts Queue</h1>
          <p className="text-muted-foreground mt-1">
            {mockAlerts.length} total alerts requiring attention
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-export-alerts">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <AlertsTable
        alerts={mockAlerts}
        onViewAlert={(alert) => setSelectedAlert(alert)}
      />
    </div>
  );
}
