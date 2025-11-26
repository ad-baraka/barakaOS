import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  Briefcase,
  Home,
  UserPlus,
  FileText,
  ChevronRight,
  Megaphone,
  HeadphonesIcon,
  ShieldCheck,
  Code2,
  LineChart,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useInvitation } from "@/contexts/invitation-context";
import { TEMPLATES } from "@shared/templates";

const templateList = Object.values(TEMPLATES);

interface AppSidebarProps {
  userRole?: "employee" | "manager" | "admin";
}

export function AppSidebar({ userRole = "employee" }: AppSidebarProps) {
  const [location] = useLocation();
  const [isHROpen, setIsHROpen] = useState(location.startsWith("/hr"));
  const [isPerformanceOpen, setIsPerformanceOpen] = useState(location.startsWith("/performance") || location === "/");
  const [isMarketingOpen, setIsMarketingOpen] = useState(location.startsWith("/marketing"));
  const [isCustomerServiceOpen, setIsCustomerServiceOpen] = useState(location.startsWith("/customer-service"));
  const [isComplianceOpen, setIsComplianceOpen] = useState(location.startsWith("/compliance"));
  const [isEngineeringOpen, setIsEngineeringOpen] = useState(location.startsWith("/engineering"));
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(location.startsWith("/analytics"));
  const [isSendInvitationOpen, setIsSendInvitationOpen] = useState(false);
  const { openInvitationWith } = useInvitation();

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-lg font-semibold">BO</span>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Baraka OS</h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Human Resources Module */}
              <Collapsible open={isHROpen} onOpenChange={setIsHROpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton data-testid="button-human-resources">
                      <Users className="h-4 w-4" />
                      <span>Human Resources</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem key="hr-dashboard">
                        <SidebarMenuSubButton asChild isActive={location === "/hr"}>
                          <Link href="/hr" data-testid="link-hr-dashboard">
                            <Home className="h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>

                      <Collapsible open={isSendInvitationOpen} onOpenChange={setIsSendInvitationOpen} className="group/send-invitation">
                        <SidebarMenuSubItem>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuSubButton data-testid="button-add-new-joiner">
                              <UserPlus className="h-4 w-4" />
                              <span>Add New Joiner</span>
                              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/send-invitation:rotate-90" />
                            </SidebarMenuSubButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {templateList.map((template) => (
                                <SidebarMenuSubItem key={template.id}>
                                  <SidebarMenuSubButton
                                    onClick={() => openInvitationWith(template.id)}
                                    data-testid={`button-template-${template.id}`}
                                  >
                                    <span>{template.displayName}</span>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </SidebarMenuSubItem>
                      </Collapsible>

                      <SidebarMenuSubItem key="hr-documents">
                        <SidebarMenuSubButton asChild isActive={location === "/hr/documents"}>
                          <Link href="/hr/documents" data-testid="link-hr-documents">
                            <FileText className="h-4 w-4" />
                            <span>Onboarding Documents</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Performance Module */}
              <Collapsible open={isPerformanceOpen} onOpenChange={setIsPerformanceOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton data-testid="button-performance">
                      <BarChart3 className="h-4 w-4" />
                      <span>Performance</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem key="performance-dashboard">
                        <SidebarMenuSubButton asChild isActive={location === "/" || location === "/performance"}>
                          <Link href="/performance" data-testid="link-performance-dashboard">
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem key="my-reviews">
                        <SidebarMenuSubButton asChild isActive={location.startsWith("/performance/review/")}>
                          <Link href="/performance/review/1" data-testid="link-my-reviews">
                            <ClipboardList className="h-4 w-4" />
                            <span>My Reviews</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem key="team-reviews">
                        <SidebarMenuSubButton asChild isActive={location === "/performance/manager"}>
                          <Link href="/performance/manager" data-testid="link-team-reviews">
                            <Users className="h-4 w-4" />
                            <span>Team Reviews</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem key="manager-review">
                        <SidebarMenuSubButton asChild isActive={location.startsWith("/performance/manager/review/")}>
                          <Link href="/performance/manager/review/1" data-testid="link-manager-review">
                            <BarChart3 className="h-4 w-4" />
                            <span>Manager Review</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem key="create-cycle">
                        <SidebarMenuSubButton asChild isActive={location === "/performance/admin/cycle/new"}>
                          <Link href="/performance/admin/cycle/new" data-testid="link-create-cycle">
                            <Settings className="h-4 w-4" />
                            <span>Create Cycle</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Marketing Module */}
              <Collapsible open={isMarketingOpen} onOpenChange={setIsMarketingOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton data-testid="button-marketing">
                      <Megaphone className="h-4 w-4" />
                      <span>Marketing</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem key="marketing-dashboard">
                        <SidebarMenuSubButton asChild isActive={location === "/marketing"}>
                          <Link href="/marketing" data-testid="link-marketing-dashboard">
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Customer Service Module */}
              <Collapsible open={isCustomerServiceOpen} onOpenChange={setIsCustomerServiceOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton data-testid="button-customer-service">
                      <HeadphonesIcon className="h-4 w-4" />
                      <span>Customer Service</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem key="customer-service-dashboard">
                        <SidebarMenuSubButton asChild isActive={location === "/customer-service"}>
                          <Link href="/customer-service" data-testid="link-customer-service-dashboard">
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Compliance Module */}
              <Collapsible open={isComplianceOpen} onOpenChange={setIsComplianceOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton data-testid="button-compliance">
                      <ShieldCheck className="h-4 w-4" />
                      <span>Compliance</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem key="compliance-dashboard">
                        <SidebarMenuSubButton asChild isActive={location === "/compliance"}>
                          <Link href="/compliance" data-testid="link-compliance-dashboard">
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Engineering Module */}
              <Collapsible open={isEngineeringOpen} onOpenChange={setIsEngineeringOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton data-testid="button-engineering">
                      <Code2 className="h-4 w-4" />
                      <span>Engineering</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem key="engineering-dashboard">
                        <SidebarMenuSubButton asChild isActive={location === "/engineering"}>
                          <Link href="/engineering" data-testid="link-engineering-dashboard">
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Baraka Analytics Module */}
              <Collapsible open={isAnalyticsOpen} onOpenChange={setIsAnalyticsOpen} className="group/collapsible">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton data-testid="button-analytics">
                      <LineChart className="h-4 w-4" />
                      <span>Baraka Analytics</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem key="analytics-dashboard">
                        <SidebarMenuSubButton asChild isActive={location === "/analytics"}>
                          <Link href="/analytics" data-testid="link-analytics-dashboard">
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={location === "/settings"}>
              <Link href="/settings" data-testid="link-settings">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-3 rounded-md p-2 hover-elevate mt-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src="" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
