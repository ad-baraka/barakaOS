import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { InvitationProvider } from "@/contexts/invitation-context";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { GlobalInvitationDialogs } from "@/components/global-invitation-dialogs";

// Auth Pages
import LoginPage from "@/pages/login";

// Performance Module Pages
import Dashboard from "@/pages/dashboard";
import ManagerDashboard from "@/pages/manager-dashboard";
import SelfReview from "@/pages/self-review";
import ManagerReview from "@/pages/manager-review";
import AdminCycleSetup from "@/pages/admin-cycle-setup";

// HR Module Pages
import HRDashboard from "@/pages/hr-dashboard";
import HRDocuments from "@/pages/hr-documents";

// Marketing Module Pages
import MarketingDashboard from "@/pages/marketing/dashboard";
import MarketingInfluencers from "@/pages/marketing/influencers";
import MarketingCampaigns from "@/pages/marketing/campaigns";
import MarketingTasks from "@/pages/marketing/tasks";
import MarketingPayouts from "@/pages/marketing/payouts";
import MarketingMessages from "@/pages/marketing/messages";

// Finance Module Pages
import FinanceDashboard from "@/pages/finance/dashboard";
import FinanceReconciliation from "@/pages/finance/reconciliation";

// Other Module Pages
import CustomerServiceDashboard from "@/pages/customer-service-dashboard";
import ComplianceDashboard from "@/pages/compliance-dashboard";
import EngineeringDashboard from "@/pages/engineering-dashboard";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
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
      {/* Login Route */}
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/" /> : <LoginPage />}
      </Route>

      {/* Default route - redirect to Performance Dashboard or Login */}
      <Route path="/">
        <ProtectedRoute component={Dashboard} module="performance" />
      </Route>

      {/* Performance Module Routes */}
      <Route path="/performance">
        <ProtectedRoute component={Dashboard} module="performance" />
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

      {/* HR Module Routes */}
      <Route path="/hr">
        <ProtectedRoute component={HRDashboard} module="human_resources" />
      </Route>
      <Route path="/hr/documents">
        <ProtectedRoute component={HRDocuments} module="human_resources" />
      </Route>

      {/* Marketing Module Routes */}
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

      {/* Customer Service Module Routes */}
      <Route path="/customer-service">
        <ProtectedRoute component={CustomerServiceDashboard} module="customer_service" />
      </Route>

      {/* Compliance Module Routes */}
      <Route path="/compliance">
        <ProtectedRoute component={ComplianceDashboard} module="compliance" />
      </Route>

      {/* Engineering Module Routes */}
      <Route path="/engineering">
        <ProtectedRoute component={EngineeringDashboard} module="engineering" />
      </Route>

      {/* Baraka Analytics Module Routes */}
      <Route path="/analytics">
        <ProtectedRoute component={AnalyticsDashboard} module="analytics" />
      </Route>

      {/* Finance Module Routes */}
      <Route path="/finance">
        <ProtectedRoute component={FinanceDashboard} module="finance" />
      </Route>
      <Route path="/finance/reconciliation">
        <ProtectedRoute component={FinanceReconciliation} module="finance" />
      </Route>

      {/* User Management - Super Admin only */}
      <Route path="/user-management">
        <ProtectedRoute component={UserManagement} module="user_management" />
      </Route>

      {/* Settings */}
      <Route path="/settings">
        <ProtectedRoute component={SettingsPage} module="settings" />
      </Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  // Show login page without sidebar
  if (!isAuthenticated && location === "/login") {
    return <LoginPage />;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Redirect to login if not authenticated
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
