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
