import { type User, type SafeUser, type CreateUser, type ReconciliationResult, type ReconciliationRun, type Employee } from "@shared/schema";
import { EMPLOYEES_DATA, normalizeEmployeeDepartment } from "@shared/employees-data";
import { randomUUID } from "crypto";

interface ReconciliationRunData {
  bankStatementFilename: string | null;
  databaseFilename: string | null;
  valueDateFilter: string | null;
  totalMatched: number;
  totalBankOnly: number;
  totalDatabaseOnly: number;
  totalRecords: number;
  totalBankCredit: number;
  totalMetaBaseAmount: number;
  totalDeductedAmount: number;
  totalTransactionAmount: number;
  checkoutAed: number;
  checkoutUsd: number;
  tapUsd: number;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: CreateUser): Promise<SafeUser>;
  getAllUsers(): Promise<SafeUser[]>;
  updateUser(id: string, updates: Partial<CreateUser>): Promise<SafeUser | undefined>;
  deleteUser(id: string): Promise<boolean>;
  // Employee methods
  getAllEmployees(): Promise<Employee[]>;
  searchEmployees(query: string): Promise<Employee[]>;
  getEmployeeById(employeeId: string): Promise<Employee | undefined>;
  getEmployeeByUserId(userId: string): Promise<Employee | undefined>;
  getDirectReports(employeeId: string): Promise<Employee[]>;
  linkEmployeeToUser(employeeId: string, userEmail: string): Promise<void>;
  // Reconciliation methods
  saveReconciliationRun(run: ReconciliationRunData, results: ReconciliationResult[]): Promise<number>;
  getAllReconciliationRuns(): Promise<ReconciliationRun[]>;
  getReconciliationRunById(id: number): Promise<ReconciliationRun | undefined>;
  getReconciliationResultsByRunId(id: number): Promise<ReconciliationResult[]>;
}

// Helper to remove password from user object
function toSafeUser(user: User): SafeUser {
  const { password, ...safeUser } = user;
  return safeUser;
}

interface StoredReconciliationRun extends ReconciliationRun {
  results: ReconciliationResult[];
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private employees: Map<string, Employee>;
  private employeeEmailLinks: Map<string, string>; // employeeId -> email
  private reconciliationRuns: Map<number, StoredReconciliationRun>;
  private nextReconciliationId: number;

  constructor() {
    this.users = new Map();
    this.employees = new Map();
    this.employeeEmailLinks = new Map();
    this.reconciliationRuns = new Map();
    this.nextReconciliationId = 1;
    this.initializeEmployees();
    this.initializeMockUsers();
  }

  private linkUserToEmployee(employeeId: string, userId: string) {
    const employee = this.employees.get(employeeId);
    if (employee) {
      employee.userId = userId;
      employee.isLinkedToUser = true;
      this.employees.set(employeeId, employee);
    }
  }

  private initializeEmployees() {
    for (const emp of EMPLOYEES_DATA) {
      const nameParts = emp.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      
      const employee: Employee = {
        employeeId: emp.employeeId,
        userId: emp.userId,
        name: emp.name,
        firstName,
        lastName,
        department: normalizeEmployeeDepartment(emp.department),
        position: emp.position || null,
        managerId: emp.managerId,
        managerName: emp.manager,
        email: null,
        isLinkedToUser: false,
      };
      this.employees.set(emp.employeeId, employee);
    }
  }

