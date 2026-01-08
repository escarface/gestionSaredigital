# Especificación: Components

## Visión General

La aplicación tiene 17 componentes React organizados en:
- **Páginas:** Componentes de nivel de ruta
- **Layout:** Estructura visual
- **Compartidos:** Reutilizables en múltiples lugares
- **Modales:** Diálogos y formularios

---

## Componentes de Layout

### `App.tsx` (Componente Raíz)

**Ubicación:** `/App.tsx`
**Líneas:** ~162

**Responsabilidades:**
- Configuración de rutas con React Router
- Wrapper de proveedores (AuthProvider, AppProvider)
- Layout principal (header, sidebar, contenido)

**Componente Interno: `AppLayout`**

```typescript
const AppLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // ...
}
```

**Estructura:**
```
┌─────────────────────────────────────────────┐
│ Header (h-16)                               │
│ ┌─────┐ ┌───────────────┐ ┌───┐ ┌───┐ ┌───┐│
│ │Menu │ │Title + Role   │ │🔍 │ │🔔 │ │⏻  ││
│ └─────┘ └───────────────┘ └───┘ └───┘ └───┘│
├─────────┬───────────────────────────────────┤
│ Sidebar │ Content Area (Routes)             │
│         │                                   │
│ Logo    │ <Dashboard />                     │
│ Nav     │ <ProjectsPage />                  │
│ User    │ <TasksPage />                     │
│ Button  │ <CalendarPage />                  │
│         │ <TeamPage />                      │
│         │ <SettingsPage />                  │
└─────────┴───────────────────────────────────┘
```

**Rutas definidas:**
| Path | Componente |
|------|------------|
| `/` | `<Dashboard />` |
| `/projects` | `<ProjectsPage />` |
| `/tasks` | `<TasksPage />` |
| `/calendar` | `<CalendarPage />` |
| `/team` | `<TeamPage />` |
| `/settings` | `<SettingsPage />` |
| `*` | `<Navigate to="/" />` |

**Lógica de autenticación:**
```typescript
if (!user) {
  return <AuthPage />;
}
```

---

### `Sidebar.tsx`

**Ubicación:** `/components/Sidebar.tsx`
**Líneas:** ~101

**Props:**
```typescript
interface SidebarProps {
  onClose?: () => void;  // Para cerrar en móvil
}
```

**Estructura:**
- Logo y nombre de la app
- Navegación con `NavLink` (active state automático)
- Mini perfil del usuario
- Botón "New Project" (solo Admin/Editor)

**Dependencias:**
- `MENU_ITEMS`, `LOGO_URL` de constants
- `useApp()` para `openProjectModal`
- `useAuth()` para datos del usuario

**Estilos:**
- Ancho fijo: `w-64`
- Activo: `bg-primary/20`
- Hover: `hover:bg-black/5`

---

## Páginas

### `AuthPage.tsx`

**Ubicación:** `/components/AuthPage.tsx`

**Estados:**
- `isLogin`: Toggle entre Login/Register
- `email`, `password`, `name`: Campos del formulario
- `error`, `loading`: Estados de UI

**Formularios:**
- **Login:** Email + Password
- **Register:** Email + Password + Name

**Validaciones:**
- Password mínimo 6 caracteres (en registro)
- Email requerido
- Muestra errores de Supabase Auth

---

### `Dashboard.tsx`

**Ubicación:** `/components/Dashboard.tsx`
**Líneas:** ~19

**Descripción:** Página de inicio con resumen general.

**Estructura:**
```typescript
<div className="flex flex-col gap-4">
  <KPICards />
  <ChartsSection />
  <ActiveProjects />
  <PendingTasks />
</div>
```

**Subcomponentes:**
- `KPICards`: 4 tarjetas de métricas
- `ChartsSection`: Gráficos de progreso
- `ActiveProjects`: Lista de proyectos activos
- `PendingTasks`: Lista de tareas pendientes

---

### `ProjectsPage.tsx`

**Ubicación:** `/components/ProjectsPage.tsx`
**Líneas:** ~277

