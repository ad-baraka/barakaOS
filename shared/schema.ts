import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, date, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (shared across modules)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

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
