CREATE TABLE "audit_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(36),
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text,
	"payload" jsonb,
	"ip_address" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "departments" (
	"id" varchar(50) PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_templates" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_type" text NOT NULL,
	"document_type" text NOT NULL,
	"google_docs_link" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_code" varchar(20) NOT NULL,
	"user_id" varchar(36),
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"full_name" text NOT NULL,
	"department_id" varchar(50),
	"position" text,
	"manager_employee_id" integer,
	"status" text DEFAULT 'active' NOT NULL,
	"hire_date" date,
	"termination_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "employees_employee_code_unique" UNIQUE("employee_code"),
	CONSTRAINT "employees_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "employees_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"giver_employee_id" integer,
	"receiver_employee_id" integer NOT NULL,
	"cycle_id" integer,
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"content" text NOT NULL,
	"category" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goal_updates" (
	"id" serial PRIMARY KEY NOT NULL,
	"goal_id" integer NOT NULL,
	"progress" numeric(5, 2),
	"comment" text,
	"created_by" varchar(36),
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"cycle_id" integer,
	"title" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'not_started' NOT NULL,
	"weight" numeric(5, 2),
	"start_date" date,
	"due_date" date,
	"completed_at" timestamp,
	"visibility" text DEFAULT 'private' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"token" text NOT NULL,
	"position" text NOT NULL,
	"department" text NOT NULL,
	"probation_months" text,
	"notice_months" text,
	"start_date" date,
	"salary" numeric(10, 2) NOT NULL,
	"equity_shares" text,
	"vesting_years" text,
	"cliff_years" text,
	"vacation_days" text,
	"remote_vacation_days" text,
	"message" text,
	"is_used" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"used_at" timestamp,
	CONSTRAINT "invitations_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "new_joiners" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invitation_id" varchar(36),
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address" text NOT NULL,
	"position" text NOT NULL,
	"department" text NOT NULL,
	"probation_months" text,
	"notice_months" text,
	"start_date" date NOT NULL,
	"salary" numeric(10, 2) NOT NULL,
	"equity_shares" text,
	"vesting_years" text,
	"cliff_years" text,
	"vacation_days" text,
	"remote_vacation_days" text,
	"offer_letter_status" text DEFAULT 'pending' NOT NULL,
	"contract_status" text DEFAULT 'pending' NOT NULL,
	"esop_status" text DEFAULT 'pending' NOT NULL,
	"docusign_envelope_id" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reconciliation_results" (
	"id" serial PRIMARY KEY NOT NULL,
	"run_id" integer NOT NULL,
	"match_status" text NOT NULL,
	"transaction_reference" text NOT NULL,
	"bank_data" jsonb,
	"database_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reconciliation_runs" (
	"id" serial PRIMARY KEY NOT NULL,
	"bank_statement_filename" text,
	"database_filename" text,
	"value_date_filter" text,
	"total_matched" integer DEFAULT 0 NOT NULL,
	"total_bank_only" integer DEFAULT 0 NOT NULL,
	"total_database_only" integer DEFAULT 0 NOT NULL,
	"total_records" integer DEFAULT 0 NOT NULL,
	"total_bank_credit" numeric(15, 2) DEFAULT '0' NOT NULL,
	"total_meta_base_amount" numeric(15, 2) DEFAULT '0' NOT NULL,
	"total_deducted_amount" numeric(15, 2) DEFAULT '0' NOT NULL,
	"total_transaction_amount" numeric(15, 2) DEFAULT '0' NOT NULL,
	"checkout_aed" numeric(15, 2) DEFAULT '0' NOT NULL,
	"checkout_usd" numeric(15, 2) DEFAULT '0' NOT NULL,
	"tap_usd" numeric(15, 2) DEFAULT '0' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_cycles" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"period_start" date NOT NULL,
	"period_end" date NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"created_by" varchar(36),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"cycle_id" integer NOT NULL,
	"employee_id" integer NOT NULL,
	"manager_employee_id" integer,
	"status" text DEFAULT 'not_started' NOT NULL,
	"submitted_at" timestamp,
	"overall_rating" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "review_responses" (
	"id" serial PRIMARY KEY NOT NULL,
	"participant_id" integer NOT NULL,
	"responder_employee_id" integer,
	"responder_type" text NOT NULL,
	"section_key" text NOT NULL,
	"response" jsonb,
	"rating" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_departments" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"department_id" varchar(50) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar(36) PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"role" text DEFAULT 'member' NOT NULL,
	"designation" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_manager_employee_id_employees_id_fk" FOREIGN KEY ("manager_employee_id") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_giver_employee_id_employees_id_fk" FOREIGN KEY ("giver_employee_id") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_receiver_employee_id_employees_id_fk" FOREIGN KEY ("receiver_employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "feedback" ADD CONSTRAINT "feedback_cycle_id_review_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."review_cycles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_updates" ADD CONSTRAINT "goal_updates_goal_id_goals_id_fk" FOREIGN KEY ("goal_id") REFERENCES "public"."goals"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goal_updates" ADD CONSTRAINT "goal_updates_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_cycle_id_review_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."review_cycles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "new_joiners" ADD CONSTRAINT "new_joiners_invitation_id_invitations_id_fk" FOREIGN KEY ("invitation_id") REFERENCES "public"."invitations"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reconciliation_results" ADD CONSTRAINT "reconciliation_results_run_id_reconciliation_runs_id_fk" FOREIGN KEY ("run_id") REFERENCES "public"."reconciliation_runs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_cycles" ADD CONSTRAINT "review_cycles_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_participants" ADD CONSTRAINT "review_participants_cycle_id_review_cycles_id_fk" FOREIGN KEY ("cycle_id") REFERENCES "public"."review_cycles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_participants" ADD CONSTRAINT "review_participants_employee_id_employees_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employees"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_participants" ADD CONSTRAINT "review_participants_manager_employee_id_employees_id_fk" FOREIGN KEY ("manager_employee_id") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_responses" ADD CONSTRAINT "review_responses_participant_id_review_participants_id_fk" FOREIGN KEY ("participant_id") REFERENCES "public"."review_participants"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "review_responses" ADD CONSTRAINT "review_responses_responder_employee_id_employees_id_fk" FOREIGN KEY ("responder_employee_id") REFERENCES "public"."employees"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_departments" ADD CONSTRAINT "user_departments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_logs_user_idx" ON "audit_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_logs_created_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "employees_user_id_idx" ON "employees" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "employees_department_idx" ON "employees" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "employees_manager_idx" ON "employees" USING btree ("manager_employee_id");--> statement-breakpoint
CREATE INDEX "employees_status_idx" ON "employees" USING btree ("status");--> statement-breakpoint
CREATE INDEX "employees_email_idx" ON "employees" USING btree ("email");--> statement-breakpoint
CREATE INDEX "feedback_receiver_idx" ON "feedback" USING btree ("receiver_employee_id");--> statement-breakpoint
CREATE INDEX "feedback_giver_idx" ON "feedback" USING btree ("giver_employee_id");--> statement-breakpoint
CREATE INDEX "feedback_cycle_idx" ON "feedback" USING btree ("cycle_id");--> statement-breakpoint
CREATE INDEX "goal_updates_goal_idx" ON "goal_updates" USING btree ("goal_id");--> statement-breakpoint
CREATE INDEX "goals_employee_idx" ON "goals" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "goals_cycle_idx" ON "goals" USING btree ("cycle_id");--> statement-breakpoint
CREATE INDEX "goals_status_idx" ON "goals" USING btree ("status");--> statement-breakpoint
CREATE INDEX "reconciliation_results_run_idx" ON "reconciliation_results" USING btree ("run_id");--> statement-breakpoint
CREATE INDEX "reconciliation_results_status_idx" ON "reconciliation_results" USING btree ("match_status");--> statement-breakpoint
CREATE INDEX "reconciliation_runs_created_idx" ON "reconciliation_runs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "review_cycles_status_idx" ON "review_cycles" USING btree ("status");--> statement-breakpoint
CREATE INDEX "review_cycles_period_idx" ON "review_cycles" USING btree ("period_start","period_end");--> statement-breakpoint
CREATE UNIQUE INDEX "review_participants_unique_idx" ON "review_participants" USING btree ("cycle_id","employee_id");--> statement-breakpoint
CREATE INDEX "review_participants_cycle_idx" ON "review_participants" USING btree ("cycle_id");--> statement-breakpoint
CREATE INDEX "review_participants_employee_idx" ON "review_participants" USING btree ("employee_id");--> statement-breakpoint
CREATE INDEX "review_participants_manager_idx" ON "review_participants" USING btree ("manager_employee_id");--> statement-breakpoint
CREATE INDEX "review_participants_status_idx" ON "review_participants" USING btree ("status");--> statement-breakpoint
CREATE INDEX "review_responses_participant_idx" ON "review_responses" USING btree ("participant_id");--> statement-breakpoint
CREATE INDEX "review_responses_responder_idx" ON "review_responses" USING btree ("responder_employee_id");--> statement-breakpoint
CREATE INDEX "review_responses_type_idx" ON "review_responses" USING btree ("responder_type");--> statement-breakpoint
CREATE UNIQUE INDEX "user_departments_unique_idx" ON "user_departments" USING btree ("user_id","department_id");--> statement-breakpoint
CREATE INDEX "user_departments_user_idx" ON "user_departments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_departments_dept_idx" ON "user_departments" USING btree ("department_id");--> statement-breakpoint
CREATE INDEX "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "users_is_active_idx" ON "users" USING btree ("is_active");