import { db } from "./db";
import { users, employees, userDepartments, departments } from "@shared/schema";
import { EMPLOYEES_DATA, normalizeEmployeeDepartment, DEFAULT_PASSWORD } from "@shared/employees-data";
import { MODULES_CONFIG } from "@shared/modules";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

const SALT_ROUNDS = 10;

async function seed() {
  console.log("Starting database seed...");

  try {
    console.log("Seeding departments...");
    for (const module of MODULES_CONFIG) {
      await db.insert(departments).values({
        id: module.id,
        label: module.label,
        description: `${module.label} department`,
      }).onConflictDoNothing();
    }
    console.log(`Seeded ${MODULES_CONFIG.length} departments`);

    console.log("Hashing default password...");
    const passwordHash = await bcrypt.hash(DEFAULT_PASSWORD, SALT_ROUNDS);

    console.log("Seeding employees and users...");
    const employeeIdMap = new Map<string, number>();

    for (const emp of EMPLOYEES_DATA) {
      const nameParts = emp.name.split(' ');
      const firstName = nameParts[0];
      const lastName = nameParts.slice(1).join(' ') || firstName;
      const normalizedDept = normalizeEmployeeDepartment(emp.department);
      const isSuperAdmin = emp.employeeId === "EMP0015";

      const [insertedUser] = await db.insert(users).values({
        id: emp.userId,
        email: emp.email,
        passwordHash,
        firstName,
        lastName,
        role: isSuperAdmin ? "super_admin" : "member",
        designation: emp.position || null,
        isActive: true,
      }).onConflictDoNothing().returning();

      if (insertedUser && normalizedDept) {
        await db.insert(userDepartments).values({
          userId: insertedUser.id,
          departmentId: normalizedDept,
        }).onConflictDoNothing();
      }

      const [insertedEmployee] = await db.insert(employees).values({
        employeeCode: emp.employeeId,
        userId: emp.userId,
        email: emp.email,
        firstName,
        lastName,
        fullName: emp.name,
        departmentId: normalizedDept,
        position: emp.position || null,
        status: "active",
      }).onConflictDoNothing().returning();

      if (insertedEmployee) {
        employeeIdMap.set(emp.employeeId, insertedEmployee.id);
      }
    }

    console.log("Updating manager relationships...");
    for (const emp of EMPLOYEES_DATA) {
      if (emp.managerId) {
        const employeeId = employeeIdMap.get(emp.employeeId);
        const managerId = employeeIdMap.get(emp.managerId);
        
        if (employeeId && managerId) {
          await db.update(employees)
            .set({ managerEmployeeId: managerId })
            .where(eq(employees.id, employeeId));
        }
      }
    }

    console.log(`Seeded ${EMPLOYEES_DATA.length} employees and users`);
    console.log("Database seed completed successfully!");
    
  } catch (error) {
    console.error("Seed error:", error);
    throw error;
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
