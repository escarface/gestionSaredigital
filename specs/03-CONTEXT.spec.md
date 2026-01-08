# Especificación: Context (Estado Global)

## Visión General

La aplicación utiliza React Context API para gestionar el estado global. Hay dos contextos principales:
- **AuthContext:** Gestión de autenticación y usuario
- **AppContext:** Gestión de datos de la aplicación y operaciones CRUD

---

## Archivo: `context/AuthContext.tsx`

### Descripción
Gestiona todo lo relacionado con la autenticación de usuarios y su perfil.

### Interface: `AuthContextType`

```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, name: string, role?: 'Admin' | 'Editor' | 'Viewer') => Promise<{ error: string | null }>;
  updateProfile: (updates: Partial<User>) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  uploadAvatar: (file: File) => Promise<{ error: string | null; url?: string }>;
  setUser: (user: User | null) => void;
}
```

---

### Estado Interno

```typescript
const [user, setUser] = useState<User | null>(null);
const [loading, setLoading] = useState(true);
```

---

### Inicialización de Sesión

```typescript
useEffect(() => {
  // 1. Verificar sesión existente
  supabase.auth.getSession().then(({ data: { session } }) => {
    handleSessionChange(session);
    setLoading(false);
  });

  // 2. Escuchar cambios de autenticación
  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    handleSessionChange(session);
  });

  return () => subscription.unsubscribe();
}, []);
```

---

### Función: `handleSessionChange(session)`

**Propósito:** Procesa cambios de sesión y carga datos del usuario.

**Flujo:**
1. Si hay sesión activa:
   - Consulta perfil en tabla `profiles` por `session.user.id`
   - Si existe perfil: Mapea todos los campos (incluyendo settings)
   - Si no existe: Crea usuario básico con datos de la sesión
2. Si no hay sesión:
   - Establece `user` como `null`

**Campos mapeados del perfil:**
- `id`, `name`, `email`, `avatar`, `role`
- `bio`, `phone`, `timezone`, `language`, `theme`
- `notifications_enabled` → `notificationsEnabled`
- `email_alerts` → `emailAlerts`
- `view_mode` → `viewMode`

---

### Métodos Expuestos

#### `signInWithEmail(email, password)`
**Descripción:** Inicia sesión con credenciales.

**Implementación:**
```typescript
const { error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

**Retorna:** `{ error: string | null }`

---

#### `signUpWithEmail(email, password, name, role?)`
**Descripción:** Registra un nuevo usuario.

**Implementación:**
```typescript
const { data, error } = await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      name,
      role,
      avatar: `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(name)}`,
    },
  },
});
```

**Validación de email duplicado:**
```typescript
if (data.user && !data.user.identities?.length) {
  return { error: 'This email is already registered' };
}
```

**Rol por defecto:** `'Viewer'`

---

#### `signOut()`
**Descripción:** Cierra la sesión del usuario.

**Implementación:**
```typescript
await supabase.auth.signOut();
setUser(null);
```

---

#### `updateProfile(updates)`
**Descripción:** Actualiza datos del perfil del usuario.

**Campos actualizables:**
- `name`, `email`, `avatar`, `bio`, `phone`
- `timezone`, `language`, `theme`
- `notificationsEnabled` → `notifications_enabled`
- `emailAlerts` → `email_alerts`
- `viewMode` → `view_mode`

**Implementación:**
```typescript
const { error } = await supabase
  .from('profiles')
  .update(dbUpdates)
  .eq('id', user.id);
```

**Post-acción:** Actualiza estado local con `setUser({ ...user, ...updates })`

---

#### `updatePassword(newPassword)`
**Descripción:** Cambia la contraseña del usuario.

**Implementación:**
```typescript
const { error } = await supabase.auth.updateUser({
  password: newPassword
});
```

---

#### `uploadAvatar(file)`
**Descripción:** Sube una nueva imagen de perfil.

**Proceso:**
1. Genera nombre de archivo: `{userId}/{timestamp}.{extension}`
2. Sube a bucket `avatars` con `upsert: true`
3. Obtiene URL pública
4. Actualiza perfil con la nueva URL

**Retorna:** `{ error: string | null; url?: string }`

---

### Hook de Consumo

```typescript
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
```

**Uso:**
```typescript
const { user, signOut, updateProfile } = useAuth();
```

---

## Archivo: `context/AppContext.tsx`

### Descripción
Gestiona el estado de la aplicación: proyectos, tareas, equipo, eventos, y operaciones CRUD.

### Interface: `AppContextType`

```typescript
interface AppContextType {
  // Datos
  projects: Project[];
  tasks: Task[];
  team: TeamMember[];
  events: CalendarEvent[];
  isLoading: boolean;

