import { eq, like, sql, desc } from "drizzle-orm";
import { db } from "./db";
import { 
  users, 
  employees, 
  userDepartments, 
  reconciliationRuns,
  reconciliationResults,
  type User, 
  type SafeUser, 
  type CreateUser, 
  type ReconciliationResult, 
  type ReconciliationRun, 
  type Employee 
} from "@shared/schema";
import { DEFAULT_PASSWORD } from "@shared/employees-data";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";

const SALT_ROUNDS = 10;

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
  validatePassword(email: string, password: string): Promise<User | null>;
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

function toSafeUser(user: any): SafeUser {
  const { passwordHash, password, ...safeUser } = user;
  return safeUser;
}

function mapEmployeeRecord(emp: any, managerEmp?: any): Employee {
  return {
    employeeId: emp.employeeCode,
    id: emp.id,
    userId: emp.userId,
    name: emp.fullName,
    firstName: emp.firstName,
    lastName: emp.lastName,
    department: emp.departmentId,
    position: emp.position,
    managerId: managerEmp?.employeeCode || null,
    managerName: managerEmp?.fullName || null,
    email: emp.email,
    isLinkedToUser: !!emp.userId,
  };
}

export class PgStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    if (!user) return undefined;
    
    const depts = await db.select().from(userDepartments).where(eq(userDepartments.userId, id));
    const departmentIds = depts.map(d => d.departmentId);
    
    return {
      ...user,
      password: user.passwordHash,
      department: departmentIds[0] || null,
      departments: departmentIds.length > 0 ? JSON.stringify(departmentIds) : null,
    };
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(
      sql`LOWER(${users.email}) = LOWER(${email})`
    );
    if (!user) return undefined;
    
    const depts = await db.select().from(userDepartments).where(eq(userDepartments.userId, user.id));
    const departmentIds = depts.map(d => d.departmentId);
    
    return {
      ...user,
      password: user.passwordHash,
      department: departmentIds[0] || null,
      departments: departmentIds.length > 0 ? JSON.stringify(departmentIds) : null,
    };
  }

  async validatePassword(email: string, password: string): Promise<User | null> {
    const user = await this.getUserByEmail(email);
    if (!user) return null;
    
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) return null;
    
    return user;
  }

  async createUser(userData: CreateUser): Promise<SafeUser> {
    const id = randomUUID();
    const passwordHash = await bcrypt.hash(userData.password || DEFAULT_PASSWORD, SALT_ROUNDS);
    
    const [newUser] = await db.insert(users).values({
      id,
      email: userData.email,
      passwordHash,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      designation: userData.designation || null,
      isActive: true,
    }).returning();

    if (userData.departments && userData.departments.length > 0) {
      for (const deptId of userData.departments) {
        await db.insert(userDepartments).values({
          userId: id,
          departmentId: deptId,
        }).onConflictDoNothing();
      }
    }

    const depts = await db.select().from(userDepartments).where(eq(userDepartments.userId, id));
    const departmentIds = depts.map(d => d.departmentId);

    return {
      ...newUser,
      department: departmentIds[0] || null,
      departments: departmentIds.length > 0 ? JSON.stringify(departmentIds) : null,
    };
  }

  async getAllUsers(): Promise<SafeUser[]> {
    const allUsers = await db.select().from(users);
    const result: SafeUser[] = [];
    
    for (const user of allUsers) {
      const depts = await db.select().from(userDepartments).where(eq(userDepartments.userId, user.id));
      const departmentIds = depts.map(d => d.departmentId);
      result.push({
        ...toSafeUser(user),
        department: departmentIds[0] || null,
        departments: departmentIds.length > 0 ? JSON.stringify(departmentIds) : null,
      });
    }
    
    return result;
  }

  async updateUser(id: string, updates: Partial<CreateUser>): Promise<SafeUser | undefined> {
    const existingUser = await this.getUser(id);
    if (!existingUser) return undefined;

    const updateData: any = {};
    if (updates.email) updateData.email = updates.email;
    if (updates.firstName) updateData.firstName = updates.firstName;
    if (updates.lastName) updateData.lastName = updates.lastName;
    if (updates.role) updateData.role = updates.role;
    if (updates.designation !== undefined) updateData.designation = updates.designation;
    if (updates.password) {
      updateData.passwordHash = await bcrypt.hash(updates.password, SALT_ROUNDS);
    }
    updateData.updatedAt = new Date();

    await db.update(users).set(updateData).where(eq(users.id, id));

    if (updates.departments) {
      await db.delete(userDepartments).where(eq(userDepartments.userId, id));
      for (const deptId of updates.departments) {
        await db.insert(userDepartments).values({
          userId: id,
          departmentId: deptId,
        }).onConflictDoNothing();
      }
    }

    const updatedUser = await this.getUser(id);
    return updatedUser ? toSafeUser(updatedUser) : undefined;
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result.length > 0;
  }

  async getAllEmployees(): Promise<Employee[]> {
    const allEmployees = await db.select().from(employees);
    const result: Employee[] = [];
    
    for (const emp of allEmployees) {
      let managerEmp = null;
      if (emp.managerEmployeeId) {
        const [manager] = await db.select().from(employees).where(eq(employees.id, emp.managerEmployeeId));
        managerEmp = manager;
      }
      result.push(mapEmployeeRecord(emp, managerEmp));
    }
    
    return result;
  }

  async searchEmployees(query: string): Promise<Employee[]> {
    const searchPattern = `%${query.toLowerCase()}%`;
    const matchingEmployees = await db.select().from(employees).where(
      sql`LOWER(${employees.fullName}) LIKE ${searchPattern}`
    );
    
    const result: Employee[] = [];
    for (const emp of matchingEmployees) {
      let managerEmp = null;
      if (emp.managerEmployeeId) {
        const [manager] = await db.select().from(employees).where(eq(employees.id, emp.managerEmployeeId));
        managerEmp = manager;
      }
      result.push(mapEmployeeRecord(emp, managerEmp));
    }
    
    return result;
  }

  async getEmployeeById(employeeId: string): Promise<Employee | undefined> {
    const [emp] = await db.select().from(employees).where(eq(employees.employeeCode, employeeId));
    if (!emp) return undefined;
    
    let managerEmp = null;
    if (emp.managerEmployeeId) {
      const [manager] = await db.select().from(employees).where(eq(employees.id, emp.managerEmployeeId));
      managerEmp = manager;
    }
    
    return mapEmployeeRecord(emp, managerEmp);
  }

  async getEmployeeByUserId(userId: string): Promise<Employee | undefined> {
    const [emp] = await db.select().from(employees).where(eq(employees.userId, userId));
    if (!emp) return undefined;
    
    let managerEmp = null;
    if (emp.managerEmployeeId) {
      const [manager] = await db.select().from(employees).where(eq(employees.id, emp.managerEmployeeId));
      managerEmp = manager;
    }
    
    return mapEmployeeRecord(emp, managerEmp);
  }

  async getDirectReports(employeeId: string): Promise<Employee[]> {
    const [manager] = await db.select().from(employees).where(eq(employees.employeeCode, employeeId));
    if (!manager) return [];
    
    const reports = await db.select().from(employees).where(eq(employees.managerEmployeeId, manager.id));
    
    return reports.map(emp => mapEmployeeRecord(emp, manager));
  }

  async linkEmployeeToUser(employeeId: string, userEmail: string): Promise<void> {
    const [user] = await db.select().from(users).where(
      sql`LOWER(${users.email}) = LOWER(${userEmail})`
    );
    if (!user) return;
    
    await db.update(employees)
      .set({ userId: user.id, email: userEmail })
      .where(eq(employees.employeeCode, employeeId));
  }

  async saveReconciliationRun(runData: ReconciliationRunData, results: ReconciliationResult[]): Promise<number> {
    const [run] = await db.insert(reconciliationRuns).values({
      bankStatementFilename: runData.bankStatementFilename,
      databaseFilename: runData.databaseFilename,
      valueDateFilter: runData.valueDateFilter,
      totalMatched: runData.totalMatched,
      totalBankOnly: runData.totalBankOnly,
      totalDatabaseOnly: runData.totalDatabaseOnly,
      totalRecords: runData.totalRecords,
      totalBankCredit: String(runData.totalBankCredit),
      totalMetaBaseAmount: String(runData.totalMetaBaseAmount),
      totalDeductedAmount: String(runData.totalDeductedAmount),
      totalTransactionAmount: String(runData.totalTransactionAmount),
      checkoutAed: String(runData.checkoutAed),
      checkoutUsd: String(runData.checkoutUsd),
      tapUsd: String(runData.tapUsd),
    }).returning();

    for (const result of results) {
      await db.insert(reconciliationResults).values({
        runId: run.id,
        matchStatus: result.matchStatus,
        transactionReference: result.transactionReference,
        bankData: result.bankData,
        databaseData: result.databaseData,
      });
    }

    return run.id;
  }

  async getAllReconciliationRuns(): Promise<ReconciliationRun[]> {
    const runs = await db.select().from(reconciliationRuns).orderBy(desc(reconciliationRuns.createdAt));
    
    return runs.map(run => ({
      id: run.id,
      createdAt: run.createdAt.toISOString(),
      bankStatementFilename: run.bankStatementFilename,
      databaseFilename: run.databaseFilename,
      valueDateFilter: run.valueDateFilter,
      totalMatched: run.totalMatched,
      totalBankOnly: run.totalBankOnly,
      totalDatabaseOnly: run.totalDatabaseOnly,
      totalRecords: run.totalRecords,
      totalBankCredit: Number(run.totalBankCredit),
      totalMetaBaseAmount: Number(run.totalMetaBaseAmount),
      totalDeductedAmount: Number(run.totalDeductedAmount),
      totalTransactionAmount: Number(run.totalTransactionAmount),
      checkoutAed: Number(run.checkoutAed),
      checkoutUsd: Number(run.checkoutUsd),
      tapUsd: Number(run.tapUsd),
    }));
  }

  async getReconciliationRunById(id: number): Promise<ReconciliationRun | undefined> {
    const [run] = await db.select().from(reconciliationRuns).where(eq(reconciliationRuns.id, id));
    if (!run) return undefined;
    
    return {
      id: run.id,
      createdAt: run.createdAt.toISOString(),
      bankStatementFilename: run.bankStatementFilename,
      databaseFilename: run.databaseFilename,
      valueDateFilter: run.valueDateFilter,
      totalMatched: run.totalMatched,
      totalBankOnly: run.totalBankOnly,
      totalDatabaseOnly: run.totalDatabaseOnly,
      totalRecords: run.totalRecords,
      totalBankCredit: Number(run.totalBankCredit),
      totalMetaBaseAmount: Number(run.totalMetaBaseAmount),
      totalDeductedAmount: Number(run.totalDeductedAmount),
      totalTransactionAmount: Number(run.totalTransactionAmount),
      checkoutAed: Number(run.checkoutAed),
      checkoutUsd: Number(run.checkoutUsd),
      tapUsd: Number(run.tapUsd),
    };
  }

  async getReconciliationResultsByRunId(id: number): Promise<ReconciliationResult[]> {
    const results = await db.select().from(reconciliationResults).where(eq(reconciliationResults.runId, id));
    
    return results.map(r => ({
      matchStatus: r.matchStatus as "matched" | "bank_only" | "database_only",
      transactionReference: r.transactionReference,
      bankData: r.bankData as any,
      databaseData: r.databaseData as any,
    }));
  }
}

export const storage = new PgStorage();