**Estados:**
```typescript
const [filter, setFilter] = useState('All');
const [activeMenu, setActiveMenu] = useState<string | null>(null);
const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
const [selectedProjectForNotes, setSelectedProjectForNotes] = useState<Project | null>(null);
```

**Filtros disponibles:**
- All
- In Progress
- Review
- Planning
- Completed

**Funciones de utilidad:**
- `getIcon(type)`: Retorna icono según tipo de proyecto
- `getStatusColor(status)`: Retorna clases CSS según estado
- `formatDate(dateStr)`: Formatea fecha
- `getCreatorInfo(project)`: Obtiene info del creador con fallbacks

**Permisos:**
- `canEdit = user?.role !== 'Viewer'`
- Botones de edición/eliminación solo para Admin/Editor

**Elementos interactivos:**
- Filtros de estado
- Menú contextual por proyecto (Edit/Delete)
- Botón de notas de reunión
- Badge de attachments

---

### `TasksPage.tsx`

**Ubicación:** `/components/TasksPage.tsx`
**Líneas:** ~426

**Estados:**
```typescript
const [isModalOpen, setIsModalOpen] = useState(false);
const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
const [editingTask, setEditingTask] = useState<Task | undefined>();
const [viewingTask, setViewingTask] = useState<Task | null>(null);
const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
const [selectedProject, setSelectedProject] = useState('All');
const [activeMenuTask, setActiveMenuTask] = useState<string | null>(null);
```

**Columnas Kanban:**
- `Todo`
- `In Progress`
- `Done`

**Drag & Drop:**
```typescript
// Handlers
handleDragStart(e, taskId)  // Inicia arrastre
handleDragOver(e, status)   // Sobre columna
handleDrop(e, status)       // Suelta en columna
handleDragEnd()             // Finaliza arrastre
```

**Indicadores de deadline:**
- `overdue`: Pasado (rojo)
- `today`: Hoy (naranja)
- `soon`: En 2 días (amarillo)
- `normal`: Más de 2 días

**Modales:**
- `NewTaskModal`: Crear/Editar tarea
- `TaskDetailModal`: Ver detalles de tarea

---

### `CalendarPage.tsx`

**Ubicación:** `/components/CalendarPage.tsx`
**Líneas:** ~169

**Estados:**
```typescript
const [currentDate, setCurrentDate] = useState(new Date());
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedDate, setSelectedDate] = useState('');
```

**Funciones de calendario:**
- `prevMonth()`: Navegar al mes anterior
- `nextMonth()`: Navegar al mes siguiente
- `goToToday()`: Ir a hoy

**Generación de grid:**
1. Calcula primer día del mes
2. Añade padding de días del mes anterior
3. Añade días del mes actual
4. Añade padding de días del mes siguiente
5. Completa a 35 o 42 celdas

**Colores de eventos:**
| Tipo | Color |
|------|-------|
| Meeting | Azul |
| Deadline | Rojo |
| Review | Amarillo (primary) |

---

### `TeamPage.tsx`

**Ubicación:** `/components/TeamPage.tsx`
**Líneas:** ~148

**Estados:**
```typescript
const [searchTerm, setSearchTerm] = useState('');
const [isModalOpen, setIsModalOpen] = useState(false);
const [activeMenu, setActiveMenu] = useState<string | null>(null);
```

**Permisos:**
- `isAdmin = user?.role === 'Admin'`
- Solo Admin puede añadir/eliminar miembros

**Filtro de búsqueda:**
```typescript
const filteredTeam = team.filter(member =>
  member.name.toLowerCase().includes(searchTerm) ||
  member.role.toLowerCase().includes(searchTerm)
);
```

**Indicadores de estado:**
- Online: Verde
- Busy: Rojo
- Offline: Gris

---

### `SettingsPage.tsx`

**Ubicación:** `/components/SettingsPage.tsx`
**Líneas:** ~428

