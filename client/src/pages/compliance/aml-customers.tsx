import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CustomerProfile } from "@/components/compliance";
import {
  Search,
  Download,
  Users,
  AlertTriangle,
  Shield,
  ArrowLeft,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Customer {
  id: string;
  name: string;
  type: "retail" | "high_net_worth" | "institutional";
  riskRating: "low" | "medium" | "high";
  isPEP: boolean;
  isSanctioned: boolean;
  accountOpenDate: string;
  country: string;
  alertCount: number;
  phone?: string;
  email?: string;
  beneficialOwner?: string;
}

const mockCustomers: Customer[] = [
  {
    id: "CUS-78234",
    name: "Ahmad Al-Rashid",
    type: "high_net_worth",
    riskRating: "high",
    isPEP: true,
    isSanctioned: false,
    accountOpenDate: "2022-03-15",
    country: "United Arab Emirates",
    alertCount: 5,
    phone: "+971 50 123 4567",
    email: "a.rashid@example.com",
    beneficialOwner: "Al-Rashid Holdings LLC",
  },
  {
    id: "CUS-45123",
    name: "Sarah Johnson",
    type: "retail",
    riskRating: "low",
    isPEP: false,
    isSanctioned: false,
    accountOpenDate: "2023-06-20",
    country: "United States",
    alertCount: 1,
    email: "s.johnson@example.com",
  },
  {
    id: "CUS-89012",
    name: "Mohamed Hassan",
    type: "institutional",
    riskRating: "high",
    isPEP: true,
    isSanctioned: false,
    accountOpenDate: "2021-11-08",
    country: "Egypt",
    alertCount: 8,
    beneficialOwner: "Hassan Capital Partners",
  },
  {
    id: "CUS-34567",
    name: "James Wilson",
    type: "retail",
    riskRating: "medium",
    isPEP: false,
    isSanctioned: false,
    accountOpenDate: "2024-01-15",
    country: "United Kingdom",
    alertCount: 2,
    email: "j.wilson@example.com",
  },
  {
    id: "CUS-56789",
    name: "Fatima Al-Maktoum",
    type: "high_net_worth",
    riskRating: "high",
    isPEP: true,
    isSanctioned: false,
    accountOpenDate: "2020-09-01",
    country: "United Arab Emirates",
    alertCount: 3,
    beneficialOwner: "Al-Maktoum Family Trust",
  },
];

export default function AMLCustomers() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  const filteredCustomers = mockCustomers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(search.toLowerCase()) ||
      customer.id.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === "all" || customer.riskRating === riskFilter;
    const matchesType = typeFilter === "all" || customer.type === typeFilter;
    return matchesSearch && matchesRisk && matchesType;
  });

  const riskColors = {
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };

  const typeLabels = {
    retail: "Retail",
    high_net_worth: "HNW",
    institutional: "Institutional",
  };

  if (selectedCustomer) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedCustomer(null)}
          className="mb-4"
          data-testid="button-back-to-customers"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Customers
        </Button>
        <CustomerProfile customer={selectedCustomer} />
      </div>
    );
  }

  const totalCustomers = mockCustomers.length;
  const highRiskCount = mockCustomers.filter((c) => c.riskRating === "high").length;
  const pepCount = mockCustomers.filter((c) => c.isPEP).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold">Customer Management</h1>
          <p className="text-muted-foreground mt-1">
            Monitor and manage customer risk profiles
          </p>
        </div>
        <Button variant="outline" data-testid="button-export-customers">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{totalCustomers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              High Risk
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{highRiskCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              PEP Flagged
            </CardTitle>
            <Shield className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{pepCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-search-customers"
          />
        </div>
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-risk-filter">
            <SelectValue placeholder="Risk Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risk Levels</SelectItem>
            <SelectItem value="high">High Risk</SelectItem>
            <SelectItem value="medium">Medium Risk</SelectItem>
            <SelectItem value="low">Low Risk</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-[150px]" data-testid="select-type-filter">
            <SelectValue placeholder="Account Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="high_net_worth">High Net Worth</SelectItem>
            <SelectItem value="institutional">Institutional</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead className="text-center">Risk Rating</TableHead>
              <TableHead className="text-center">Flags</TableHead>
              <TableHead>Country</TableHead>
              <TableHead className="text-center">Alerts</TableHead>
              <TableHead>Account Opened</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No customers found
                </TableCell>
              </TableRow>
            ) : (
              filteredCustomers.map((customer) => {
                const initials = customer.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
                return (
                  <TableRow
                    key={customer.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => setSelectedCustomer(customer)}
                    data-testid={`row-customer-${customer.id}`}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{customer.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {typeLabels[customer.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={riskColors[customer.riskRating]}>
                        {customer.riskRating.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1">
                        {customer.isPEP && (
                          <Badge variant="outline" className="text-purple-600 border-purple-300 dark:text-purple-400 dark:border-purple-700">
                            PEP
                          </Badge>
                        )}
                        {customer.isSanctioned && (
                          <Badge variant="destructive">
                            Sanctioned
                          </Badge>
                        )}
                        {!customer.isPEP && !customer.isSanctioned && (
                          <span className="text-muted-foreground text-sm">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{customer.country}</TableCell>
                    <TableCell className="text-center">
                      {customer.alertCount > 0 ? (
                        <Badge variant="outline">
                          {customer.alertCount}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">0</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {customer.accountOpenDate}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
