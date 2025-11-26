import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/marketing/StatusBadge";
import { Search, Download, Filter } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// TODO: Remove mock data
const mockPayouts = [
  {
    id: 1,
    influencer: "Sarah Johnson",
    campaign: "Summer Trading Challenge 2024",
    period: "May 2024",
    events: 450,
    amount: 4500,
    currency: "USD",
    status: "pending" as const,
  },
  {
    id: 2,
    influencer: "Ahmed Al-Rashid",
    campaign: "Q2 Brand Awareness",
    period: "May 2024",
    events: 820,
    amount: 12300,
    currency: "AED",
    status: "approved" as const,
  },
  {
    id: 3,
    influencer: "Maria Garcia",
    campaign: "Ramadan Special Offer",
    period: "April 2024",
    events: 320,
    amount: 3200,
    currency: "EUR",
    status: "paid" as const,
  },
  {
    id: 4,
    influencer: "John Smith",
    campaign: "Summer Trading Challenge 2024",
    period: "May 2024",
    events: 1250,
    amount: 18750,
    currency: "USD",
    status: "approved" as const,
  },
  {
    id: 5,
    influencer: "Fatima Hassan",
    campaign: "Q2 Brand Awareness",
    period: "April 2024",
    events: 180,
    amount: 1800,
    currency: "USD",
    status: "paid" as const,
  },
];

export default function MarketingPayouts() {
  const [searchQuery, setSearchQuery] = useState("");

  const totalPending = mockPayouts
    .filter(p => p.status === "pending")
    .reduce((sum, p) => sum + p.amount, 0);

  const totalApproved = mockPayouts
    .filter(p => p.status === "approved")
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-page-title">Payouts</h1>
          <p className="text-muted-foreground mt-1">Manage influencer payments and commissions</p>
        </div>
        <Button data-testid="button-export">
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Pending Approval</p>
          <p className="text-2xl font-semibold" data-testid="text-pending-amount">${totalPending.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {mockPayouts.filter(p => p.status === "pending").length} payouts
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Approved</p>
          <p className="text-2xl font-semibold" data-testid="text-approved-amount">${totalApproved.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {mockPayouts.filter(p => p.status === "approved").length} payouts
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-2">Total Paid This Month</p>
          <p className="text-2xl font-semibold" data-testid="text-paid-amount">$5,000</p>
          <p className="text-xs text-muted-foreground mt-1">
            {mockPayouts.filter(p => p.status === "paid").length} payouts completed
          </p>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payouts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Button variant="outline" data-testid="button-filter">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Influencer</TableHead>
                <TableHead>Campaign</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Events</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockPayouts.map((payout) => (
                <TableRow key={payout.id} data-testid={`row-payout-${payout.id}`}>
                  <TableCell className="font-medium">{payout.influencer}</TableCell>
                  <TableCell className="max-w-xs truncate">{payout.campaign}</TableCell>
                  <TableCell>{payout.period}</TableCell>
                  <TableCell>{payout.events}</TableCell>
                  <TableCell className="font-medium">
                    {payout.currency} {payout.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={payout.status} />
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" data-testid={`button-actions-${payout.id}`}>
                          Actions
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => console.log('View details')}>
                          View Details
                        </DropdownMenuItem>
                        {payout.status === "pending" && (
                          <DropdownMenuItem onClick={() => console.log('Approve payout')}>
                            Approve
                          </DropdownMenuItem>
                        )}
                        {payout.status === "approved" && (
                          <DropdownMenuItem onClick={() => console.log('Mark as paid')}>
                            Mark as Paid
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem onClick={() => console.log('Download invoice')}>
                          Download Invoice
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
