# Baraka OS

## Overview
Baraka OS is a full-stack TypeScript application featuring a React frontend with an Express backend. The application provides a role-based authentication system with department-specific dashboards for HR, Engineering, Marketing, Compliance, Analytics, and Performance management.

## Project Architecture

### Tech Stack
- **Frontend**: React 18, Vite, TailwindCSS, Radix UI components
- **Backend**: Express.js, TypeScript
- **Database**: PostgreSQL (Drizzle ORM configured, currently using in-memory storage)
- **Build Tools**: Vite, esbuild, tsx

### Project Structure
```
├── client/              # React frontend
│   ├── src/
│   │   ├── components/  # UI components (shadcn/ui)
│   │   ├── contexts/    # React contexts (auth, invitations)
│   │   ├── pages/       # Application pages
│   │   └── App.tsx      # Main application component
│   └── index.html
├── server/              # Express backend
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Data storage layer (in-memory)
│   └── vite.ts          # Vite dev server setup
├── shared/              # Shared code between client/server
│   ├── modules.ts       # Centralized module/department configuration (single source of truth)
│   ├── schema.ts        # Database schema and types
│   └── templates.ts     # Template definitions
└── attached_assets/     # Static assets
```

## Development Setup

### Running Locally
The application runs on port 5000 in both development and production:
- Development: `npm run dev` - Starts Express server with Vite dev middleware
- Production: `npm run build && npm start`

### Environment Configuration
- **Host**: The dev server is configured to accept connections from 0.0.0.0
- **Port**: 5000 (fixed for Replit)
- **HMR**: Configured for hot module replacement

## Database
The project is configured to use PostgreSQL with Drizzle ORM. Currently, it uses in-memory storage for development. The schema is defined in `shared/schema.ts`.

To push the schema to a database:
```bash
npm run db:push
```

## Test Accounts
The application includes pre-configured test accounts:
- **Super Admin**: superadmin@baraka.com / admin123
- **HR Admin**: hr.admin@baraka.com / hr123
- **Engineering Admin**: eng.admin@baraka.com / eng123
- **Marketing Admin**: marketing.admin@baraka.com / mkt123
- **Compliance Admin**: compliance.admin@baraka.com / comp123
- **Engineering Member**: dev@baraka.com / dev123

## Deployment
The project is configured for Replit Autoscale deployment:
- Build: `npm run build`
- Start: `npm start`

## Centralized Modules Configuration

The application uses a single source of truth for department/module configuration in `shared/modules.ts`. This ensures consistency across the entire application.

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
   - Add the sidebar section in `client/src/components/app-sidebar.tsx`
   - Create the page components for the new module

### Module Access Control
- Uses `canAccessModule(moduleId)` function from auth context
- Supports multi-department access (users can belong to multiple departments)
- Super admins can access all modules

## Recent Changes (November 26, 2025)
- Installed all project dependencies
- Configured Vite for Replit environment (host: 0.0.0.0, port: 5000)
- Set up development workflow
- Configured deployment settings
- Added missing `nanoid` dependency
- Added `papaparse` for CSV parsing in finance reconciliation
- Updated Finance Reconciliation page layout: horizontal "Value Date Filter" with calendar icon and date picker
- Applied consistent UI styling across all dashboard tabs:
  - All page titles use `text-3xl font-semibold`
  - Consistent `space-y-6` spacing between sections
  - Responsive grid layouts: `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
  - Consistent `mt-1` spacing for subtitles
- Implemented multi-department selection in User Management:
  - Users can now be assigned to multiple departments (e.g., Engineering AND Performance)
  - Department selection uses checkboxes for multi-select
  - Table displays multiple departments as separate badges
  - Schema updated to store departments as JSON array alongside legacy department field
  - Example: John Engineer has access to both Engineering and Performance modules
- Created centralized modules configuration system:
  - Single source of truth in `shared/modules.ts`
  - `DEPARTMENTS` array derived from centralized config
  - `DEPARTMENT_LABELS` derived from centralized config
  - Auth context dynamically builds module-to-department mapping
  - User Management imports labels from centralized config

### Centralized Employee Database (November 26, 2025)
- Created `shared/employees-data.ts` with 38 employees including manager relationships
- Employee data includes: employeeId, name, email, department, position, manager, managerId
- All employees have work emails from the @getbaraka.com domain
- New departments added: Design, Product, Executive, Growth, Customer Support, Finance
- API endpoints:
  - `GET /api/employees/search?q=<query>` - Search employees by name
  - `GET /api/employees/:id` - Get employee by employee ID
  - `GET /api/employees/:id/reports` - Get direct reports for a manager
  - `GET /api/employees/by-user/:userId` - Get employee linked to a user account

### User Accounts (November 26, 2025)
- All 38 employees have user accounts created automatically from employee data
- Super Admin: Feras Jalbout (CEO, EMP0015) - feras@getbaraka.com
- Default password for all users: **Password@123**
- User accounts are linked to employee records via userId

### User Management - Employee Search
- When creating a new user, admins search the employee directory
- Selecting an employee auto-populates: Email, First Name, Last Name, Department, Designation
- Email and name fields are read-only when populated from employee data
- Password is optional - defaults to Password@123 if not provided
- Only role needs to be selected manually

### Performance Module - Team Reviews
- Manager Dashboard now shows actual direct reports based on logged-in user's employee ID
- Dynamically calculates completion rates based on real team members
- Empty states for users without employee profiles or direct reports

### Sample Login Accounts
| Email | Name | Department | Role |
|-------|------|------------|------|
| feras@getbaraka.com | Feras Jalbout (CEO) | Executive | Super Admin |
| anil.dabas@getbaraka.com | Anil Dabas | Engineering | Member |
| david@getbaraka.com | David Farg | Engineering | Member |
| rafay@getbaraka.com | Rafay Qureshi | Growth | Member |
| muna@getbaraka.com | Muna Salah | Compliance | Member |

**Default password for all accounts: Password@123**
