# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev      # Start dev server on port 3000
npm run build    # Production build with Vite
npm run preview  # Preview production build
```

No test or lint scripts are currently configured.

## Architecture Overview

This is a React 18 + TypeScript project management application using Vite as the build tool and Supabase as the backend (PostgreSQL + Auth + Storage + Realtime).

### Entry Flow
`index.tsx` → `App.tsx` → AuthProvider → AppProvider → AppLayout

### State Management
Two React Context providers handle all application state:
- **AuthContext** (`context/AuthContext.tsx`): Authentication, session management, profile updates
- **AppContext** (`context/AppContext.tsx`): All application data (projects, tasks, team, events), CRUD operations, and toast notifications via `notify(message, type)`

### Routing
Simple string-based routing via `currentView` state in AppContext - no React Router. Views: 'dashboard', 'projects', 'tasks', 'calendar', 'team', 'settings'.

### Service Layer
- `services/supabase.ts`: Supabase client initialization
- `services/storage.ts`: StorageService class with CRUD methods and type mapping functions (mapProject, mapTask, etc.) that convert between Supabase DB rows and app types
- `services/notifications.ts`: NotificationService for user notifications

### Key Patterns
- After any CRUD operation, call `loadData()` to refresh state
- File uploads: Queue files during creation, upload after entity saves
- Real-time updates via Supabase Realtime channel subscriptions
- Toast notifications: Use `notify(message, 'success' | 'error')` from AppContext

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

- Tailwind CSS via CDN with custom theme (primary: #f9f506)
- Lucide React for icons
- Recharts for dashboard charts
- Custom font: Spline Sans

## Path Aliases

`@/` maps to the project root (configured in vite.config.ts and tsconfig.json).
