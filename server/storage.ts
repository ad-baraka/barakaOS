import { type User, type SafeUser, type CreateUser, type ReconciliationResult, type ReconciliationRun, type Employee } from "@shared/schema";
import { EMPLOYEES_DATA, normalizeEmployeeDepartment, DEFAULT_PASSWORD } from "@shared/employees-data";
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
  getAllEmployees(): Promise<Employee[]>;
  searchEmployees(query: string): Promise<Employee[]>;
  getEmployeeById(employeeId: string): Promise<Employee | undefined>;
  getEmployeeByUserId(userId: string): Promise<Employee | undefined>;
  getDirectReports(employeeId: string): Promise<Employee[]>;
  linkEmployeeToUser(employeeId: string, userEmail: string): Promise<void>;
  saveReconciliationRun(run: ReconciliationRunData, results: ReconciliationResult[]): Promise<number>;
  getAllReconciliationRuns(): Promise<ReconciliationRun[]>;
  getReconciliationRunById(id: number): Promise<ReconciliationRun | undefined>;
  getReconciliationResultsByRunId(id: number): Promise<ReconciliationResult[]>;
}

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
  private employeeEmailLinks: Map<string, string>;
  private reconciliationRuns: Map<number, StoredReconciliationRun>;
  private nextReconciliationId: number;

  constructor() {
    this.users = new Map();
    this.employees = new Map();
    this.employeeEmailLinks = new Map();
    this.reconciliationRuns = new Map();
    this.nextReconciliationId = 1;
    this.initializeEmployees();
    this.initializeUsersFromEmployees();
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
        email: emp.email,
        isLinkedToUser: false,
      };
      this.employees.set(emp.employeeId, employee);
    }
  }

  private initializeUsersFromEmployees() {
    const now = new Date();
    
    for (const emp of EMPLOYEES_DATA) {
      const nameParts = emp.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ');
      const normalizedDept = normalizeEmployeeDepartment(emp.department);
      
      const isSuperAdmin = emp.employeeId === "EMP0015";
      
      const user: User = {
        id: emp.userId,
        email: emp.email,
        password: DEFAULT_PASSWORD,
        firstName,
        lastName,
        role: isSuperAdmin ? "super_admin" : "member",
        department: normalizedDept,
        departments: normalizedDept ? JSON.stringify([normalizedDept]) : null,
        designation: emp.position || null,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      };
      
      this.users.set(user.id, user);
      
      const employee = this.employees.get(emp.employeeId);
      if (employee) {
        employee.userId = emp.userId;
        employee.isLinkedToUser = true;
        this.employees.set(emp.employeeId, employee);
      }
    }
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
      password: userData.password || DEFAULT_PASSWORD,
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
