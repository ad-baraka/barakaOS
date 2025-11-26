import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { SafeUser, Department } from "@shared/schema";
import { MODULES_CONFIG } from "@shared/modules";

interface AuthContextType {
  user: SafeUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  canAccessModule: (module: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function buildModuleToDepartmentMap(): Record<string, string | null> {
  const map: Record<string, string | null> = {
    "user_management": null,
    "user-management": null,
    "settings": null,
  };
  
  for (const mod of MODULES_CONFIG) {
    map[mod.id] = mod.id;
    const altKey = mod.id.replace("_", "-");
    if (altKey !== mod.id) {
      map[altKey] = mod.id;
    }
    const pathKey = mod.basePath.replace("/", "");
    if (pathKey && pathKey !== mod.id) {
      map[pathKey] = mod.id;
    }
  }
  
  return map;
}

const MODULE_TO_DEPARTMENT = buildModuleToDepartmentMap();

function getUserDepartments(user: SafeUser): string[] {
  if (user.departments) {
    if (Array.isArray(user.departments)) {
      return user.departments as string[];
    }
    if (typeof user.departments === 'string') {
      try {
        const parsed = JSON.parse(user.departments);
        if (Array.isArray(parsed)) {
          return parsed as string[];
        }
      } catch {
        // Fall through
      }
    }
  }
  return user.department ? [user.department] : [];
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("barakaos_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem("barakaos_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.message || "Login failed" };
      }

      setUser(data.user);
      localStorage.setItem("barakaos_user", JSON.stringify(data.user));
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Network error. Please try again." };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("barakaos_user");
  };

  const canAccessModule = (module: string): boolean => {
    if (!user) return false;

    // Super admin can access everything
    if (user.role === "super_admin") return true;

    // Settings is accessible to everyone
    if (module === "settings") return true;

    // User management is only for super_admin
    if (module === "user_management" || module === "user-management") return false;

    // Get the department for this module
    const normalizedModule = module.toLowerCase().replace("-", "_");
    const moduleDepartment = MODULE_TO_DEPARTMENT[normalizedModule];

    // If module doesn't map to a department, deny access
    if (moduleDepartment === undefined) return false;
    
    // Null means only super_admin (already handled above)
    if (moduleDepartment === null) return false;

    // Check if user has access to this department (supports multi-department)
    const userDepartments = getUserDepartments(user);
    return userDepartments.includes(moduleDepartment);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        canAccessModule,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