**Tabs:**
1. **Profile:** Foto, nombre, email, teléfono, timezone, bio
2. **Notifications:** Web notifications, email alerts
3. **Appearance:** Tema, densidad, idioma
4. **Security:** Cambio de contraseña, 2FA (coming soon)

**Estado del formulario:**
```typescript
const [settings, setSettings] = useState({
  name: user?.name || '',
  email: user?.email || '',
  bio: user?.bio || '',
  phone: user?.phone || '',
  timezone: user?.timezone || 'Europe/Madrid',
  language: user?.language || 'Spanish',
  theme: user?.theme || 'light',
  notificationsEnabled: user?.notificationsEnabled ?? true,
  emailAlerts: user?.emailAlerts ?? false,
  viewMode: user?.viewMode || 'standard',
});
```

**Funciones:**
- `handleSave()`: Guarda configuración
- `handleAvatarUpload(file)`: Sube nuevo avatar (max 2MB)

**Componente interno: `PasswordModal`**
- Validación robusta de contraseña:
  - Mínimo 12 caracteres
  - Mayúsculas, minúsculas, números, caracteres especiales
  - Confirmación de contraseña

---

## Componentes del Dashboard

### `KPICards.tsx`

**Ubicación:** `/components/KPICards.tsx`
**Líneas:** ~92

**KPIs calculados:**
| Métrica | Cálculo |
|---------|---------|
| Total Projects | `projects.length` |
| Hours Spent | `sum(tasks.actualHours)` |
| Tasks Completed | `tasks.filter(status === 'Done').length` |
| Critical Tasks | `tasks.filter(status !== 'Done' && priority === 'High').length` |

**Iconos:**
- folder: `FolderOpen`
- clock: `Clock`
- check: `CheckCircle2`
- alert: `AlertTriangle`

---

### `ChartsSection.tsx`

**Ubicación:** `/components/ChartsSection.tsx`
**Líneas:** ~105

**Gráficos:**
1. **Project Progress:** Barras de progreso de los 3 primeros proyectos
2. **Task Distribution:** Gráfico de barras con distribución por estado

**Librería:** Recharts
```typescript
<BarChart data={chartData}>
  <Bar dataKey="tasks" radius={[8, 8, 0, 0]}>
    {chartData.map((entry, index) => (
      <Cell key={`cell-${index}`} fill="#f9f506" />
    ))}
  </Bar>
</BarChart>
```

---

### `ActiveProjects.tsx`

**Ubicación:** `/components/ActiveProjects.tsx`

**Descripción:** Muestra los proyectos activos más recientes.

---

### `PendingTasks.tsx`

**Ubicación:** `/components/PendingTasks.tsx`

**Descripción:** Lista de tareas pendientes con prioridad.

---

## Componentes de UI

### `NotificationCenter.tsx`

**Ubicación:** `/components/NotificationCenter.tsx`
**Líneas:** ~261

**Estados:**
```typescript
const [isOpen, setIsOpen] = useState(false);
const [notifications, setNotifications] = useState<Notification[]>([]);
const [unreadCount, setUnreadCount] = useState(0);
const [loading, setLoading] = useState(false);
```

**Actualización automática:**
- Polling cada 10 segundos
- Escucha evento `notificationCreated`

**Funciones:**
- `loadNotifications()`: Carga todas las notificaciones
- `loadUnreadCount()`: Cuenta no leídas
- `handleMarkAsRead(id)`: Marca una como leída
- `handleMarkAllAsRead()`: Marca todas como leídas
- `handleDelete(id)`: Elimina una notificación
- `handleDeleteAllRead()`: Elimina todas las leídas

**Iconos por tipo:**
- success: `CheckCircle` (verde)
- warning: `AlertCircle` (amarillo)
- error: `AlertCircle` (rojo)
- info: `Info` (azul)

**Formato de fecha:**
- Just now
- Xm ago
- Xh ago
- Xd ago
- Fecha completa (>7 días)

---

### `Toast.tsx`

**Ubicación:** `/components/Toast.tsx`

**Props:**
```typescript
interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}
```

