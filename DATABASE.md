# Baraka OS Database Setup Guide

This guide explains how to set up Baraka OS with your own PostgreSQL database, including AWS RDS, AWS Aurora, or any PostgreSQL-compatible database.

## Database Architecture

Baraka OS uses PostgreSQL with the following tables:

### Core Tables
- **departments** - Department configuration
- **users** - User accounts with secure password hashing (bcrypt)
- **user_departments** - Multi-department access (many-to-many)
- **employees** - Employee directory with manager hierarchy

### Performance Module
- **review_cycles** - Performance review cycles
- **review_participants** - Employees participating in reviews
- **review_responses** - Self-assessments and manager feedback
- **goals** - Employee goals and OKRs
- **goal_updates** - Goal progress tracking
- **feedback** - Continuous feedback between employees

### HR Module
- **invitations** - Onboarding invitations
- **new_joiners** - New employee records
- **document_templates** - HR document templates

### Finance Module
- **reconciliation_runs** - Bank reconciliation history
- **reconciliation_results** - Detailed reconciliation results

### System
- **audit_logs** - Audit trail for compliance

## Environment Variables

Set the following environment variable to connect to your PostgreSQL database:

```bash
DATABASE_URL=postgresql://username:password@host:port/database_name
```

### Examples

**AWS RDS PostgreSQL:**
```bash
DATABASE_URL=postgresql://admin:MySecurePassword123@mydb.xxxxxxx.us-east-1.rds.amazonaws.com:5432/baraka_os
```

**AWS Aurora PostgreSQL:**
```bash
DATABASE_URL=postgresql://admin:MySecurePassword123@mydb-cluster.cluster-xxxxxxx.us-east-1.rds.amazonaws.com:5432/baraka_os
```

**Self-hosted PostgreSQL:**
```bash
DATABASE_URL=postgresql://baraka_user:password@192.168.1.100:5432/baraka_os
```

**Neon (Serverless PostgreSQL):**
```bash
DATABASE_URL=postgresql://username:password@ep-xxxxx.us-east-1.aws.neon.tech/baraka_os?sslmode=require
```

## Setup Commands

### 1. Run Migrations (Create Tables)
```bash
npm run db:migrate
```
This creates all tables, indexes, and foreign key relationships.

### 2. Seed Initial Data
```bash
npm run db:seed
```
This populates the database with:
- 12 departments
- 38 employees from the employee directory
- User accounts for all employees (password: Password@123)
- Manager relationships

### 3. Full Setup (Migrate + Seed)
```bash
npm run db:setup
```
Runs both migrations and seed in one command.

## AWS RDS Setup Guide

### Step 1: Create RDS Instance
1. Go to AWS RDS Console
2. Click "Create database"
3. Choose "PostgreSQL" (version 13 or higher recommended)
4. Select your instance size (db.t3.micro for development)
5. Set master username and password
6. Configure VPC and security groups

### Step 2: Configure Security Groups
Allow inbound traffic on port 5432 from:
- Your Replit IP (for development)
- Your application servers (for production)

### Step 3: Create Database
Connect to your RDS instance and run:
```sql
CREATE DATABASE baraka_os;
\c baraka_os
CREATE EXTENSION IF NOT EXISTS pgcrypto;
```

Note: The migration script automatically enables pgcrypto, but you can do it manually if needed.

### Step 4: Set Environment Variable
In Replit, add the DATABASE_URL secret with your RDS connection string:
```bash
DATABASE_URL=postgresql://admin:yourpassword@mydb.xxxxx.us-east-1.rds.amazonaws.com:5432/baraka_os
```

### Step 5: Run Setup
```bash
npm run db:setup
```

This will:
1. Run all migrations to create tables
2. Seed the database with departments and employees

## Database Driver Auto-Detection

The application automatically detects your database type:
- **Neon/Replit databases**: Uses WebSocket connection (neon-serverless)
- **AWS RDS/Standard PostgreSQL**: Uses TCP connection (node-postgres)

The detection is based on the DATABASE_URL:
- URLs containing "neon.tech" or "replit" → Neon driver
- All other URLs → Standard PostgreSQL driver with SSL support

## Security Notes

### Password Hashing
All passwords are hashed using bcrypt with a cost factor of 10. The default password "Password@123" is hashed before storage.

**Recommendation:** After initial setup, users should change their passwords. Consider implementing:
- Password change on first login
- Password complexity requirements
- Account lockout after failed attempts

### SSL/TLS
For production databases, enable SSL:
```bash
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

### Connection Pooling
The application uses connection pooling via @neondatabase/serverless. For high-traffic applications, consider:
- AWS RDS Proxy
- PgBouncer
- Supabase connection pooling

## Schema Migrations

### Generate New Migrations
When you modify the schema in `shared/schema.ts`:
```bash
npm run db:generate
```

### Apply Migrations
```bash
npm run db:migrate
```

### Quick Schema Push (Development Only)
For rapid development without migration files:
```bash
npm run db:push
```

## Backup and Recovery

### PostgreSQL Dump
```bash
pg_dump -h your-host -U username -d baraka_os > backup.sql
```

### Restore
```bash
psql -h your-host -U username -d baraka_os < backup.sql
```

### AWS RDS Automated Backups
Enable automated backups in RDS console with appropriate retention period.

## Troubleshooting

### Connection Errors
1. Verify DATABASE_URL is correctly formatted
2. Check security group allows your IP
3. Ensure database instance is running
4. Verify SSL settings if required

### Migration Errors
1. Check for existing tables that conflict
2. Review migration files in `./migrations`
3. Use `npm run db:push --force` for development

### Performance Issues
1. Check index usage with `EXPLAIN ANALYZE`
2. Monitor connection count
3. Consider connection pooling for scale
