# Especificación: Services

## Visión General

La capa de servicios proporciona abstracción sobre las operaciones de datos y comunicación con Supabase. Implementa el patrón de repositorio con fallback a localStorage.

---

## Archivo: `services/supabase.ts`

### Descripción
Configura el cliente de Supabase y proporciona utilidades de conexión.

### Configuración del Cliente

```typescript
export const supabase: SupabaseClient<Database> = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,          // Mantiene sesión entre recargas
      autoRefreshToken: true,        // Renueva tokens automáticamente
      detectSessionInUrl: true,      // Detecta tokens en URL (OAuth)
      storageKey: 'gestion-pro-auth', // Clave de localStorage
    },
    realtime: {
      params: {
        eventsPerSecond: 10,         // Límite de eventos realtime
      },
    },
  }
);
```

### Variables de Entorno Requeridas
```
VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### Funciones Exportadas

#### `handleSupabaseError(error, context?): string`
**Propósito:** Maneja errores de Supabase de forma segura, sin exponer información sensible.

**Parámetros:**
- `error`: Error de PostgrestError o Error genérico
- `context?`: Contexto opcional para logging

**Retorna:** Mensaje de error seguro para el usuario

**Lógica de filtrado:**
- Errores JWT/auth → "Authentication error. Please try logging in again."
- Errores de duplicados → "This record already exists."
- Errores de foreign key → "Invalid reference. Please check your data."
- Otros → "An error occurred. Please try again."

#### `testConnection(): Promise<boolean>`
**Propósito:** Verifica la conexión con Supabase.

**Uso:**
```typescript
const isConnected = await testConnection();
if (!isConnected) {
  // Fallback a modo offline
}
```

---

## Archivo: `services/storage.ts`

### Descripción
Servicio principal de almacenamiento. Implementa CRUD para todas las entidades con fallback a localStorage.

### Clase: `StorageService`

#### Métodos de Mapeo (Privados)

Estos métodos convierten datos de Supabase (snake_case) al formato de la app (camelCase):

```typescript
private mapMeetingNote(dbNote: any): MeetingNote
private mapProject(dbProject: any): Project
private mapTask(dbTask: any): Task
private mapTeamMember(dbMember: any): TeamMember
private mapEvent(dbEvent: any): CalendarEvent
private mapProjectAttachment(dbAttachment: any): ProjectAttachment
```

---

### Métodos de Proyectos

#### `getProjects(): Promise<Project[]>`
**Descripción:** Obtiene todos los proyectos con JOINs optimizados.

**Query SQL equivalente:**
```sql
SELECT
  projects.*,
  profiles.id, profiles.name, profiles.avatar,
  project_attachments.*