  // Operaciones de Proyecto
  addProject: (project: ProjectFormData) => Promise<void>;
  editProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  uploadProjectAttachment: (projectId: string, file: File) => Promise<void>;
  deleteProjectAttachment: (attachmentId: string) => Promise<void>;

  // Operaciones de Tarea
  addTask: (task: Partial<Task>) => Promise<void>;
  editTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (taskId: string, newStatus: Task['status']) => Promise<void>;

  // Operaciones de Equipo
  addTeamMember: (member: Partial<TeamMember>) => Promise<void>;
  removeTeamMember: (id: string) => Promise<void>;

  // Operaciones de Calendario
  addEvent: (event: Partial<CalendarEvent>) => Promise<void>;

  // Notificaciones Toast
  notify: (msg: string, type?: 'success' | 'error') => void;

  // Estado de Modal de Proyecto
  isProjectModalOpen: boolean;
  editingProject: Project | undefined;
  openProjectModal: (project?: Project) => void;
  closeProjectModal: () => void;

  // Estado de Modal de Confirmación
  confirmConfig: ConfirmationConfig;
  askConfirmation: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirmation: () => void;
}
```

---

### Interface Auxiliar

```typescript
interface ProjectFormData extends Partial<Project> {
  __queuedFiles?: File[];  // Archivos a subir después de crear proyecto
}
```

---

### Estado Interno

```typescript
const { user } = useAuth();
const [projects, setProjects] = useState<Project[]>([]);
const [tasks, setTasks] = useState<Task[]>([]);
const [team, setTeam] = useState<TeamMember[]>([]);
const [events, setEvents] = useState<CalendarEvent[]>([]);
const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
const [isLoading, setIsLoading] = useState(true);