**Comportamiento:**
- Aparece en esquina superior derecha
- Auto-cierre después de 3 segundos
- Animación de entrada/salida

---

### `ErrorBoundary.tsx`

**Ubicación:** `/components/ErrorBoundary.tsx`

**Descripción:** Captura errores de React y muestra fallback.

---

### `MeetingNotesModal.tsx`

**Ubicación:** `/components/MeetingNotesModal.tsx`

**Props:**
```typescript
interface MeetingNotesModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}
```

**Funcionalidades:**
- Lista de notas del proyecto
- Crear nueva nota
- Eliminar nota

---

## Modales (Modals.tsx)

### `BaseModal`

**Descripción:** Componente base para todos los modales.

**Props:**
```typescript
interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

**Estructura:**
- Overlay con backdrop-blur
- Contenedor centrado con max-height 90vh
- Header con título y botón cerrar
- Contenido scrollable

---

### `TaskDetailModal`

**Descripción:** Panel lateral para ver detalles de tarea.

**Secciones:**
- Header con badges (prioridad, estado)
- Grid de atributos (proyecto, fecha, asignado, referencia)
- Time tracking (estimado vs actual)
- Descripción
- Actividad reciente
- Footer con botón editar

**Animación:** Slide desde la derecha

---

### `ConfirmationModal`

**Descripción:** Diálogo de confirmación para acciones destructivas.

**Props:**
```typescript
interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}
```

---

### `ProjectModal`

**Descripción:** Formulario de creación/edición de proyecto.
**Líneas:** ~450 (el más complejo)

**Tabs:**
1. **Basic Info:** Nombre, cliente, fecha, estado, progreso
2. **Description:** Descripción larga
3. **Attachments:** Subida y gestión de archivos

**Estados:**
```typescript
const [activeTab, setActiveTab] = useState<'basic' | 'description' | 'attachments'>('basic');
const [formData, setFormData] = useState({...});
const [attachments, setAttachments] = useState<ProjectAttachment[]>([]);
const [queuedFiles, setQueuedFiles] = useState<File[]>([]);
const [uploadingFile, setUploadingFile] = useState<string | null>(null);
const [dragOver, setDragOver] = useState(false);
```

**Drag & Drop de archivos:**
- Zona de drop con feedback visual
- Validación cliente de tamaño (10MB)
- Archivos encolados para proyectos nuevos
- Subida inmediata para proyectos existentes

---

### `NewTaskModal`

**Descripción:** Formulario de creación/edición de tarea.

**Campos:**
- Title, Description
- Project (select), Priority (select)
- Status (select), Due Date
- Estimated Hours, Actual Hours

---

### `NewEventModal`

**Descripción:** Formulario de creación de evento.

**Campos:**
- Title
- Date, Time
- Type (Meeting/Deadline/Review)

---

### `NewMemberModal`

**Descripción:** Formulario de invitación de miembro.

**Campos:**
- Full Name
- Email Address
- Role

**Nota:** Asigna avatar aleatorio de `AVATARS`.

---

## Resumen de Componentes

| Componente | Tipo | Líneas | Complejidad |
|------------|------|--------|-------------|
| App | Layout | ~162 | Media |
| Sidebar | Layout | ~101 | Baja |
| AuthPage | Página | - | Media |
| Dashboard | Página | ~19 | Baja |
| ProjectsPage | Página | ~277 | Alta |
| TasksPage | Página | ~426 | Alta |
| CalendarPage | Página | ~169 | Media |
| TeamPage | Página | ~148 | Media |
| SettingsPage | Página | ~428 | Alta |
| KPICards | Dashboard | ~92 | Baja |
| ChartsSection | Dashboard | ~105 | Media |
| ActiveProjects | Dashboard | - | Baja |
| PendingTasks | Dashboard | - | Baja |
| NotificationCenter | UI | ~261 | Alta |
| Toast | UI | - | Baja |
| ErrorBoundary | UI | - | Baja |
| MeetingNotesModal | Modal | - | Media |
| Modals (varios) | Modal | ~1100 | Alta |
