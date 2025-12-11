import { useState } from "react";
import { RuleCard } from "@/components/compliance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Rule {
  id: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  threshold?: number;
  thresholdUnit?: string;
  riskWeight: number;
  alertsTriggered: number;
  lastUpdated: string;
}

const initialRules: Rule[] = [
  {
    id: "RULE-001",
    name: "Large Transaction Threshold",
    description: "Triggers when a single transaction exceeds the defined threshold amount",
    category: "Amount",
    isActive: true,
    threshold: 100000,
    thresholdUnit: "AED",
    riskWeight: 75,
    alertsTriggered: 142,
    lastUpdated: "2024-11-15",
  },
  {
    id: "RULE-002",
    name: "Rapid Trading Pattern",
    description: "Detects unusually high frequency of trades within a short time window",
    category: "Pattern",
    isActive: true,
    threshold: 10,
    thresholdUnit: "trades/hour",
    riskWeight: 65,
    alertsTriggered: 87,
    lastUpdated: "2024-11-10",
  },
  {
    id: "RULE-003",
    name: "PEP Match Detection",
    description: "Flags transactions involving Politically Exposed Persons",
    category: "Screening",
    isActive: true,
    riskWeight: 90,
    alertsTriggered: 34,
    lastUpdated: "2024-11-20",
  },
  {
    id: "RULE-004",
    name: "Sanctions Screening",
    description: "Matches customers and counterparties against UN and UAE sanctions lists",
    category: "Screening",
    isActive: true,
    riskWeight: 100,
    alertsTriggered: 12,
    lastUpdated: "2024-11-25",
  },
  {
    id: "RULE-005",
    name: "New Account Unusual Activity",
    description: "Monitors new accounts for suspicious transaction patterns",
    category: "Pattern",
    isActive: true,
    threshold: 30,
    thresholdUnit: "days",
    riskWeight: 70,
    alertsTriggered: 56,
    lastUpdated: "2024-11-12",
  },
  {
    id: "RULE-006",
    name: "Multiple Small Transactions",
    description: "Detects structuring behavior through multiple small transactions",
    category: "Pattern",
    isActive: false,
    threshold: 5000,
    thresholdUnit: "AED",
    riskWeight: 80,
    alertsTriggered: 23,
    lastUpdated: "2024-10-30",
  },
  {
    id: "RULE-007",
    name: "Cross-Border Transaction Monitor",
    description: "Flags high-value international fund transfers",
    category: "Geography",
    isActive: true,
    threshold: 50000,
    thresholdUnit: "AED",
    riskWeight: 60,
    alertsTriggered: 98,
    lastUpdated: "2024-11-18",
  },
  {
    id: "RULE-008",
    name: "Wash Trading Detection",
    description: "Identifies potential wash trading between related accounts",
    category: "Pattern",
    isActive: true,
    riskWeight: 85,
    alertsTriggered: 15,
    lastUpdated: "2024-11-22",
  },
];

export default function AMLRules() {
  const [rules, setRules] = useState(initialRules);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const categories = Array.from(new Set(rules.map((r) => r.category)));

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(search.toLowerCase()) ||
      rule.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "all" || rule.category === categoryFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && rule.isActive) ||
      (statusFilter === "inactive" && !rule.isActive);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleToggle = (id: string, active: boolean) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, isActive: active } : r)));
  };

  const handleUpdate = (id: string, updates: Partial<Rule>) => {
    setRules(rules.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const activeCount = rules.filter((r) => r.isActive).length;
  const totalAlerts = rules.reduce((sum, r) => sum + r.alertsTriggered, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Rules Engine</h1>
          <p className="text-muted-foreground mt-1">
            Configure monitoring rules and thresholds
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="secondary">
              {activeCount} Active
            </Badge>
            <Badge variant="outline">
              {totalAlerts} Alerts Generated
            </Badge>
          </div>
          <Button data-testid="button-add-rule">
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search rules..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-rules"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-category-filter">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-status-filter">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredRules.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No rules found matching your criteria
          </div>
        ) : (
          filteredRules.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              onToggle={handleToggle}
              onUpdate={handleUpdate}
            />
          ))
        )}
      </div>
    </div>
  );
}
