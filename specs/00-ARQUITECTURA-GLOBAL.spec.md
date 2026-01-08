# Gestión Pro Dashboard - Arquitectura Global

## Información del Proyecto

| Campo | Valor |
|-------|-------|
| **Nombre** | Gestión Pro Dashboard |
| **Tipo** | SPA (Single Page Application) |
| **Framework** | React 18.3.1 + TypeScript 5.8.2 |
| **Build Tool** | Vite 6.2.0 |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Estilos** | Tailwind CSS 3.4.19 |
| **Routing** | React Router DOM 7.11.0 |
| **Visualización** | Recharts 2.12.7 |
| **Iconos** | Lucide React 0.263.1 |

---

## Estructura del Proyecto

```
gestión-pro-dashboard/
│
├── 📁 specs/                          # Documentación técnica (NUEVO)
│   ├── 00-ARQUITECTURA-GLOBAL.spec.md
│   ├── 01-TYPES-CONSTANTS.spec.md
│   ├── 02-SERVICES.spec.md
│   ├── 03-CONTEXT.spec.md
│   ├── 04-COMPONENTS.spec.md
│   └── 05-HOOKS-UTILS.spec.md
│
├── 📁 components/                     # Componentes React
│   ├── AuthPage.tsx                   # Página de login/registro
│   ├── Dashboard.tsx                  # Dashboard principal
│   ├── ProjectsPage.tsx               # Gestión de proyectos
│   ├── TasksPage.tsx                  # Tablero Kanban de tareas
│   ├── CalendarPage.tsx               # Calendario de eventos
│   ├── TeamPage.tsx                   # Directorio de equipo
│   ├── SettingsPage.tsx               # Configuración de usuario
│   ├── Sidebar.tsx                    # Navegación lateral
│   ├── Modals.tsx                     # Todos los modales
│   ├── NotificationCenter.tsx         # Centro de notificaciones
│   ├── KPICards.tsx                   # Tarjetas de métricas
│   ├── ChartsSection.tsx              # Gráficos del dashboard
│   ├── ActiveProjects.tsx             # Lista proyectos activos
│   ├── PendingTasks.tsx               # Lista tareas pendientes
│   ├── MeetingNotesModal.tsx          # Modal de notas de reunión
│   ├── Toast.tsx                      # Notificaciones toast
│   └── ErrorBoundary.tsx              # Manejo de errores
│
├── 📁 context/                        # Estado global
│   ├── AuthContext.tsx                # Autenticación y usuario
│   └── AppContext.tsx                 # Datos de la aplicación
│
├── 📁 services/                       # Capa de datos
│   ├── supabase.ts                    # Cliente de Supabase
│   ├── storage.ts                     # CRUD de entidades
│   ├── notifications.ts               # Servicio de notificaciones
│   └── firebase.ts                    # (Deprecado)
│
├── 📁 hooks/                          # Hooks personalizados
│   ├── index.ts                       # Barrel file
│   ├── useClickOutside.ts             # Detectar clic fuera
│   └── useDebounce.ts                 # Debounce de valores
│
├── 📁 utils/                          # Utilidades
│   └── sanitize.ts                    # Sanitización XSS
│
├── 📁 types/                          # Tipos de Supabase
│   └── supabase.ts                    # Tipos auto-generados
│
├── 📁 public/                         # Assets estáticos
│   └── icons/                         # Iconos PWA
│
├── 📁 dist/                           # Build de producción
│
├── 📄 App.tsx                         # Componente raíz
├── 📄 index.tsx                       # Punto de entrada React
├── 📄 index.html                      # HTML template
├── 📄 index.css                       # Estilos globales
├── 📄 types.ts                        # Interfaces TypeScript
├── 📄 constants.ts                    # Constantes UI
├── 📄 vite.config.ts                  # Configuración Vite
├── 📄 tailwind.config.js              # Configuración Tailwind
├── 📄 tsconfig.json                   # Configuración TypeScript
├── 📄 package.json                    # Dependencias
├── 📄 sw.js                           # Service Worker (PWA)
├── 📄 manifest.json                   # Manifest PWA
└── 📄 supabase-*.sql                  # Esquemas de base de datos
```

---

## Arquitectura de Alto Nivel

