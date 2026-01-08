# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start dev server on port 3000
npm run build        # Production build with Vite
npm run preview      # Preview production build
npm run lint         # Run ESLint on TypeScript files
npm run lint:fix     # Auto-fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
npm run type-check   # Run TypeScript type checking
```

## Architecture Overview

This is a React 18 + TypeScript project management application using Vite as the build tool and Supabase as the backend (PostgreSQL + Auth + Storage + Realtime).

### Entry Flow
`index.tsx` → `App.tsx` (wraps with BrowserRouter) → AuthProvider → AppProvider → AppLayout

### State Management
Two React Context providers handle all application state:
- **AuthContext** (`context/AuthContext.tsx`): Authentication via Supabase Auth, session management, profile updates, avatar uploads
- **AppContext** (`context/AppContext.tsx`): All application data (projects, tasks, team, events), CRUD operations, toast notifications via `notify(message, type)`, modal state management, and confirmation dialogs

### Routing
Uses React Router DOM with `<Routes>` in `App.tsx`. Routes: `/` (dashboard), `/projects`, `/tasks`, `/calendar`, `/team`, `/settings`. Unauthorized routes redirect to root.

### Service Layer
- `services/supabase.ts`: Supabase client initialization and error handling helpers
- `services/storage.ts`: StorageService singleton (`db` export) with CRUD methods and type mapping functions (mapProject, mapTask, etc.) that convert between Supabase snake_case DB columns to app camelCase types. Includes fallback to localStorage when Supabase is unavailable.
- `services/notifications.ts`: NotificationService for creating deadline notifications and user alerts

### File Structure
All source files are in the root directory (flat structure):
- `App.tsx`: Main application with routing and layout
- `components/`: UI components (Dashboard, ProjectsPage, TasksPage, CalendarPage, TeamPage, SettingsPage, Modals, etc.)
- `context/`: React Context providers (AuthContext, AppContext)
- `services/`: Backend integration services
- `types.ts`: Application TypeScript interfaces
- `types/supabase.ts`: Auto-generated Supabase types
- `constants.ts`: App-wide constants (e.g., DEFAULT_AVATAR)
- `utils/`: Utility functions
- `hooks/`: Custom React hooks

### Key Patterns
- After any CRUD operation, call `loadData()` from AppContext to refresh all state
- File uploads: Queue files with `__queuedFiles` property during creation, upload after entity saves
- Real-time updates: Supabase Realtime channel subscriptions auto-refresh data on DB changes
- Toast notifications: Use `notify(message, 'success' | 'error')` from AppContext
- Modals: State managed in AppContext (`isProjectModalOpen`, `editingProject`, etc.)
- Confirmations: Use `askConfirmation(title, message, onConfirm)` from AppContext
- Authentication check: All data loading guarded by `if (!user) return` checks

## Supabase Configuration

Environment variables in `.env.local`:
```
VITE_SUPABASE_URL=<supabase-url>
VITE_SUPABASE_ANON_KEY=<anon-key>
```

### Database Tables
- `profiles`: User data linked to Supabase Auth
- `projects`: Projects with status, progress, members, attachments
- `tasks`: Tasks with status, priority, estimated/actual hours
- `team_members`: Team directory
- `calendar_events`: Calendar events
- `project_attachments`: File metadata for project documents
- `notifications`: User notifications
- `meeting_notes`: Project meeting notes

### Storage Buckets
- `avatars`: User profile pictures
- `project-attachments`: Project documents

SQL schema files are in the repository root (e.g., `supabase-*.sql`).

## Type System

- `types.ts`: Application-level TypeScript interfaces (Project, Task, TeamMember, etc.)
- `types/supabase.ts`: Auto-generated Supabase database types

## UI Stack

- **Tailwind CSS**: Configured via `tailwind.config.js` with custom theme
  - Primary color: `#f9f506` (bright yellow)
  - Background: `#f8f8f5` (light), `#23220f` (dark)
  - Text: `#1c1c0d` (main), `#9e9d47` (muted)
  - Custom rounded corners and Spline Sans font
- **Icons**: Lucide React
- **Charts**: Recharts for dashboard visualizations
- **Styling approach**: Utility-first with Tailwind classes, dark mode support via `class` strategy

## Path Aliases

`@/` maps to the project root (configured in vite.config.ts and tsconfig.json).

## Important Notes

- **Flat structure**: Source files are in the root, not in a `src/` directory
- **Type safety**: Use interfaces from `types.ts`, not Supabase types directly in components
- **Error handling**: Services include try/catch with localStorage fallbacks for offline resilience
- **Deadline notifications**: Automated checks trigger notifications at 1, 3, and 7 days before deadlines
- **Database naming**: Supabase uses snake_case, app uses camelCase - always use mapper functions
