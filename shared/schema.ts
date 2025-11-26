import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, date, timestamp, boolean, integer, serial, jsonb, index, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { MODULES_CONFIG, DEPARTMENT_LABELS } from "./modules";

// User roles
export const USER_ROLES = ["super_admin", "admin", "member"] as const;
export type UserRole = typeof USER_ROLES[number];

// Departments - derived from centralized modules config (single source of truth)
export const DEPARTMENTS = MODULES_CONFIG.map((m) => m.id) as unknown as readonly [string, ...string[]];
export type Department = typeof DEPARTMENTS[number];

// Re-export for convenience
export { DEPARTMENT_LABELS } from "./modules";

// ============================================================
// Core Tables - Departments
// ============================================================

export const departments = pgTable("departments", {
  id: varchar("id", { length: 50 }).primaryKey(),
  label: text("label").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type DepartmentRecord = typeof departments.$inferSelect;

// ============================================================
// Core Tables - Users
// ============================================================

export const users = pgTable("users", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("member"),
  designation: text("designation"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("users_email_idx").on(table.email),
  index("users_role_idx").on(table.role),
  index("users_is_active_idx").on(table.isActive),
]);

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const createUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum(USER_ROLES),
  departments: z.array(z.string()).optional(),
  designation: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type User = typeof users.$inferSelect & {
  password?: string;
  department?: string | null;
  departments?: string | null;
};

// Safe user type without password
export type SafeUser = Omit<User, "password" | "passwordHash">;

// ============================================================
// Core Tables - User Departments (Many-to-Many)
// ============================================================

export const userDepartments = pgTable("user_departments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 }).notNull().references(() => users.id, { onDelete: "cascade" }),
  departmentId: varchar("department_id", { length: 50 }).notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  uniqueIndex("user_departments_unique_idx").on(table.userId, table.departmentId),
  index("user_departments_user_idx").on(table.userId),
  index("user_departments_dept_idx").on(table.departmentId),
]);

export type UserDepartment = typeof userDepartments.$inferSelect;

// ============================================================
// Core Tables - Employees
// ============================================================

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  employeeCode: varchar("employee_code", { length: 20 }).notNull().unique(),
  userId: varchar("user_id", { length: 36 }).unique().references(() => users.id, { onDelete: "set null" }),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  fullName: text("full_name").notNull(),
  departmentId: varchar("department_id", { length: 50 }),
  position: text("position"),
  managerEmployeeId: integer("manager_employee_id").references((): any => employees.id, { onDelete: "set null" }),
  status: text("status").notNull().default("active"),
  hireDate: date("hire_date"),
  terminationDate: date("termination_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("employees_user_id_idx").on(table.userId),
  index("employees_department_idx").on(table.departmentId),
  index("employees_manager_idx").on(table.managerEmployeeId),
  index("employees_status_idx").on(table.status),
  index("employees_email_idx").on(table.email),
]);

export const insertEmployeeSchema = createInsertSchema(employees).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type EmployeeRecord = typeof employees.$inferSelect;

// Employee type for API responses (includes manager details)
export interface Employee {
  employeeId: string;
  id?: number;
  userId: string | null;
  name: string;
  firstName: string;
  lastName: string;
  department: string | null;
  position: string | null;
  managerId: string | null;
  managerName: string | null;
  email?: string | null;
  isLinkedToUser: boolean;
}

// ============================================================
// Performance Module - Review Cycles
// ============================================================

export const reviewCycles = pgTable("review_cycles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  periodStart: date("period_start").notNull(),
  periodEnd: date("period_end").notNull(),
  status: text("status").notNull().default("draft"),
  createdBy: varchar("created_by", { length: 36 }).references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("review_cycles_status_idx").on(table.status),
  index("review_cycles_period_idx").on(table.periodStart, table.periodEnd),
]);

export type ReviewCycle = typeof reviewCycles.$inferSelect;

// ============================================================
// Performance Module - Review Participants
// ============================================================

