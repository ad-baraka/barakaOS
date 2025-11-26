# Baraka OS

## Overview
Baraka OS is a full-stack TypeScript application featuring a React frontend with an Express backend. The application provides a role-based authentication system with department-specific dashboards for HR, Engineering, Marketing, Compliance, Analytics, and Performance management.

## Project Architecture

### Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, Radix UI components
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM (supports Replit DB, AWS RDS, Neon, or any PostgreSQL)
- **Authentication**: Bcrypt password hashing
- **Build Tools**: Vite, esbuild, tsx

### Project Structure
```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components organized by module
│   │   │   ├── ui/          # shadcn/ui base components
│   │   │   ├── shared/      # App-wide shared components (sidebar, theme)
│   │   │   ├── hr/          # HR module components
│   │   │   ├── performance/ # Performance module components
│   │   │   ├── marketing/   # Marketing module components
│   │   │   ├── finance/     # Finance module components
│   │   │   └── [module]/    # Other module component folders
│   │   ├── pages/       # Application pages organized by module
│   │   │   ├── hr/          # HR pages (dashboard, documents)
│   │   │   ├── performance/ # Performance pages (dashboard, reviews)
│   │   │   ├── marketing/   # Marketing pages
│   │   │   ├── finance/     # Finance pages
│   │   │   └── [module]/    # Other module page folders
│   │   ├── contexts/    # React contexts (auth, invitations)
│   │   └── App.tsx      # Main application component
│   └── index.html
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── db.ts            # Database connection
│   ├── pg-storage.ts    # PostgreSQL storage layer
│   ├── migrate.ts       # Migration runner
│   ├── seed.ts          # Database seeder
│   └── vite.ts          # Vite dev server setup
├── shared/              # Shared code between client/server
│   ├── modules.ts       # Centralized module/department configuration
│   ├── schema.ts        # Database schema (Drizzle ORM)
│   ├── employees-data.ts # Employee directory data
│   └── templates.ts     # Template definitions
├── migrations/          # SQL migration files
└── DATABASE.md          # Database setup documentation
```

## Database Setup

### Environment Variable
Set `DATABASE_URL` to connect to any PostgreSQL database:

```bash
# Replit (default)
DATABASE_URL=postgresql://user:pass@host:5432/db

# AWS RDS
DATABASE_URL=postgresql://admin:password@mydb.xxxxx.rds.amazonaws.com:5432/baraka_os

# Neon Serverless
DATABASE_URL=postgresql://user:pass@ep-xxx.neon.tech/baraka_os?sslmode=require
```

### Database Commands
```bash
npm run db:migrate    # Run migrations (create tables)
npm run db:seed       # Seed with initial data
npm run db:setup      # Run both migrate + seed
npm run db:push       # Quick schema sync (development)
npm run db:generate   # Generate new migration files
```

### Database Tables
- **Core**: users, employees, departments, user_departments
- **Performance**: review_cycles, review_participants, review_responses, goals, goal_updates, feedback
- **HR**: invitations, new_joiners, document_templates
- **Finance**: reconciliation_runs, reconciliation_results
- **System**: audit_logs

See `DATABASE.md` for complete setup instructions.

## Development Setup

### Running Locally
```bash
npm run dev    # Start development server on port 5000
```

### Production
```bash
npm run build && npm start
```

## Authentication

All passwords are hashed with bcrypt (cost factor 10).

### Default Accounts
| Email | Name | Role |
|-------|------|------|
| feras@getbaraka.com | Feras Jalbout (CEO) | Super Admin |
| anil.dabas@getbaraka.com | Anil Dabas | Member |
| david@getbaraka.com | David Farg | Member |
| rafay@getbaraka.com | Rafay Qureshi | Member |
| muna@getbaraka.com | Muna Salah | Member |

**Default password for all accounts: Password@123**

## Centralized Modules Configuration

The application uses a single source of truth for department/module configuration in `shared/modules.ts`.

### How to Add a New Module/Department

1. Add the module config to `MODULES_CONFIG` array in `shared/modules.ts`:
```typescript
{
  id: "new_module",
  label: "New Module",
  icon: "IconName",
  basePath: "/new-module",
  subItems: [
    { id: "dashboard", label: "Dashboard", path: "/new-module", icon: "LayoutDashboard" },
  ],
}
```

2. The following are automatically updated:
   - `DEPARTMENTS` array in schema (derived from MODULES_CONFIG)
   - `DEPARTMENT_LABELS` (derived from MODULES_CONFIG)
   - User Management department dropdown
   - Auth context module-to-department mapping

3. Manual updates needed:
   - Add the sidebar section in `client/src/components/shared/app-sidebar.tsx`
   - Create the component folder in `client/src/components/[module]/` with index.ts
   - Create the page folder in `client/src/pages/[module]/` with index.ts
   - Add routes in `client/src/App.tsx`

### Module Access Control
- Uses `canAccessModule(moduleId)` function from auth context
- Supports multi-department access (users can belong to multiple departments)
- Super admins can access all modules

## Employee Database

Centralized employee directory with 38 employees:
- File: `shared/employees-data.ts`
- Includes manager relationships (managerId)
- All employees have @getbaraka.com email addresses
- Departments: Engineering, Design, Product, Executive, Growth, Finance, Compliance, Customer Support

## Recent Changes (November 26, 2025)

### Module-Based Folder Organization
- Reorganized all components into module-specific folders (components/[module]/)
- Reorganized all pages into module-specific folders (pages/[module]/)
- Shared components (sidebar, theme, dialogs) moved to components/shared/
- Each module folder has an index.ts for clean barrel exports
- Modules with dedicated folders: shared, hr, performance, marketing, finance, customer-service, compliance, engineering, analytics, design, product, growth, executive

### PostgreSQL Database Migration
- Migrated from in-memory storage to PostgreSQL
- Created comprehensive schema with 16 tables
- Implemented proper foreign key relationships and indexes
- Added bcrypt password hashing for security
- Created migration files in `./migrations` folder
- Database supports both Neon (WebSocket) and AWS RDS (TCP) with auto-detection
- Dual driver support: @neondatabase/serverless for Neon, node-postgres (pg) for RDS
- SSL auto-configuration for AWS RDS connections

### Database Scripts
- `npm run db:migrate` - Run migrations on any PostgreSQL database
- `npm run db:seed` - Seed initial employee and user data
- `npm run db:setup` - Full setup (migrate + seed)

### Performance Dashboard & Manager Review
- Dashboard displays logged-in user's actual first name
- Manager Review shows actual manager details from employee database
- Avatar initials generated from manager's name

### User Management
- Employee search auto-populates user fields
- Email and name fields read-only when populated from employee data
- Multi-department selection with checkboxes

## Deployment
The project is configured for Replit Autoscale deployment:
- Build: `npm run build`
- Start: `npm start`
- Database: Set `DATABASE_URL` environment variable
