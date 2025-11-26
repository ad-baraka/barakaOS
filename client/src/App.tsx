import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { InvitationProvider } from "@/contexts/invitation-context";
import { GlobalInvitationDialogs } from "@/components/global-invitation-dialogs";

// Performance Module Pages
import Dashboard from "@/pages/dashboard";
import ManagerDashboard from "@/pages/manager-dashboard";
import SelfReview from "@/pages/self-review";
import ManagerReview from "@/pages/manager-review";
import AdminCycleSetup from "@/pages/admin-cycle-setup";

// HR Module Pages
import HRDashboard from "@/pages/hr-dashboard";
import HRDocuments from "@/pages/hr-documents";

// Other Module Pages
import MarketingDashboard from "@/pages/marketing-dashboard";
import CustomerServiceDashboard from "@/pages/customer-service-dashboard";
import ComplianceDashboard from "@/pages/compliance-dashboard";
import EngineeringDashboard from "@/pages/engineering-dashboard";
import AnalyticsDashboard from "@/pages/analytics-dashboard";
import SettingsPage from "@/pages/settings";

import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Default route - redirect to Performance Dashboard */}
      <Route path="/" component={Dashboard} />

      {/* Performance Module Routes */}
      <Route path="/performance" component={Dashboard} />
      <Route path="/performance/manager" component={ManagerDashboard} />
      <Route path="/performance/review/:id" component={SelfReview} />
      <Route path="/performance/manager/review/:id" component={ManagerReview} />
      <Route path="/performance/admin/cycle/new" component={AdminCycleSetup} />

      {/* HR Module Routes */}
      <Route path="/hr" component={HRDashboard} />
      <Route path="/hr/documents" component={HRDocuments} />

      {/* Marketing Module Routes */}
      <Route path="/marketing" component={MarketingDashboard} />

      {/* Customer Service Module Routes */}
      <Route path="/customer-service" component={CustomerServiceDashboard} />

      {/* Compliance Module Routes */}
      <Route path="/compliance" component={ComplianceDashboard} />

      {/* Engineering Module Routes */}
      <Route path="/engineering" component={EngineeringDashboard} />

      {/* Baraka Analytics Module Routes */}
      <Route path="/analytics" component={AnalyticsDashboard} />

      {/* Settings */}
      <Route path="/settings" component={SettingsPage} />

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <InvitationProvider>
            <SidebarProvider style={style as React.CSSProperties}>
              <div className="flex h-screen w-full">
                <AppSidebar userRole="manager" />
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
            <Toaster />
          </InvitationProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