```
┌─────────────────────────────────────────────────────────────────────┐
│                           FRONTEND                                   │
│                    (React + TypeScript + Vite)                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                        Components                            │   │
│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │   │
│  │  │ Pages   │ │ Layout  │ │ Shared  │ │ Modals  │           │   │
│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │   │
│  │       └───────────┴───────────┴───────────┘                 │   │
│  └───────────────────────────┬─────────────────────────────────┘   │
│                              │                                       │
│  ┌───────────────────────────▼─────────────────────────────────┐   │
│  │                      Context Layer                           │   │
│  │  ┌─────────────────┐         ┌─────────────────┐            │   │
│  │  │   AuthContext   │────────▶│   AppContext    │            │   │
│  │  │  (User, Auth)   │         │  (Data, CRUD)   │            │   │
│  │  └────────┬────────┘         └────────┬────────┘            │   │
│  └───────────┼───────────────────────────┼─────────────────────┘   │
│              │                           │                          │
│  ┌───────────▼───────────────────────────▼─────────────────────┐   │
│  │                     Services Layer                           │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │ supabase.ts  │  │ storage.ts   │  │ notifications.ts │   │   │
│  │  │  (Client)    │  │   (CRUD)     │  │   (Alerts)       │   │   │
│  │  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘   │   │
│  └─────────┼─────────────────┼───────────────────┼─────────────┘   │
│            └─────────────────┴───────────────────┘                  │
│                              │                                       │
└──────────────────────────────┼───────────────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼───────────────────────────────────────┐
│                           SUPABASE                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │   PostgreSQL    │  │   Auth          │  │   Storage       │      │
│  │   (Database)    │  │   (Auth users)  │  │   (Files)       │      │
│  │                 │  │                 │  │                 │      │
│  │  - profiles     │  │  - Sessions     │  │  - avatars      │      │
│  │  - projects     │  │  - JWT Tokens   │  │  - project-     │      │
│  │  - tasks        │  │  - RLS Policies │  │    attachments  │      │
│  │  - team_members │  │                 │  │                 │      │
│  │  - calendar_    │  │                 │  │                 │      │
│  │    events       │  │                 │  │                 │      │
│  │  - notifications│  │                 │  │                 │      │
│  │  - meeting_notes│  │                 │  │                 │      │
│  │  - project_     │  │                 │  │                 │      │
│  │    attachments  │  │                 │  │                 │      │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘      │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                      Realtime                                │    │
│  │            (WebSocket subscriptions to tables)               │    │
│  └─────────────────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────────────────┘
```

---

## Flujo de Datos

### 1. Autenticación
```
Usuario → AuthPage → supabase.auth.signIn/signUp → Supabase Auth
                                                          ↓
                                               JWT Token (localStorage)
                                                          ↓
                                               AuthContext.handleSessionChange
                                                          ↓
                                               profiles table → User object
```

### 2. Operaciones CRUD
```
Usuario → Componente → useApp() → AppContext
                                       ↓
                            addProject/editTask/etc.
                                       ↓
                              db.saveProject/updateTask/etc.
                                       ↓
                              Supabase (INSERT/UPDATE/DELETE)
                                       ↓
                              Realtime trigger
                                       ↓
                              loadData() → Actualizar estado
```

### 3. Notificaciones en Tiempo Real
```
Supabase Change Event
        ↓
channel.on('postgres_changes', ...)
        ↓
loadData() called
        ↓
checkForDeadlines()
        ↓
notificationService.notifyDeadlineApproaching()
        ↓
window.dispatchEvent('notificationCreated')
        ↓
NotificationCenter.loadNotifications()
```

---

## Modelo de Datos (Supabase)

### Diagrama ER Simplificado

```
┌─────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   profiles  │       │    projects     │       │     tasks       │
├─────────────┤       ├─────────────────┤       ├─────────────────┤
│ id (PK)     │───────│ created_by (FK) │       │ id (PK)         │
│ email       │       │ id (PK)         │◄──────│ project (name)  │
│ name        │       │ name            │       │ title           │
│ avatar      │       │ client          │       │ status          │
│ role        │       │ status          │       │ priority        │
│ settings... │       │ progress        │       │ due_date        │
└─────────────┘       │ due_date        │       │ assignee        │
      │               │ members[]       │       │ estimated_hours │
      │               └────────┬────────┘       │ actual_hours    │
      │                        │                └─────────────────┘
      │               ┌────────▼────────┐
      │               │ project_        │
      │               │ attachments     │
      │               ├─────────────────┤
      │               │ id (PK)         │
      │               │ project_id (FK) │
      │               │ file_name       │
      │               │ file_url        │
      │               │ file_type       │
      │               └─────────────────┘

┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│  team_members   │   │ calendar_events │   │  notifications  │
├─────────────────┤   ├─────────────────┤   ├─────────────────┤
│ id (PK)         │   │ id (PK)         │   │ id (PK)         │
│ name            │   │ title           │   │ user_id (FK)    │
│ email           │   │ date            │   │ title           │
│ role            │   │ time            │   │ message         │
│ avatar          │   │ type            │   │ type            │
│ status          │   └─────────────────┘   │ read            │
└─────────────────┘                         │ related_type    │
                                            │ related_id      │
┌─────────────────┐                         └─────────────────┘
│  meeting_notes  │
├─────────────────┤
│ id (PK)         │
│ project_id (FK) │
│ content         │
│ created_at      │
│ created_by      │
└─────────────────┘
```

---

## Sistema de Permisos

### Roles de Usuario

| Rol | Descripción | Permisos |
|-----|-------------|----------|
| **Admin** | Administrador completo | Todo: CRUD proyectos, tareas, equipo, eventos |
| **Editor** | Colaborador | CRUD proyectos, tareas, eventos. No gestiona equipo |
| **Viewer** | Solo lectura | Solo visualización. No puede crear/editar/eliminar |

### Implementación en Código

