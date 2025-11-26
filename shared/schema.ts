import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, date, timestamp, boolean } from "drizzle-orm/pg-core";
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

// Users table with roles and departments
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  role: text("role").notNull().default("member"), // super_admin, admin, member
  department: text("department"), // deprecated: use departments instead
  departments: text("departments"), // JSON array of departments - allows multi-department access
  designation: text("designation"), // job title from org chart
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

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
  department: z.enum(DEPARTMENTS).nullable().optional(), // deprecated: use departments
  departments: z.array(z.enum(DEPARTMENTS)).optional(), // allows multi-department access
  designation: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type LoginCredentials = z.infer<typeof loginSchema>;
export type User = typeof users.$inferSelect;

// Safe user type without password
export type SafeUser = Omit<User, "password">;

// HR Module - Invitations
export const invitations = pgTable("invitations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
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

// HR Module - New Joiners
export const newJoiners = pgTable("new_joiners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invitationId: varchar("invitation_id").references(() => invitations.id),
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

// HR Module - Document templates for each employment type
export const documentTemplates = pgTable("document_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateType: text("template_type").notNull(), // full-time-difc, contractor-difc, contractor, contractor-marketing
  documentType: text("document_type").notNull(), // offer-letter, employment-contract, esop-agreement
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
// Finance Module - Reconciliation Schemas
// ============================================================

// Bank Statement Row Schema
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

// Database Row Schema
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

// Reconciliation Result Schema
export const reconciliationResultSchema = z.object({
  matchStatus: z.enum(["matched", "bank_only", "database_only"]),
  transactionReference: z.string(),
  bankData: bankStatementRowSchema.nullable(),
  databaseData: databaseRowSchema.nullable(),
});

export type ReconciliationResult = z.infer<typeof reconciliationResultSchema>;

// Currency breakdown for stats
export const currencyStatsSchema = z.object({
  bankCredit: z.number(),
  transactionAmount: z.number(),
  deductedAmount: z.number(),
});

export type CurrencyStats = z.infer<typeof currencyStatsSchema>;

// Special transactions stats (INWARD CHECKOUT and TAP)
export const specialTransactionsSchema = z.object({
  checkoutAed: z.number(),
  checkoutUsd: z.number(),
  tapUsd: z.number(),
});

export type SpecialTransactions = z.infer<typeof specialTransactionsSchema>;

// Reconciliation Statistics Schema
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

// Metadata for historical reconciliation
export const reconciliationMetadataSchema = z.object({
  id: z.number(),
  createdAt: z.string(),
  bankStatementFilename: z.string().nullable(),
  databaseFilename: z.string().nullable(),
  valueDateFilter: z.string().nullable(),
});

export type ReconciliationMetadata = z.infer<typeof reconciliationMetadataSchema>;

// API Response Schema
export const reconciliationResponseSchema = z.object({
  results: z.array(reconciliationResultSchema),
  stats: reconciliationStatsSchema,
  metadata: reconciliationMetadataSchema.optional(),
});

export type ReconciliationResponse = z.infer<typeof reconciliationResponseSchema>;

// Reconciliation Run type for history
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