export const reviewParticipants = pgTable("review_participants", {
  id: serial("id").primaryKey(),
  cycleId: integer("cycle_id").notNull().references(() => reviewCycles.id, { onDelete: "cascade" }),
  employeeId: integer("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  managerEmployeeId: integer("manager_employee_id").references(() => employees.id, { onDelete: "set null" }),
  status: text("status").notNull().default("not_started"),
  submittedAt: timestamp("submitted_at"),
  overallRating: integer("overall_rating"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  uniqueIndex("review_participants_unique_idx").on(table.cycleId, table.employeeId),
  index("review_participants_cycle_idx").on(table.cycleId),
  index("review_participants_employee_idx").on(table.employeeId),
  index("review_participants_manager_idx").on(table.managerEmployeeId),
  index("review_participants_status_idx").on(table.status),
]);

export type ReviewParticipant = typeof reviewParticipants.$inferSelect;

// ============================================================
// Performance Module - Review Responses
// ============================================================

export const reviewResponses = pgTable("review_responses", {
  id: serial("id").primaryKey(),
  participantId: integer("participant_id").notNull().references(() => reviewParticipants.id, { onDelete: "cascade" }),
  responderEmployeeId: integer("responder_employee_id").references(() => employees.id, { onDelete: "set null" }),
  responderType: text("responder_type").notNull(),
  sectionKey: text("section_key").notNull(),
  response: jsonb("response"),
  rating: integer("rating"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("review_responses_participant_idx").on(table.participantId),
  index("review_responses_responder_idx").on(table.responderEmployeeId),
  index("review_responses_type_idx").on(table.responderType),
]);

export type ReviewResponse = typeof reviewResponses.$inferSelect;

// ============================================================
// Goals Module
// ============================================================

export const goals = pgTable("goals", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  cycleId: integer("cycle_id").references(() => reviewCycles.id, { onDelete: "set null" }),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status").notNull().default("not_started"),
  weight: decimal("weight", { precision: 5, scale: 2 }),
  startDate: date("start_date"),
  dueDate: date("due_date"),
  completedAt: timestamp("completed_at"),
  visibility: text("visibility").notNull().default("private"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (table) => [
  index("goals_employee_idx").on(table.employeeId),
  index("goals_cycle_idx").on(table.cycleId),
  index("goals_status_idx").on(table.status),
]);

export type Goal = typeof goals.$inferSelect;

// ============================================================
// Goals Module - Goal Updates/Progress
// ============================================================

export const goalUpdates = pgTable("goal_updates", {
  id: serial("id").primaryKey(),
  goalId: integer("goal_id").notNull().references(() => goals.id, { onDelete: "cascade" }),
  progress: decimal("progress", { precision: 5, scale: 2 }),
  comment: text("comment"),
  createdBy: varchar("created_by", { length: 36 }).references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("goal_updates_goal_idx").on(table.goalId),
]);

export type GoalUpdate = typeof goalUpdates.$inferSelect;

// ============================================================
// Feedback Module
// ============================================================

export const feedback = pgTable("feedback", {
  id: serial("id").primaryKey(),
  giverEmployeeId: integer("giver_employee_id").references(() => employees.id, { onDelete: "set null" }),
  receiverEmployeeId: integer("receiver_employee_id").notNull().references(() => employees.id, { onDelete: "cascade" }),
  cycleId: integer("cycle_id").references(() => reviewCycles.id, { onDelete: "set null" }),
  isAnonymous: boolean("is_anonymous").notNull().default(false),
  content: text("content").notNull(),
  category: text("category"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("feedback_receiver_idx").on(table.receiverEmployeeId),
  index("feedback_giver_idx").on(table.giverEmployeeId),
  index("feedback_cycle_idx").on(table.cycleId),
]);

export type Feedback = typeof feedback.$inferSelect;

// ============================================================
// Audit Logs
// ============================================================

export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 36 }).references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id"),
  payload: jsonb("payload"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("audit_logs_user_idx").on(table.userId),
  index("audit_logs_entity_idx").on(table.entityType, table.entityId),
  index("audit_logs_action_idx").on(table.action),
  index("audit_logs_created_idx").on(table.createdAt),
]);

export type AuditLog = typeof auditLogs.$inferSelect;

// ============================================================
// HR Module - Invitations
// ============================================================

export const invitations = pgTable("invitations", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  token: text("token").notNull().unique(),
  position: text("position").notNull(),
  department: text("department").notNull(),
  probationMonths: text("probation_months"),
  noticeMonths: text("notice_months"),
  startDate: date("start_date"),
  salary: decimal("salary", { precision: 10, scale: 2 }).notNull(),
  equityShares: text("equity_shares"),
  vestingYears: text("vesting_years"),
  cliffYears: text("cliff_years"),
  vacationDays: text("vacation_days"),
  remoteVacationDays: text("remote_vacation_days"),
  message: text("message"),
  isUsed: boolean("is_used").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  usedAt: timestamp("used_at"),
});

export const insertInvitationSchema = createInsertSchema(invitations).omit({
  id: true,
  token: true,
  isUsed: true,
  createdAt: true,
  usedAt: true,
});

export type InsertInvitation = z.infer<typeof insertInvitationSchema>;
export type Invitation = typeof invitations.$inferSelect;

// ============================================================
// HR Module - New Joiners
// ============================================================

export const newJoiners = pgTable("new_joiners", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  invitationId: varchar("invitation_id", { length: 36 }).references(() => invitations.id),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address").notNull(),
  position: text("position").notNull(),
  department: text("department").notNull(),
  probationMonths: text("probation_months"),
  noticeMonths: text("notice_months"),
  startDate: date("start_date").notNull(),
  salary: decimal("salary", { precision: 10, scale: 2 }).notNull(),
  equityShares: text("equity_shares"),
  vestingYears: text("vesting_years"),
  cliffYears: text("cliff_years"),
  vacationDays: text("vacation_days"),
  remoteVacationDays: text("remote_vacation_days"),
  offerLetterStatus: text("offer_letter_status").notNull().default("pending"),
  contractStatus: text("contract_status").notNull().default("pending"),
  esopStatus: text("esop_status").notNull().default("pending"),
  docusignEnvelopeId: text("docusign_envelope_id"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertNewJoinerSchema = createInsertSchema(newJoiners).omit({
  id: true,
  createdAt: true,
  offerLetterStatus: true,
  contractStatus: true,
  esopStatus: true,
  docusignEnvelopeId: true,
});

export type InsertNewJoiner = z.infer<typeof insertNewJoinerSchema>;
export type NewJoiner = typeof newJoiners.$inferSelect;

// Schema for public form submission (new joiner fills out)
export const publicOnboardingSchema = z.object({
  token: z.string(),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  startDate: z.string().min(1, "Start date is required"),
});

export type PublicOnboardingFormData = z.infer<typeof publicOnboardingSchema>;

// ============================================================
// HR Module - Document templates
// ============================================================

export const documentTemplates = pgTable("document_templates", {
  id: varchar("id", { length: 36 }).primaryKey().default(sql`gen_random_uuid()`),
  templateType: text("template_type").notNull(),
  documentType: text("document_type").notNull(),
  googleDocsLink: text("google_docs_link"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertDocumentTemplateSchema = createInsertSchema(documentTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateDocumentTemplateSchema = insertDocumentTemplateSchema.partial();

export type InsertDocumentTemplate = z.infer<typeof insertDocumentTemplateSchema>;
export type UpdateDocumentTemplate = z.infer<typeof updateDocumentTemplateSchema>;
export type DocumentTemplate = typeof documentTemplates.$inferSelect;

// ============================================================
// Finance Module - Reconciliation Runs
// ============================================================

export const reconciliationRuns = pgTable("reconciliation_runs", {
  id: serial("id").primaryKey(),
  bankStatementFilename: text("bank_statement_filename"),
  databaseFilename: text("database_filename"),
  valueDateFilter: text("value_date_filter"),
  totalMatched: integer("total_matched").notNull().default(0),
  totalBankOnly: integer("total_bank_only").notNull().default(0),
  totalDatabaseOnly: integer("total_database_only").notNull().default(0),
  totalRecords: integer("total_records").notNull().default(0),
  totalBankCredit: decimal("total_bank_credit", { precision: 15, scale: 2 }).notNull().default("0"),
  totalMetaBaseAmount: decimal("total_meta_base_amount", { precision: 15, scale: 2 }).notNull().default("0"),
  totalDeductedAmount: decimal("total_deducted_amount", { precision: 15, scale: 2 }).notNull().default("0"),
  totalTransactionAmount: decimal("total_transaction_amount", { precision: 15, scale: 2 }).notNull().default("0"),
  checkoutAed: decimal("checkout_aed", { precision: 15, scale: 2 }).notNull().default("0"),
  checkoutUsd: decimal("checkout_usd", { precision: 15, scale: 2 }).notNull().default("0"),
  tapUsd: decimal("tap_usd", { precision: 15, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("reconciliation_runs_created_idx").on(table.createdAt),
]);

export type ReconciliationRunRecord = typeof reconciliationRuns.$inferSelect;

// ============================================================
// Finance Module - Reconciliation Results
// ============================================================

export const reconciliationResults = pgTable("reconciliation_results", {
  id: serial("id").primaryKey(),
  runId: integer("run_id").notNull().references(() => reconciliationRuns.id, { onDelete: "cascade" }),
  matchStatus: text("match_status").notNull(),
  transactionReference: text("transaction_reference").notNull(),
  bankData: jsonb("bank_data"),
  databaseData: jsonb("database_data"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => [
  index("reconciliation_results_run_idx").on(table.runId),
  index("reconciliation_results_status_idx").on(table.matchStatus),
]);

export type ReconciliationResultRecord = typeof reconciliationResults.$inferSelect;

// ============================================================
// Finance Module - Reconciliation Schemas (for API)
// ============================================================

export const bankStatementRowSchema = z.object({
  "Account Number": z.string(),
  "Transaction Date": z.string(),
  "Value Date": z.string(),
  "Narration": z.string(),
  "Transaction Reference": z.string(),
  "Debit": z.string(),
  "Credit": z.string(),
  "Running Balance": z.string(),
  "Currency": z.string(),
});

export type BankStatementRow = z.infer<typeof bankStatementRowSchema>;

export const databaseRowSchema = z.object({
  created_at: z.string(),
  original_currency: z.string(),
  amount: z.string(),
  deducted_amount_in_usd: z.string(),
  total_amount_in_original_currency: z.string(),
  deposit_id: z.string(),
  user_id: z.string(),
  fee_name: z.string(),
  notification_id: z.string(),
  fee_proportion_according_to_fee_name_if_tiered: z.string(),
  fee_proportion_by_calculation: z.string(),
  firstname: z.string(),
  lastname: z.string(),
  phonecountrycode: z.string(),
  transaction_currency: z.string(),
  transaction_amount: z.string(),
  va_number: z.string(),
  vam_reference_number: z.string(),
});

export type DatabaseRow = z.infer<typeof databaseRowSchema>;

export const reconciliationResultSchema = z.object({
  matchStatus: z.enum(["matched", "bank_only", "database_only"]),
  transactionReference: z.string(),
  bankData: bankStatementRowSchema.nullable(),
  databaseData: databaseRowSchema.nullable(),
});

export type ReconciliationResult = z.infer<typeof reconciliationResultSchema>;

export const currencyStatsSchema = z.object({
  bankCredit: z.number(),
  transactionAmount: z.number(),
  deductedAmount: z.number(),
});

export type CurrencyStats = z.infer<typeof currencyStatsSchema>;

export const specialTransactionsSchema = z.object({
  checkoutAed: z.number(),
  checkoutUsd: z.number(),
  tapUsd: z.number(),
});

export type SpecialTransactions = z.infer<typeof specialTransactionsSchema>;

export const reconciliationStatsSchema = z.object({
  totalMatched: z.number(),
  totalBankOnly: z.number(),
  totalDatabaseOnly: z.number(),
  totalRecords: z.number(),
  totalBankCredit: z.number(),
  totalMetaBaseAmount: z.number(),
  totalDeductedAmount: z.number(),
  totalTransactionAmount: z.number(),
  byCurrency: z.record(z.string(), currencyStatsSchema),
  specialTransactions: specialTransactionsSchema.optional(),
});

export type ReconciliationStats = z.infer<typeof reconciliationStatsSchema>;

export const reconciliationMetadataSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  bankStatementFilename: z.string().nullable(),
  databaseFilename: z.string().nullable(),
  valueDateFilter: z.string().nullable(),
});

export type ReconciliationMetadata = z.infer<typeof reconciliationMetadataSchema>;

export const reconciliationResponseSchema = z.object({
  results: z.array(reconciliationResultSchema),
  stats: reconciliationStatsSchema,
  metadata: reconciliationMetadataSchema.optional(),
});

export type ReconciliationResponse = z.infer<typeof reconciliationResponseSchema>;

export interface ReconciliationRun {
  id: number;
  createdAt: string;
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