```typescript
// En componentes
const { user } = useAuth();
const canEdit = user?.role !== 'Viewer';
const isAdmin = user?.role === 'Admin';

// Condicionales
{canEdit && <button>Edit</button>}
{isAdmin && <button>Delete User</button>}
```

### RLS en Supabase
```sql
-- Ejemplo: Solo el creador puede editar su proyecto
CREATE POLICY "Users can update own projects"
ON projects FOR UPDATE
USING (created_by = auth.uid());
```

---

## Tecnologías y Dependencias

### Producción
| Paquete | Versión | Uso |
|---------|---------|-----|
| react | 18.3.1 | UI Framework |
| react-dom | 18.3.1 | DOM Rendering |
| react-router-dom | 7.11.0 | Routing |
| @supabase/supabase-js | 2.89.0 | Backend SDK |
| lucide-react | 0.263.1 | Iconos |
| recharts | 2.12.7 | Gráficos |
| dompurify | 3.3.1 | Sanitización XSS |
| uuid | - | Generación IDs |

### Desarrollo
| Paquete | Versión | Uso |
|---------|---------|-----|
| vite | 6.2.0 | Build tool |
| typescript | 5.8.2 | Type checking |
| tailwindcss | 3.4.19 | Estilos |
| eslint | 9.39.2 | Linting |
| prettier | 3.7.4 | Formateo |

---

## Configuración de Entorno

### Variables Requeridas (`.env.local`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Variables Opcionales
```env
VITE_GEMINI_API_KEY=...  # Para futuras integraciones AI
```

---

## Scripts NPM

```json
{
  "dev": "vite",                    // Servidor de desarrollo
  "build": "vite build",            // Build producción
  "preview": "vite preview",        // Preview del build
  "lint": "eslint . --ext .ts,.tsx",
  "lint:fix": "eslint . --ext .ts,.tsx --fix",
  "format": "prettier --write **/*.{ts,tsx,js,jsx,json,css,md}",
  "format:check": "prettier --check ...",
  "type-check": "tsc --noEmit"
}
```

---

## Características Principales

### 1. Gestión de Proyectos
- CRUD completo de proyectos
- Estados: Planning, In Progress, Review, Completed
- Barra de progreso
- Adjuntos de archivos (hasta 10MB)
- Notas de reunión por proyecto

### 2. Gestión de Tareas
- Tablero Kanban con drag & drop
- Columnas: Todo, In Progress, Done
- Prioridades: High, Medium, Low
- Asignación a miembros del equipo
- Time tracking (estimado vs actual)
- Indicadores de deadline (overdue, today, soon)

### 3. Calendario
- Vista mensual
- Tipos de evento: Meeting, Deadline, Review
- Navegación por mes
- Creación de eventos al hacer clic en día

### 4. Gestión de Equipo
- Directorio de miembros
- Estados: Online, Offline, Busy
- Búsqueda por nombre/rol
- Solo Admin puede añadir/eliminar

### 5. Notificaciones
- Centro de notificaciones en tiempo real
- Alertas de deadlines (1, 3, 7 días)
- Marcar como leído
- Eliminar notificaciones

### 6. Configuración de Usuario
- Perfil: Nombre, email, avatar, bio, teléfono
- Preferencias: Timezone, idioma
- Apariencia: Tema (light/dark), densidad
- Seguridad: Cambio de contraseña

### 7. PWA
- Service Worker para cache
- Manifest para instalación
- Iconos optimizados

---

## Patrones de Diseño Utilizados

1. **Context Pattern:** Para estado global (Auth, App)
2. **Repository Pattern:** StorageService abstrae la fuente de datos
3. **Fallback Pattern:** localStorage como respaldo de Supabase
4. **Observer Pattern:** Realtime subscriptions
5. **Component Composition:** Modales reutilizables con BaseModal
6. **Custom Hooks:** Lógica reutilizable (useClickOutside, useDebounce)

---

## Archivos de Especificación

| Archivo | Contenido |
|---------|-----------|
| `00-ARQUITECTURA-GLOBAL.spec.md` | Este documento - visión general |
| `01-TYPES-CONSTANTS.spec.md` | Interfaces TypeScript y constantes |
| `02-SERVICES.spec.md` | Servicios de datos (Supabase, Storage, Notifications) |
| `03-CONTEXT.spec.md` | AuthContext y AppContext |
| `04-COMPONENTS.spec.md` | Todos los componentes React |
| `05-HOOKS-UTILS.spec.md` | Hooks personalizados y utilidades |

---

## Próximos Pasos Sugeridos

1. **Mejoras de Seguridad:**
   - Implementar 2FA
   - Rate limiting en el cliente
   - Ampliar uso de sanitización

2. **Mejoras de UX:**
   - Dark mode completo
   - Búsqueda global
   - Filtros avanzados

3. **Nuevas Funcionalidades:**
   - Comentarios en tareas
   - Subtareas
   - Historial de cambios
   - Exportación de datos
   - Integraciones (Slack, Email)

4. **Optimizaciones:**
   - Lazy loading de componentes
   - Virtualización de listas largas
   - Optimistic updates