FROM projects
LEFT JOIN profiles ON projects.created_by = profiles.id
LEFT JOIN project_attachments ON projects.id = project_attachments.project_id
ORDER BY projects.created_at DESC
```

**Fallback:** `localStorage.getItem('gestion_pro_projects')`

---

#### `saveProject(project: Project): Promise<void>`
**Descripción:** Crea un nuevo proyecto.

**Datos insertados:**
- `id`, `name`, `client`, `description`
- `progress`, `status`, `status_color`
- `members` (array), `extra_members`
- `icon`, `due_date`, `created_by`

**Fallback:** Añade al inicio del array en localStorage

---

#### `updateProject(project: Project): Promise<void>`
**Descripción:** Actualiza un proyecto existente.

**Query:** `UPDATE projects SET ... WHERE id = project.id`

**Fallback:** Map sobre array en localStorage

---

#### `deleteProject(id: string): Promise<void>`
**Descripción:** Elimina un proyecto y sus datos relacionados (cascade).

**Operaciones en orden:**
1. Obtener nombre del proyecto
2. `deleteProjectAttachmentsCascade(id)` - Borra adjuntos y archivos de Storage
3. Borrar tareas asociadas (`WHERE project = project.name`)
4. Borrar el proyecto

**Fallback:** Filtra arrays en localStorage

---

### Métodos de Tareas

#### `getTasks(): Promise<Task[]>`
**Descripción:** Obtiene todas las tareas ordenadas por fecha de creación.

**Query:** `SELECT * FROM tasks ORDER BY created_at DESC`

**Fallback:** `localStorage.getItem('gestion_pro_tasks')`

---

#### `saveTask(task: Task): Promise<void>`
**Descripción:** Crea una nueva tarea.

**Datos insertados:**
- `id`, `title`, `project`, `description`
- `due_date`, `priority`, `status`
- `assignee`, `estimated_hours`, `actual_hours`

---

#### `updateTask(task: Task): Promise<void>`
**Descripción:** Actualiza una tarea existente.

---

#### `deleteTask(id: string): Promise<void>`
**Descripción:** Elimina una tarea por ID.

---

### Métodos de Equipo

#### `getTeam(): Promise<TeamMember[]>`
**Descripción:** Obtiene todos los miembros del equipo.

**Query:** `SELECT * FROM team_members ORDER BY created_at DESC`

---

#### `saveTeamMember(member: TeamMember): Promise<void>`
**Descripción:** Añade un nuevo miembro al equipo.

---

#### `deleteTeamMember(id: string): Promise<void>`
**Descripción:** Elimina un miembro con limpieza de referencias.

**Operaciones:**
1. Obtener datos del miembro (avatar, email)
2. Desasignar tareas (`UPDATE tasks SET assignee = null WHERE assignee = avatar`)
3. Remover de proyectos (actualizar array `members`)
4. Eliminar perfil asociado (`DELETE FROM profiles WHERE email = ...`)
5. Eliminar el team_member

---

### Métodos de Eventos

#### `getEvents(): Promise<CalendarEvent[]>`
**Descripción:** Obtiene eventos ordenados por fecha.

**Query:** `SELECT * FROM calendar_events ORDER BY date ASC`

---

#### `saveEvent(event: CalendarEvent): Promise<void>`
**Descripción:** Crea un nuevo evento de calendario.

---

### Métodos de Meeting Notes

#### `getMeetingNotes(projectId: string): Promise<MeetingNote[]>`
**Descripción:** Obtiene notas de un proyecto específico.

**Query:** `SELECT * FROM meeting_notes WHERE project_id = ? ORDER BY created_at DESC`

---

#### `saveMeetingNote(note: Partial<MeetingNote>): Promise<void>`
**Descripción:** Guarda una nueva nota de reunión.

---

#### `deleteMeetingNote(id: string): Promise<void>`
**Descripción:** Elimina una nota de reunión.

---

### Métodos de Adjuntos

#### `uploadProjectAttachment(projectId: string, file: File): Promise<ProjectAttachment>`
**Descripción:** Sube un archivo al Storage de Supabase y crea el registro.

**Validaciones:**
1. **MIME Type:** Lista blanca de tipos permitidos
2. **Tamaño:** Máximo 10MB

**Proceso:**
1. Validar tipo MIME
2. Validar tamaño
3. Sanitizar nombre de archivo (quitar tildes, espacios)
4. Generar nombre único: `{uuid}-{sanitized_name}`
5. Subir a Storage: `project-attachments/projects/{projectId}/{fileName}`
6. Crear URL firmada (1 año de validez)
7. Insertar registro en `project_attachments`

**Retorna:** El attachment creado

---

#### `deleteProjectAttachment(attachmentId: string): Promise<void>`
**Descripción:** Elimina un adjunto y su archivo de Storage.

**Proceso:**
1. Obtener datos del attachment
2. Extraer filepath de la URL
3. Eliminar de Storage
4. Eliminar registro de BD

---

#### `getProjectAttachments(projectId: string): Promise<ProjectAttachment[]>`
**Descripción:** Obtiene adjuntos de un proyecto específico.

---

#### `deleteProjectAttachmentsCascade(projectId: string): Promise<void>`
**Descripción:** Elimina todos los adjuntos de un proyecto (usado al eliminar proyecto).

**Proceso:**
1. Obtener todos los attachments del proyecto
2. Extraer filepaths de las URLs
3. Eliminar archivos de Storage (batch)
4. Eliminar registros de BD

---

### Exportación

```typescript
export const db = new StorageService();
```

**Uso en la app:**
```typescript
import { db } from '../services/storage';