// Estado de modales
const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
const [confirmConfig, setConfirmConfig] = useState({
  isOpen: false,
  title: '',
  message: '',
  onConfirm: () => {},
});
```

---

### Función: `loadData()`

**Propósito:** Carga todos los datos de la aplicación desde Supabase.

**Implementación:**
```typescript
const loadData = async () => {
  if (!user) return;
  try {
    setIsLoading(true);
    const [p, t, tm, e] = await Promise.all([
      db.getProjects(),
      db.getTasks(),
      db.getTeam(),
      db.getEvents()
    ]);
    setProjects(p);
    setTasks(t);
    setTeam(tm);
    setEvents(e);

    // Verificar deadlines cercanos
    await checkForDeadlines(t, p);
  } catch (error) {
    notify("Offline Mode: Sync with server failed.", 'error');
  } finally {
    setIsLoading(false);
  }
};
```

---

### Función: `checkForDeadlines(taskList, projectList)`

**Propósito:** Crea notificaciones automáticas para deadlines próximos.

**Días de notificación:** `[1, 3, 7]` días antes del deadline

**Lógica:**
1. Filtra tareas no completadas
2. Calcula días restantes hasta deadline
3. Si días está en `NOTIFY_DAYS`:
   - Verifica que no exista notificación duplicada
   - Crea notificación de tipo `warning`
4. Repite para proyectos no completados

---

### Suscripción Realtime

```typescript
useEffect(() => {
  if (user) {
    loadData();

    const channel = supabase
      .channel('db_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_attachments' }, () => loadData())
      .subscribe();

    return () => supabase.removeChannel(channel);
  } else {
    // Limpiar datos si no hay usuario
    setProjects([]);
    setTasks([]);
    setTeam([]);
    setEvents([]);
    setIsLoading(false);
  }
}, [user]);
```

**Tablas monitoreadas:**
- `projects`
- `tasks`
- `team_members`
- `calendar_events`
- `project_attachments`

---

### Métodos de Proyecto

#### `addProject(projectData)`
**Proceso:**
1. Extrae `__queuedFiles` de los datos
2. Genera UUID para el proyecto
3. Añade `createdById`, `createdByName`, `createdByAvatar` del usuario actual
4. Guarda proyecto en DB
5. Sube archivos encolados (si hay)
6. Recarga datos
7. Muestra toast de éxito

---

#### `editProject(project)`
**Proceso:**
1. Actualiza proyecto en DB
2. Recarga datos
3. Cierra modal
4. Muestra toast

---

#### `deleteProject(id)`
**Proceso:**
1. Elimina proyecto (cascade a attachments y tasks)
2. Recarga datos
3. Muestra toast

---

#### `openProjectModal(project?)`
**Proceso:**
1. Si hay proyecto para editar:
   - Carga attachments del proyecto
   - Establece `editingProject`
2. Abre modal

---

### Métodos de Tarea

#### `addTask(taskData)`
- Genera UUID
- Guarda en DB
- Recarga datos

#### `editTask(task)`
- Actualiza en DB
- Recarga datos

#### `deleteTask(id)`
- Elimina de DB
- Recarga datos

#### `updateTaskStatus(taskId, newStatus)`
**Descripción:** Actualiza solo el status de una tarea (usado en drag & drop).

---

### Métodos de Equipo

#### `addTeamMember(memberData)`
- Genera UUID
- Guarda en DB
- Recarga datos

#### `removeTeamMember(id)`
- Elimina de DB (cascade a tasks y projects)
- Recarga datos

---

### Métodos de Calendario

#### `addEvent(eventData)`
- Genera UUID
- Guarda en DB
- Recarga datos

---

### Métodos de Attachments

#### `uploadProjectAttachment(projectId, file)`
- Valida parámetros
- Llama a `db.uploadProjectAttachment`
- Recarga datos
- Muestra toast

#### `deleteProjectAttachment(attachmentId)`
- Elimina de DB y Storage
- Actualiza estado local (optimistic update)
- Muestra toast

---

### Métodos de Modal de Confirmación

#### `askConfirmation(title, message, onConfirm)`
**Descripción:** Muestra un diálogo de confirmación.

**Uso:**
```typescript
askConfirmation(
  "Delete Project",
  "Are you sure you want to delete this project?",
  () => deleteProject(id)
);
```

#### `closeConfirmation()`
**Descripción:** Cierra el diálogo de confirmación.

---

### Método de Notificación Toast

#### `notify(message, type?)`
**Descripción:** Muestra un toast de notificación.

**Tipos:** `'success'` (default), `'error'`

**Implementación:**
```typescript
const notify = (message: string, type: 'success' | 'error' = 'success') => {
  setToast({ message, type });
};
```

---

### Renderizado

```typescript
return (
  <AppContext.Provider value={value}>
    {children}
    {toast && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast(null)}
      />
    )}
  </AppContext.Provider>
);
```

---

### Hook de Consumo

```typescript
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
```

**Uso:**
```typescript
const {
  projects,
  tasks,
  addProject,
  deleteTask,
  notify
} = useApp();
```

---

## Diagrama de Flujo de Datos

```
                    ┌─────────────────┐
                    │   Supabase      │
                    │   (Backend)     │
                    └────────┬────────┘
                             │
                    ┌────────▼────────┐
                    │    services/    │
                    │  storage.ts     │
                    │  notifications  │
                    └────────┬────────┘
                             │
        ┌────────────────────┴────────────────────┐
        │                                          │
┌───────▼───────┐                        ┌────────▼────────┐
│  AuthContext  │                        │   AppContext    │
│               │                        │                 │
│ - user        │◄───────────────────────│ - projects      │
│ - loading     │                        │ - tasks         │
│ - signIn/Out  │                        │ - team          │
│ - updateProf  │                        │ - events        │
└───────┬───────┘                        │ - CRUD ops      │
        │                                │ - modals        │
        │                                └────────┬────────┘
        │                                         │
        └────────────────────┬────────────────────┘
                             │
                    ┌────────▼────────┐
                    │   Components    │
                    │   (UI Layer)    │
                    └─────────────────┘
```

---

## Orden de Proveedores

```typescript
// App.tsx
<BrowserRouter>
  <AuthProvider>      {/* Primero: Autenticación */}
    <AppProvider>     {/* Segundo: Datos de App */}
      <AppLayout />   {/* Contenido */}
    </AppProvider>
  </AuthProvider>
</BrowserRouter>
```

**Importante:** `AppProvider` depende de `AuthContext` para obtener el usuario actual.
