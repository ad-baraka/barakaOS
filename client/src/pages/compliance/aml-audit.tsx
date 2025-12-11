import { AuditLog } from "@/components/compliance";

const mockEntries = [
  {
    id: "AUD-001",
    timestamp: "2024-11-27 14:45:23",
    userId: "USR-001",
    userName: "Sarah Johnson",
    action: "escalate" as const,
    resource: "Alert",
    resourceId: "ALT-2024-001",
    details: "Escalated to MLRO for review - PEP match detected",
    ipAddress: "192.168.1.45",
  },
  {
    id: "AUD-002",
    timestamp: "2024-11-27 14:32:15",
    userId: "USR-002",
    userName: "Ahmed Hassan",
    action: "view" as const,
    resource: "Customer Profile",
    resourceId: "CUS-78234",
    ipAddress: "192.168.1.78",
  },
  {
    id: "AUD-003",
    timestamp: "2024-11-27 13:15:00",
    userId: "USR-001",
    userName: "Sarah Johnson",
    action: "config_change" as const,
    resource: "Rule Configuration",
    resourceId: "RULE-001",
    details: "Updated threshold from 75,000 to 100,000 AED",
    ipAddress: "192.168.1.45",
  },
  {
    id: "AUD-004",
    timestamp: "2024-11-27 12:00:00",
    userId: "USR-003",
    userName: "James Wilson",
    action: "close" as const,
    resource: "Alert",
    resourceId: "ALT-2024-004",
    details: "Marked as false positive - legitimate business transaction",
    ipAddress: "192.168.1.92",
  },
  {
    id: "AUD-005",
    timestamp: "2024-11-27 09:30:00",
    userId: "USR-001",
    userName: "Sarah Johnson",
    action: "login" as const,
    resource: "System",
    ipAddress: "192.168.1.45",
  },
  {
    id: "AUD-006",
    timestamp: "2024-11-27 09:15:00",
    userId: "USR-002",
    userName: "Ahmed Hassan",
    action: "login" as const,
    resource: "System",
    ipAddress: "192.168.1.78",
  },
  {
    id: "AUD-007",
    timestamp: "2024-11-26 17:30:00",
    userId: "USR-001",
    userName: "Sarah Johnson",
    action: "export" as const,
    resource: "Alert Report",
    details: "Exported weekly alert summary report",
    ipAddress: "192.168.1.45",
  },
  {
    id: "AUD-008",
    timestamp: "2024-11-26 16:45:00",
    userId: "USR-003",
    userName: "James Wilson",
    action: "update" as const,
    resource: "Customer Profile",
    resourceId: "CUS-34567",
    details: "Updated risk rating from LOW to MEDIUM",
    ipAddress: "192.168.1.92",
  },
  {
    id: "AUD-009",
    timestamp: "2024-11-26 15:00:00",
    userId: "USR-001",
    userName: "Sarah Johnson",
    action: "create" as const,
    resource: "STR Report",
    resourceId: "STR-2024-015",
    details: "Created new STR for customer CUS-89012",
    ipAddress: "192.168.1.45",
  },
  {
    id: "AUD-010",
    timestamp: "2024-11-26 14:30:00",
    userId: "USR-004",
    userName: "Maria Rodriguez",
    action: "config_change" as const,
    resource: "Rule Configuration",
    resourceId: "RULE-005",
    details: "Enabled wash trading detection rule",
    ipAddress: "192.168.1.55",
  },
];

export default function AMLAudit() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold">Audit Log</h1>
        <p className="text-muted-foreground mt-1">
          Immutable record of all system activities and user actions
        </p>
      </div>
      <AuditLog entries={mockEntries} />
    </div>
  );
}
