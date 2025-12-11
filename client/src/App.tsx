import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, ThemeProvider, ThemeToggle, GlobalInvitationDialogs } from "@/components/shared";
import { InvitationProvider } from "@/contexts/invitation-context";
import { AuthProvider, useAuth } from "@/contexts/auth-context";

import LoginPage from "@/pages/login";

import { PerformanceDashboard, SelfReview, ManagerDashboard, ManagerReview, AdminCycleSetup } from "@/pages/performance";
import { HRDashboard, HRDocuments } from "@/pages/hr";

import MarketingDashboard from "@/pages/marketing/dashboard";
import MarketingInfluencers from "@/pages/marketing/influencers";
import MarketingCampaigns from "@/pages/marketing/campaigns";
import MarketingTasks from "@/pages/marketing/tasks";
import MarketingPayouts from "@/pages/marketing/payouts";
import MarketingMessages from "@/pages/marketing/messages";

import FinanceDashboard from "@/pages/finance/dashboard";
import FinanceReconciliation from "@/pages/finance/reconciliation";

import { CustomerServiceDashboard } from "@/pages/customer-service";
import {
  ComplianceDashboard,
  AMLDashboard,
  AMLAlerts,
  AMLCustomers,
  AMLRules,
  AMLReports,
  AMLAnalytics,
  AMLAudit,
} from "@/pages/compliance";
import { EngineeringDashboard } from "@/pages/engineering";
import { AnalyticsDashboard } from "@/pages/analytics";
import SettingsPage from "@/pages/settings";
import UserManagement from "@/pages/user-management";

import NotFound from "@/pages/not-found";
import { Loader2 } from "lucide-react";

function ProtectedRoute({ component: Component, module }: { component: React.ComponentType; module?: string }) {
  const { isAuthenticated, isLoading, canAccessModule } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  if (module && !canAccessModule(module)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
          <p className="text-muted-foreground mt-2">You don't have permission to access this module.</p>
        </div>
      </div>
    );
  }

  return <Component />;
}

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/" /> : <LoginPage />}
      </Route>

      <Route path="/">
        <ProtectedRoute component={PerformanceDashboard} module="performance" />
      </Route>

      <Route path="/performance">
        <ProtectedRoute component={PerformanceDashboard} module="performance" />
      </Route>
      <Route path="/performance/manager">
        <ProtectedRoute component={ManagerDashboard} module="performance" />
      </Route>
      <Route path="/performance/review/:id">
        <ProtectedRoute component={SelfReview} module="performance" />
      </Route>
      <Route path="/performance/manager/review/:id">
        <ProtectedRoute component={ManagerReview} module="performance" />
      </Route>
      <Route path="/performance/admin/cycle/new">
        <ProtectedRoute component={AdminCycleSetup} module="performance" />
      </Route>

      <Route path="/hr">
        <ProtectedRoute component={HRDashboard} module="human_resources" />
      </Route>
      <Route path="/hr/documents">
        <ProtectedRoute component={HRDocuments} module="human_resources" />
      </Route>

      <Route path="/marketing">
        <ProtectedRoute component={MarketingDashboard} module="marketing" />
      </Route>
      <Route path="/marketing/influencers">
        <ProtectedRoute component={MarketingInfluencers} module="marketing" />
      </Route>
      <Route path="/marketing/campaigns">
        <ProtectedRoute component={MarketingCampaigns} module="marketing" />
      </Route>
      <Route path="/marketing/tasks">
        <ProtectedRoute component={MarketingTasks} module="marketing" />
      </Route>
      <Route path="/marketing/payouts">
        <ProtectedRoute component={MarketingPayouts} module="marketing" />
      </Route>
      <Route path="/marketing/messages">
        <ProtectedRoute component={MarketingMessages} module="marketing" />
      </Route>

      <Route path="/customer-service">
        <ProtectedRoute component={CustomerServiceDashboard} module="customer_service" />
      </Route>

      <Route path="/compliance">
        <ProtectedRoute component={ComplianceDashboard} module="compliance" />
      </Route>
      <Route path="/compliance/aml">
        <ProtectedRoute component={AMLDashboard} module="compliance" />
      </Route>
      <Route path="/compliance/aml/alerts">
        <ProtectedRoute component={AMLAlerts} module="compliance" />
      </Route>
      <Route path="/compliance/aml/customers">
        <ProtectedRoute component={AMLCustomers} module="compliance" />
      </Route>
      <Route path="/compliance/aml/rules">
        <ProtectedRoute component={AMLRules} module="compliance" />
      </Route>
      <Route path="/compliance/aml/reports">
        <ProtectedRoute component={AMLReports} module="compliance" />
      </Route>
      <Route path="/compliance/aml/analytics">
        <ProtectedRoute component={AMLAnalytics} module="compliance" />
      </Route>
      <Route path="/compliance/aml/audit">
        <ProtectedRoute component={AMLAudit} module="compliance" />
      </Route>

      <Route path="/engineering">
        <ProtectedRoute component={EngineeringDashboard} module="engineering" />
      </Route>

      <Route path="/analytics">
        <ProtectedRoute component={AnalyticsDashboard} module="analytics" />
      </Route>

      <Route path="/finance">
        <ProtectedRoute component={FinanceDashboard} module="finance" />
      </Route>
      <Route path="/finance/reconciliation">
        <ProtectedRoute component={FinanceReconciliation} module="finance" />
      </Route>

      <Route path="/user-management">
        <ProtectedRoute component={UserManagement} module="user_management" />
      </Route>

      <Route path="/settings">
        <ProtectedRoute component={SettingsPage} module="settings" />
      </Route>

      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  if (!isAuthenticated && location === "/login") {
    return <LoginPage />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }

  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <InvitationProvider>
      <SidebarProvider style={style as React.CSSProperties}>
        <div className="flex h-screen w-full">
          <AppSidebar />
          <div className="flex flex-col flex-1">
            <header className="flex items-center justify-between p-4 border-b">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <ThemeToggle />
            </header>
            <main className="flex-1 overflow-auto">
              <div className="container mx-auto p-6">
                <Router />
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
      <GlobalInvitationDialogs />
    </InvitationProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider>
            <AuthenticatedLayout />
            <Toaster />
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
