import { type User, type SafeUser, type CreateUser } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: CreateUser): Promise<SafeUser>;
  getAllUsers(): Promise<SafeUser[]>;
  updateUser(id: string, updates: Partial<CreateUser>): Promise<SafeUser | undefined>;
  deleteUser(id: string): Promise<boolean>;
}

// Helper to remove password from user object
function toSafeUser(user: User): SafeUser {
  const { password, ...safeUser } = user;
  return safeUser;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;

  constructor() {
    this.users = new Map();
    this.initializeMockUsers();
  }

  private initializeMockUsers() {
    // Super Admin - can see everything
    const superAdmin: User = {
      id: "1",
      email: "superadmin@baraka.com",
      password: "admin123",
      firstName: "Super",
      lastName: "Admin",
      role: "super_admin",
      department: null,
      designation: "System Administrator",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(superAdmin.id, superAdmin);

    // Engineering Admin
    const engineeringAdmin: User = {
      id: "2",
      email: "eng.admin@baraka.com",
      password: "eng123",
      firstName: "John",
      lastName: "Engineer",
      role: "admin",
      department: "engineering",
      designation: "Engineering Manager",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(engineeringAdmin.id, engineeringAdmin);

    // HR Admin
    const hrAdmin: User = {
      id: "3",
      email: "hr.admin@baraka.com",
      password: "hr123",
      firstName: "Sarah",
      lastName: "Resources",
      role: "admin",
      department: "human_resources",
      designation: "HR Manager",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(hrAdmin.id, hrAdmin);

    // Marketing Admin
    const marketingAdmin: User = {
      id: "4",
      email: "marketing.admin@baraka.com",
      password: "mkt123",
      firstName: "Mike",
      lastName: "Marketing",
      role: "admin",
      department: "marketing",
      designation: "Marketing Director",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(marketingAdmin.id, marketingAdmin);

    // Compliance Admin
    const complianceAdmin: User = {
      id: "5",
      email: "compliance.admin@baraka.com",
      password: "comp123",
      firstName: "Carol",
      lastName: "Compliance",
      role: "admin",
      department: "compliance",
      designation: "Compliance Officer",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(complianceAdmin.id, complianceAdmin);

    // Regular member (Engineering)
    const engMember: User = {
      id: "6",
      email: "dev@baraka.com",
      password: "dev123",
      firstName: "Dave",
      lastName: "Developer",
      role: "member",
      department: "engineering",
      designation: "Software Developer",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(engMember.id, engMember);
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
      department: userData.department || null,
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

    const updatedUser: User = {
      ...user,
      ...updates,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return toSafeUser(updatedUser);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}

export const storage = new MemStorage();