const projects = await db.getProjects();
await db.saveTask(newTask);
```

---

## Archivo: `services/notifications.ts`

### Descripción
Servicio para gestión de notificaciones del usuario.

### Clase: `NotificationService`

#### Método de Mapeo (Privado)

```typescript
private mapNotification(dbNotification: any): Notification
```

---

### Métodos de Lectura

#### `getNotifications(userId: string): Promise<Notification[]>`
**Descripción:** Obtiene todas las notificaciones del usuario.

**Query:** `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`

---

#### `getUnreadNotifications(userId: string): Promise<Notification[]>`
**Descripción:** Obtiene solo notificaciones no leídas.

**Query:** `SELECT * FROM notifications WHERE user_id = ? AND read = false ORDER BY created_at DESC`

---

#### `getUnreadCount(userId: string): Promise<number>`
**Descripción:** Cuenta notificaciones no leídas (optimizado).

**Query:** `SELECT count(*) FROM notifications WHERE user_id = ? AND read = false`

---

### Métodos de Creación

#### `createNotification(notification): Promise<void>`
**Descripción:** Crea una nueva notificación.

**Parámetros:**
```typescript
{
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  relatedType?: 'project' | 'task' | 'team' | 'system';
  relatedId?: string;
  read: boolean;
}
```

**Post-acción:** Dispara evento `notificationCreated` para actualizar UI.

```typescript
window.dispatchEvent(new Event('notificationCreated'));
```

---

### Métodos de Actualización

#### `markAsRead(notificationId: string): Promise<void>`
**Descripción:** Marca una notificación como leída.

**Query:** `UPDATE notifications SET read = true WHERE id = ?`

---

#### `markAllAsRead(userId: string): Promise<void>`
**Descripción:** Marca todas las notificaciones del usuario como leídas.

**Query:** `UPDATE notifications SET read = true WHERE user_id = ? AND read = false`

---

### Métodos de Eliminación

#### `deleteNotification(notificationId: string): Promise<void>`
**Descripción:** Elimina una notificación específica.

---

#### `deleteAllRead(userId: string): Promise<void>`
**Descripción:** Elimina todas las notificaciones leídas.

**Query:** `DELETE FROM notifications WHERE user_id = ? AND read = true`

---

### Métodos de Conveniencia

#### `notifyProjectUpdate(userId, projectName, projectId, action): Promise<void>`
**Descripción:** Notifica sobre cambios en un proyecto.

**Ejemplo de uso:**
```typescript
await notificationService.notifyProjectUpdate(
  userId,
  'Website Redesign',
  'uuid-...',
  'updated'
);
// Crea: "Project 'Website Redesign' has been updated"
```

---

#### `notifyTaskAssigned(userId, taskTitle, taskId, projectName): Promise<void>`
**Descripción:** Notifica sobre asignación de tarea.

**Mensaje generado:** `"You have been assigned to '{taskTitle}' in {projectName}"`

---

#### `notifyDeadlineApproaching(userId, taskTitle, taskId, daysRemaining): Promise<void>`
**Descripción:** Notifica sobre deadline cercano.

**Mensaje generado:** `"'{taskTitle}' is due in {daysRemaining} day(s)"`

**Tipo:** `warning`

---

### Exportación

```typescript
export const notificationService = new NotificationService();
export default notificationService;
```

---

## Archivo: `services/firebase.ts`

### Estado: DEPRECADO

Este archivo está prácticamente vacío y parece ser un vestigio de una implementación anterior. No se utiliza actualmente en la aplicación.

---

## Patrón de Fallback

Todos los servicios de storage implementan fallback a localStorage:

```typescript
try {
  // Operación con Supabase
  const { data, error } = await supabase.from('table')...
  if (error) throw error;
  return data;
} catch (e) {
  // Fallback a localStorage
  console.warn("Supabase no disponible, usando fallback local...");
  return JSON.parse(localStorage.getItem('key') || '[]');
}
```

**Claves de localStorage:**
- `gestion_pro_projects`
- `gestion_pro_tasks`
- `gestion_pro_team`
- `gestion_pro_events`

---

## Diagrama de Dependencias

```
App
 └─> AppContext
      └─> storage.ts (db)
           └─> supabase.ts (supabase client)
           └─> types.ts
      └─> notifications.ts (notificationService)
           └─> supabase.ts
           └─> types.ts
```
