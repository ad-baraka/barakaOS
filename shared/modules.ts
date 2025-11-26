export interface ModuleSubItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

export interface ModuleConfig {
  id: string;
  label: string;
  icon: string;
  basePath: string;
  subItems: ModuleSubItem[];
}

export const MODULES_CONFIG: ModuleConfig[] = [
  {
    id: "human_resources",
    label: "Human Resources",
    icon: "Users",
    basePath: "/hr",
    subItems: [
      { id: "hr-dashboard", label: "Dashboard", path: "/hr", icon: "Home" },
      { id: "hr-documents", label: "Onboarding Documents", path: "/hr/documents", icon: "FileText" },
    ],
  },
  {
    id: "performance",
    label: "Performance",
    icon: "BarChart3",
    basePath: "/performance",
    subItems: [
      { id: "performance-dashboard", label: "Dashboard", path: "/performance", icon: "LayoutDashboard" },
      { id: "my-reviews", label: "My Reviews", path: "/performance/review/1", icon: "ClipboardList" },
      { id: "team-reviews", label: "Team Reviews", path: "/performance/manager", icon: "Users" },
      { id: "manager-review", label: "Manager Review", path: "/performance/manager/review/1", icon: "UserCheck" },
      { id: "create-cycle", label: "Create Cycle", path: "/performance/admin/cycle", icon: "Plus" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing",
    icon: "Megaphone",
    basePath: "/marketing",
    subItems: [
      { id: "marketing-dashboard", label: "Dashboard", path: "/marketing", icon: "LayoutDashboard" },
      { id: "marketing-influencers", label: "Influencers", path: "/marketing/influencers", icon: "Users" },
      { id: "marketing-campaigns", label: "Campaigns", path: "/marketing/campaigns", icon: "Megaphone" },
      { id: "marketing-tasks", label: "Tasks", path: "/marketing/tasks", icon: "CheckSquare" },
      { id: "marketing-payouts", label: "Payouts", path: "/marketing/payouts", icon: "DollarSign" },
      { id: "marketing-messages", label: "Messages", path: "/marketing/messages", icon: "MessageSquare" },
    ],
  },
  {
    id: "customer_service",
    label: "Customer Service",
    icon: "HeadphonesIcon",
    basePath: "/customer-service",
    subItems: [
      { id: "customer-service-dashboard", label: "Dashboard", path: "/customer-service", icon: "LayoutDashboard" },
    ],
  },
  {
    id: "compliance",
    label: "Compliance",
    icon: "ShieldCheck",
    basePath: "/compliance",
    subItems: [
      { id: "compliance-dashboard", label: "Dashboard", path: "/compliance", icon: "LayoutDashboard" },
    ],
  },
  {
    id: "engineering",
    label: "Engineering",
    icon: "Code2",
    basePath: "/engineering",
    subItems: [
      { id: "engineering-dashboard", label: "Dashboard", path: "/engineering", icon: "LayoutDashboard" },
    ],
  },
  {
    id: "analytics",
    label: "Baraka Analytics",
    icon: "LineChart",
    basePath: "/analytics",
    subItems: [
      { id: "analytics-dashboard", label: "Dashboard", path: "/analytics", icon: "LayoutDashboard" },
    ],
  },
  {
    id: "finance",
    label: "Finance",
    icon: "Wallet",
    basePath: "/finance",
    subItems: [
      { id: "finance-dashboard", label: "Dashboard", path: "/finance", icon: "LayoutDashboard" },
      { id: "finance-reconciliation", label: "Deposit Reconciliation", path: "/finance/reconciliation", icon: "FileSpreadsheet" },
    ],
  },
  {
    id: "design",
    label: "Design",
    icon: "Palette",
    basePath: "/design",
    subItems: [
      { id: "design-dashboard", label: "Dashboard", path: "/design", icon: "LayoutDashboard" },
    ],
  },
  {
    id: "product",
    label: "Product",
    icon: "Package",
    basePath: "/product",
    subItems: [
      { id: "product-dashboard", label: "Dashboard", path: "/product", icon: "LayoutDashboard" },
    ],
  },
  {
    id: "growth",
    label: "Growth",
    icon: "TrendingUp",
    basePath: "/growth",
    subItems: [
      { id: "growth-dashboard", label: "Dashboard", path: "/growth", icon: "LayoutDashboard" },
    ],
  },
  {
    id: "executive",
    label: "Executive",
    icon: "Crown",
    basePath: "/executive",
    subItems: [
      { id: "executive-dashboard", label: "Dashboard", path: "/executive", icon: "LayoutDashboard" },
    ],
  },
];

export const DEPARTMENT_IDS = MODULES_CONFIG.map((m) => m.id) as readonly string[];

export type DepartmentId = typeof DEPARTMENT_IDS[number];

export const DEPARTMENT_LABELS: Record<string, string> = Object.fromEntries(
  MODULES_CONFIG.map((m) => [m.id, m.label])
);

export function getModuleById(id: string): ModuleConfig | undefined {
  return MODULES_CONFIG.find((m) => m.id === id);
}

export function getModuleByPath(path: string): ModuleConfig | undefined {
  return MODULES_CONFIG.find((m) => path.startsWith(m.basePath));
}
