# Especificación: Types y Constants

## Archivo: `types.ts`

### Descripción General
Define todas las interfaces TypeScript utilizadas en la aplicación. Proporciona tipado estático para garantizar la integridad de los datos en todo el proyecto.

---

## Interfaces Definidas

### 1. `User`
**Propósito:** Representa un usuario autenticado en el sistema.

```typescript
interface User {
  id: string;              // UUID único del usuario (de Supabase Auth)
  name: string;            // Nombre para mostrar
  email: string;           // Correo electrónico
  avatar?: string;         // URL de la imagen de perfil
  role: 'Admin' | 'Editor' | 'Viewer';  // Rol y permisos
  bio?: string;            // Biografía opcional
  phone?: string;          // Teléfono opcional
  timezone?: string;       // Zona horaria (ej: 'Europe/Madrid')
  language?: string;       // Idioma preferido
  theme?: string;          // Tema de la app ('light' | 'dark')
  notificationsEnabled?: boolean;  // Notificaciones web activas
  emailAlerts?: boolean;   // Alertas por email activas
  viewMode?: string;       // Modo de visualización ('standard' | 'compact')
}
```

**Uso:** AuthContext, SettingsPage, Sidebar

---

### 2. `Project`
**Propósito:** Representa un proyecto en el sistema de gestión.

```typescript
interface Project {
  id: string;              // UUID único del proyecto
  name: string;            // Nombre del proyecto
  client: string;          // Nombre del cliente
  description?: string;    // Descripción detallada
  progress: number;        // Progreso 0-100%
  status: 'In Progress' | 'Review' | 'Planning' | 'Completed';
  statusColor: string;     // Color CSS del estado
  members: string[];       // Array de URLs de avatares de miembros
  extraMembers?: number;   // Miembros adicionales (para +X)
  icon: string;            // Tipo de icono ('web' | 'smartphone' | 'campaign')
  dueDate: string;         // Fecha límite (ISO string)
  createdById?: string;    // ID del creador
  createdByName?: string;  // Nombre del creador
  createdByAvatar?: string; // Avatar del creador
  attachments?: ProjectAttachment[];  // Archivos adjuntos
}
```

**Estados posibles:**
- `Planning`: Proyecto en fase de planificación
- `In Progress`: En desarrollo activo
- `Review`: En revisión/QA
- `Completed`: Finalizado

**Uso:** ProjectsPage, ProjectModal, AppContext, Dashboard

---

### 3. `ProjectAttachment`
**Propósito:** Representa un archivo adjunto a un proyecto.

```typescript
interface ProjectAttachment {
  id: string;              // UUID único
  project_id: string;      // ID del proyecto padre
  file_name: string;       // Nombre original del archivo
  file_url: string;        // URL firmada de descarga
  file_type: string;       // MIME type (ej: 'image/png')
  file_size: number;       // Tamaño en bytes
  created_at: string;      // Fecha de subida (ISO string)
}
```