  private initializeMockUsers() {
    // Super Admin - can see everything (linked to CEO Feras Jalbout for demo)
    const superAdmin: User = {
      id: "1",
      email: "superadmin@baraka.com",
      password: "admin123",
      firstName: "Feras",
      lastName: "Jalbout",
      role: "super_admin",
      department: null,
      departments: null,
      designation: "CEO",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(superAdmin.id, superAdmin);
    this.linkUserToEmployee("EMP0015", "1"); // Link Feras Jalbout

    // Engineering Admin - linked to Anil Dabas (Director of Engineering with multiple reports)
    const engineeringAdmin: User = {
      id: "2",
      email: "eng.admin@baraka.com",
      password: "eng123",
      firstName: "Anil",
      lastName: "Dabas",
      role: "admin",
      department: "engineering",
      departments: JSON.stringify(["engineering", "performance"]),
      designation: "Director of Engineering",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(engineeringAdmin.id, engineeringAdmin);
    this.linkUserToEmployee("EMP0005", "2"); // Link Anil Dabas

    // HR Admin - not linked to employee (HR department not in employee data)
    const hrAdmin: User = {
      id: "3",
      email: "hr.admin@baraka.com",
      password: "hr123",
      firstName: "Sarah",
      lastName: "Resources",
      role: "admin",
      department: "human_resources",
      departments: JSON.stringify(["human_resources"]),
      designation: "HR Manager",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(hrAdmin.id, hrAdmin);

    // Marketing Admin - linked to Rafay Qureshi (Growth leader with reports)
    const marketingAdmin: User = {
      id: "4",
      email: "marketing.admin@baraka.com",
      password: "mkt123",
      firstName: "Rafay",
      lastName: "Qureshi",
      role: "admin",
      department: "growth",
      departments: JSON.stringify(["growth", "marketing"]),
      designation: "Growth Lead",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(marketingAdmin.id, marketingAdmin);
    this.linkUserToEmployee("EMP0029", "4"); // Link Rafay Qureshi

    // Compliance Admin - linked to Muna Salah (Compliance)
    const complianceAdmin: User = {
      id: "5",
      email: "compliance.admin@baraka.com",
      password: "comp123",
      firstName: "Muna",
      lastName: "Salah",
      role: "admin",
      department: "compliance",
      departments: JSON.stringify(["compliance"]),
      designation: "Compliance Officer",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(complianceAdmin.id, complianceAdmin);
    this.linkUserToEmployee("EMP0021", "5"); // Link Muna Salah

    // Engineering Member - linked to David Farg (Engineering Manager with direct reports)
    const engMember: User = {
      id: "6",
      email: "dev@baraka.com",
      password: "dev123",
      firstName: "David",
      lastName: "Farg",
      role: "member",
      department: "engineering",
      departments: JSON.stringify(["engineering", "performance"]),
      designation: "Engineering Manager",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(engMember.id, engMember);
    this.linkUserToEmployee("EMP0012", "6"); // Link David Farg
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    );
  }

  async createUser(userData: CreateUser): Promise<SafeUser> {
    const id = randomUUID();
    const now = new Date();
    const user: User = {
      id,
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      department: userData.departments?.[0] || userData.department || null,
      departments: userData.departments ? JSON.stringify(userData.departments) : null,
      designation: userData.designation || null,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return toSafeUser(user);
  }

  async getAllUsers(): Promise<SafeUser[]> {
    return Array.from(this.users.values()).map(toSafeUser);
  }

  async updateUser(id: string, updates: Partial<CreateUser>): Promise<SafeUser | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const hasDepartmentsUpdate = 'departments' in updates;
    const newDepartments = hasDepartmentsUpdate ? updates.departments || [] : null;
    
    const updatedUser: User = {
      ...user,
      email: updates.email ?? user.email,
      firstName: updates.firstName ?? user.firstName,
      lastName: updates.lastName ?? user.lastName,
      role: updates.role ?? user.role,
      designation: updates.designation ?? user.designation,
      department: hasDepartmentsUpdate 
        ? (newDepartments && newDepartments.length > 0 ? newDepartments[0] : null)
        : (updates.department ?? user.department),
      departments: hasDepartmentsUpdate
        ? (newDepartments && newDepartments.length > 0 ? JSON.stringify(newDepartments) : null)
        : user.departments,
      updatedAt: new Date(),
    };
    
    if (updates.password) {
      updatedUser.password = updates.password;
    }
    
    this.users.set(id, updatedUser);
    return toSafeUser(updatedUser);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Employee methods
  async getAllEmployees(): Promise<Employee[]> {
    return Array.from(this.employees.values());
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.employees.values()).filter((emp) =>
      emp.name.toLowerCase().includes(lowerQuery)
    );
  }

  async getEmployeeById(employeeId: string): Promise<Employee | undefined> {
    return this.employees.get(employeeId);
  }

  async getEmployeeByUserId(userId: string): Promise<Employee | undefined> {
    return Array.from(this.employees.values()).find(
      (emp) => emp.userId === userId
    );
  }

  async getDirectReports(employeeId: string): Promise<Employee[]> {
    return Array.from(this.employees.values()).filter(
      (emp) => emp.managerId === employeeId
    );
  }

  async linkEmployeeToUser(employeeId: string, userEmail: string): Promise<void> {
    const employee = this.employees.get(employeeId);
    if (employee) {
      employee.email = userEmail;
      employee.isLinkedToUser = true;
      this.employees.set(employeeId, employee);
      this.employeeEmailLinks.set(employeeId, userEmail);
    }
  }

  // Reconciliation methods
  async saveReconciliationRun(runData: ReconciliationRunData, results: ReconciliationResult[]): Promise<number> {
    const id = this.nextReconciliationId++;
    const run: StoredReconciliationRun = {
      id,
      createdAt: new Date().toISOString(),
      ...runData,
      results,
    };
    this.reconciliationRuns.set(id, run);
    return id;
  }

  async getAllReconciliationRuns(): Promise<ReconciliationRun[]> {
    const runs = Array.from(this.reconciliationRuns.values())
      .map(({ results, ...run }) => run)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return runs;
  }

  async getReconciliationRunById(id: number): Promise<ReconciliationRun | undefined> {
    const storedRun = this.reconciliationRuns.get(id);
    if (!storedRun) return undefined;
    const { results, ...run } = storedRun;
    return run;
  }

  async getReconciliationResultsByRunId(id: number): Promise<ReconciliationResult[]> {
    const storedRun = this.reconciliationRuns.get(id);
    if (!storedRun) return [];
    return storedRun.results;
  }
}

export const storage = new MemStorage();
