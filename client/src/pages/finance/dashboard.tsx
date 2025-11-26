import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  DollarSign,
  FileText,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function FinanceDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="text-page-title">Finance Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of financial operations and reconciliation</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Deposits</p>
              <p className="text-2xl font-semibold" data-testid="text-total-deposits">$1,234,567</p>
            </div>
            <DollarSign className="h-8 w-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Reconciled Today</p>
              <p className="text-2xl font-semibold" data-testid="text-reconciled-today">45</p>
            </div>
            <CheckCircle className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending Review</p>
              <p className="text-2xl font-semibold" data-testid="text-pending-review">12</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Match Rate</p>
              <p className="text-2xl font-semibold" data-testid="text-match-rate">98.5%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Deposit Reconciliation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Match bank statement transactions with MetaBase deposits to ensure accurate financial records.
            </p>
            <Link href="/finance/reconciliation">
              <Button className="gap-2" data-testid="button-go-to-reconciliation">
                Go to Reconciliation
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Reconciliation completed</p>
                  <p className="text-sm text-muted-foreground">245 transactions matched</p>
                </div>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <div>
                  <p className="font-medium">Bank statement uploaded</p>
                  <p className="text-sm text-muted-foreground">AED account - Nov 2024</p>
                </div>
                <span className="text-xs text-muted-foreground">5 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">Discrepancy resolved</p>
                  <p className="text-sm text-muted-foreground">Manual adjustment applied</p>
                </div>
                <span className="text-xs text-muted-foreground">1 day ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Currency Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Currency Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">AED</p>
              <p className="text-xl font-semibold">2,450,000</p>
              <p className="text-xs text-green-600">+12% this month</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">USD</p>
              <p className="text-xl font-semibold">890,000</p>
              <p className="text-xs text-green-600">+8% this month</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">OMR</p>
              <p className="text-xl font-semibold">125,000</p>
              <p className="text-xs text-yellow-600">+2% this month</p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">QAR</p>
              <p className="text-xl font-semibold">320,000</p>
              <p className="text-xs text-green-600">+15% this month</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