**Tipos MIME permitidos:**
- Imágenes: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`
- Documentos: `application/pdf`, Word, Excel, PowerPoint
- Texto: `text/plain`, `text/csv`
- Archivos: `application/zip`, RAR

**Límite:** 10MB por archivo

**Uso:** ProjectModal, storage.ts

---

### 4. `Task`
**Propósito:** Representa una tarea dentro del sistema.

```typescript
interface Task {
  id: string;              // UUID único
  title: string;           // Título de la tarea
  project: string;         // Nombre del proyecto asociado
  description?: string;    // Descripción detallada
  dueDate: string;         // Fecha límite (ISO string)
  priority: 'High' | 'Medium' | 'Low';  // Prioridad
  status: 'Todo' | 'In Progress' | 'Done';  // Estado
  assignee?: string;       // URL del avatar del asignado
  estimatedHours?: number; // Horas estimadas
  actualHours?: number;    // Horas reales trabajadas
}
```

**Estados del tablero Kanban:**
- `Todo`: Por hacer
- `In Progress`: En progreso
- `Done`: Completado

**Uso:** TasksPage, TaskDetailModal, AppContext, KPICards

---

### 5. `TeamMember`
**Propósito:** Representa un miembro del equipo.

```typescript
interface TeamMember {
  id: string;              // UUID único
  name: string;            // Nombre completo
  role: string;            // Cargo/rol en el equipo
  avatar: string;          // URL de la imagen de perfil
  status: 'Online' | 'Offline' | 'Busy';  // Estado de disponibilidad
  email: string;           // Correo electrónico
}
```

**Uso:** TeamPage, storage.ts

---

### 6. `CalendarEvent`
**Propósito:** Representa un evento en el calendario.

```typescript
interface CalendarEvent {
  id: string;              // UUID único
  title: string;           // Título del evento
  date: string;            // Fecha (formato YYYY-MM-DD)
  type: 'Meeting' | 'Deadline' | 'Review';  // Tipo de evento
  time: string;            // Hora (formato HH:mm)
}
```

**Tipos de evento:**
- `Meeting`: Reunión (azul)
- `Deadline`: Fecha límite (rojo)
- `Review`: Revisión (amarillo)

**Uso:** CalendarPage, NewEventModal

---

### 7. `MeetingNote`
**Propósito:** Representa una nota de reunión asociada a un proyecto.

```typescript
interface MeetingNote {
  id: string;              // UUID único
  projectId: string;       // ID del proyecto asociado
  content: string;         // Contenido de la nota
  createdAt: string;       // Fecha de creación (ISO string)
  createdBy?: string;      // ID del creador (opcional, gestionado por backend)
}
```

**Uso:** MeetingNotesModal, storage.ts

---

### 8. `Notification`
**Propósito:** Representa una notificación del sistema.

```typescript
interface Notification {
  id: string;              // UUID único
  userId: string;          // ID del usuario destinatario
  title: string;           // Título de la notificación
  message: string;         // Mensaje/descripción
  type: 'info' | 'success' | 'warning' | 'error';  // Tipo visual
  relatedType?: 'project' | 'task' | 'team' | 'system';  // Entidad relacionada
  relatedId?: string;      // ID de la entidad relacionada
  read: boolean;           // Estado de lectura
  createdAt: string;       // Fecha de creación (ISO string)
}
```

**Uso:** NotificationCenter, notifications.ts

---

### 9. `KPI`
**Propósito:** Representa un indicador clave de rendimiento.

```typescript
interface KPI {
  label: string;           // Etiqueta del KPI
  value: string;           // Valor a mostrar
  change: string;          // Texto de cambio/variación
  changePositive: boolean; // Si el cambio es positivo
  icon: string;            // Identificador del icono
}
```

**Uso:** KPICards

---

### 10. `ActivityData`
**Propósito:** Datos para gráficos de actividad.

```typescript
interface ActivityData {
  day: string;             // Etiqueta del día/período
  tasks: number;           // Número de tareas
}
```

**Uso:** ChartsSection

---

### 11. `ConfirmationConfig`
**Propósito:** Configuración para modales de confirmación.

```typescript
interface ConfirmationConfig {
  isOpen: boolean;         // Estado de visibilidad
  title: string;           // Título del diálogo
  message: string;         // Mensaje de confirmación
  onConfirm: () => void;   // Callback al confirmar
}
```

**Uso:** AppContext, ConfirmationModal

---

## Archivo: `constants.ts`

### Descripción General
Contiene constantes de configuración UI y datos estáticos usados en toda la aplicación.

---

## Constantes Definidas

### `LOGO_URL`
```typescript
export const LOGO_URL = "https://lh3.googleusercontent.com/...";
```
**Propósito:** URL del logo principal de la aplicación.
**Uso:** Sidebar

---

### `DEFAULT_AVATAR`
```typescript
export const DEFAULT_AVATAR = "https://ui-avatars.com/api/?background=random";
```
**Propósito:** Avatar por defecto para usuarios nuevos o sin imagen.
**Uso:** AuthContext, AppContext

---

### `AVATARS`
```typescript
export const AVATARS = {
  ana: "https://images.unsplash.com/...",
  bob: "https://images.unsplash.com/...",
  charlie: "https://images.unsplash.com/...",
  david: "https://images.unsplash.com/..."
};
```
**Propósito:** Avatares de ejemplo para datos de demostración.
**Uso:** Modals.tsx (NewMemberModal, ProjectModal)

---

### `MENU_ITEMS`
```typescript
export const MENU_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'projects', icon: Briefcase, label: 'Projects' },
  { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
  { id: 'calendar', icon: CalendarDays, label: 'Calendar' },
  { id: 'team', icon: Users, label: 'Team' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];
```
**Propósito:** Define los elementos del menú de navegación lateral.
**Estructura:**
- `id`: Identificador único (usado para rutas)
- `icon`: Componente de icono de Lucide React
- `label`: Texto a mostrar

**Uso:** Sidebar (navegación)

---

## Dependencias de Iconos

El archivo `constants.ts` importa los siguientes iconos de `lucide-react`:
- `LayoutDashboard`
- `Briefcase`
- `CalendarDays`
- `Users`
- `CheckSquare`
- `Settings`

---

## Notas de Implementación

1. **Tipado Estricto:** Todas las interfaces usan tipos específicos en lugar de `any`.
2. **Opcionalidad:** Los campos opcionales usan `?` para indicar que pueden ser undefined.
3. **Roles:** El sistema implementa 3 niveles de acceso: Admin > Editor > Viewer.
4. **Fechas:** Todas las fechas se manejan como strings ISO para compatibilidad con Supabase.
5. **IDs:** Todos los IDs son UUIDs generados con la librería `uuid`.
