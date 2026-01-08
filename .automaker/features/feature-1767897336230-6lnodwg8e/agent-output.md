
🔧 Tool: Task
Input: {
  "description": "Analyze complete project structure",
  "prompt": "Analyze the complete project structure thoroughly. I need you to:\n\n1. Find all directories and understand the project layout\n2. Identify the main technologies used (package.json, configuration files)\n3. Find all source code files (TypeScript, JavaScript, etc.)\n4. Understand the architecture and main modules\n5. List all important files and their purposes\n\nStart by exploring the root directory and then dive into subdirectories. Provide a comprehensive overview of:\n- Project type (frontend, backend, fullstack)\n- Main frameworks/libraries used\n- Directory structure\n- Key configuration files\n- Source code organization\n\nBe very thorough - we need a complete picture of the project.",
  "subagent_type": "Explore"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard",
  "description": "List all files and directories in project root"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/package.json"
}

🔧 Tool: Bash
Input: {
  "command": "find /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard -maxdepth 2 -type d | sort",
  "description": "Show first two directory levels"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/vite.config.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/tsconfig.json"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/tailwind.config.js"
}

🔧 Tool: Bash
Input: {
  "command": "find /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/components -maxdepth 1 -type f -o -type d | head -30",
  "description": "List component files and directories"
}

🔧 Tool: Bash
Input: {
  "command": "find /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/services -maxdepth 1 -type f",
  "description": "List service files"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/App.tsx"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/types.ts"
}

🔧 Tool: Bash
Input: {
  "command": "find /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/hooks -type f",
  "description": "List hook files"
}

🔧 Tool: Bash
Input: {
  "command": "find /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/utils -type f",
  "description": "List utility files"
}

🔧 Tool: Bash
Input: {
  "command": "find /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/context -type f",
  "description": "List context files"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/context/AuthContext.tsx"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/services/supabase.ts",
  "limit": 100
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/index.tsx"
}

🔧 Tool: Bash
Input: {
  "command": "find /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/types -type f",
  "description": "List types directory files"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/constants.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/.eslintrc.json"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/README.md"
}

🔧 Tool: Bash
Input: {
  "command": "wc -l /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/components/*.tsx | tail -1",
  "description": "Count total lines in components"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/context/AppContext.tsx",
  "limit": 150
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/types/supabase.ts",
  "limit": 80
}

🔧 Tool: Bash
Input: {
  "command": "find /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard -name \"*.tsx\" -o -name \"*.ts\" | grep -v node_modules | grep -v dist | head -40",
  "description": "List all TypeScript/TSX source files"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/services/storage.ts",
  "limit": 80
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/services/notifications.ts",
  "limit": 60
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/.gitignore"
}

🔧 Tool: Bash
Input: {
  "command": "du -sh /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard 2>/dev/null | head -1",
  "description": "Get total project size"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/vite-env.d.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/hooks/index.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/index.html"
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/.prettierrc.json /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/postcss.config.js",
  "description": "Check additional config files"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/components/Dashboard.tsx",
  "limit": 60
}

🔧 Tool: Bash
Input: {
  "command": "head -50 /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/components/Sidebar.tsx",
  "description": "Show Sidebar component structure"
}

🔧 Tool: Bash
Input: {
  "command": "wc -l /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/services/*.ts /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/context/*.tsx 2>/dev/null",
  "description": "Count lines in key files"
}
Ahora tengo una visión completa del proyecto. Voy a crear los ficheros de especificaciones detallados para documentar todas las funciones y módulos del proyecto.

🔧 Tool: Read
Input: {
  "file_path": "/Users/marc/Documents/code/gestion-pro-dashboard/src/types.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/marc/Documents/code/gestion-pro-dashboard/src/constants.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/marc/Documents/code/gestion-pro-dashboard/src/services/storage.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/marc/Documents/code/gestion-pro-dashboard/src/services/notifications.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/marc/Documents/code/gestion-pro-dashboard/src/context/AuthContext.tsx"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/marc/Documents/code/gestion-pro-dashboard/src/context/AppContext.tsx"
}
Necesito encontrar la ubicación correcta del proyecto. Voy a buscarlo:

🔧 Tool: Bash
Input: {
  "command": "find /Users -name \"gestion-pro-dashboard\" -type d 2>/dev/null | head -5",
  "description": "Find project directory location"
}

🔧 Tool: Bash
Input: {
  "command": "pwd && ls -la",
  "description": "Show current directory and contents"
}
Perfecto, ahora tengo la ubicación correcta. Voy a crear un todo list para organizar el trabajo y luego leer los archivos principales:

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Leer todos los archivos principales del proyecto",
      "status": "in_progress",
      "activeForm": "Leyendo archivos principales del proyecto"
    },
    {
      "content": "Crear spec de Types y Constants",
      "status": "pending",
      "activeForm": "Creando spec de Types y Constants"
    },
    {
      "content": "Crear spec de Services (storage, notifications, supabase)",
      "status": "pending",
      "activeForm": "Creando spec de Services"
    },
    {
      "content": "Crear spec de Context (AuthContext, AppContext)",
      "status": "pending",
      "activeForm": "Creando spec de Context"
    },
    {
      "content": "Crear spec de Components",
      "status": "pending",
      "activeForm": "Creando spec de Components"
    },
    {
      "content": "Crear spec de Hooks y Utils",
      "status": "pending",
      "activeForm": "Creando spec de Hooks y Utils"
    },
    {
      "content": "Crear archivo maestro de arquitectura global",
      "status": "pending",
      "activeForm": "Creando archivo maestro de arquitectura"
    }
  ]
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/types.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/constants.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/services/storage.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/services/notifications.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/services/supabase.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/context/AuthContext.tsx"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/context/AppContext.tsx"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/App.tsx"
}
Ahora voy a leer los componentes y el resto de archivos para tener una visión completa:

🔧 Tool: Glob
Input: {
  "pattern": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/components/*.tsx"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/hooks/index.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/hooks/useClickOutside.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/hooks/useDebounce.ts"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/utils/sanitize.ts"
}
Ahora leo algunos componentes clave para entender su funcionalidad:

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/components/Dashboard.tsx"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/components/ProjectsPage.tsx"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/components/TasksPage.tsx"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/components/CalendarPage.tsx"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/components/TeamPage.tsx"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/components/SettingsPage.tsx"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/components/Modals.tsx"
}
Ahora voy a leer los últimos componentes restantes y luego empezaré a crear los ficheros de especificaciones:

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/components/Sidebar.tsx"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/components/NotificationCenter.tsx"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/components/KPICards.tsx"
}

🔧 Tool: Read
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/components/ChartsSection.tsx"
}
Ahora tengo toda la información necesaria. Voy a actualizar el todo y crear los ficheros de especificaciones:

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Leer todos los archivos principales del proyecto",
      "status": "completed",
      "activeForm": "Leyendo archivos principales del proyecto"
    },
    {
      "content": "Crear spec de Types y Constants",
      "status": "in_progress",
      "activeForm": "Creando spec de Types y Constants"
    },
    {
      "content": "Crear spec de Services (storage, notifications, supabase)",
      "status": "pending",
      "activeForm": "Creando spec de Services"
    },
    {
      "content": "Crear spec de Context (AuthContext, AppContext)",
      "status": "pending",
      "activeForm": "Creando spec de Context"
    },
    {
      "content": "Crear spec de Components",
      "status": "pending",
      "activeForm": "Creando spec de Components"
    },
    {
      "content": "Crear spec de Hooks y Utils",
      "status": "pending",
      "activeForm": "Creando spec de Hooks y Utils"
    },
    {
      "content": "Crear archivo maestro de arquitectura global",
      "status": "pending",
      "activeForm": "Creando archivo maestro de arquitectura"
    }
  ]
}

🔧 Tool: Bash
Input: {
  "command": "mkdir -p /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/specs",
  "description": "Create specs directory"
}

🔧 Tool: Write
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/specs/01-TYPES-CONSTANTS.spec.md",
  "content": "# Especificación: Types y Constants\n\n## Archivo: `types.ts`\n\n### Descripción General\nDefine todas las interfaces TypeScript utilizadas en la aplicación. Proporciona tipado estático para garantizar la integridad de los datos en todo el proyecto.\n\n---\n\n## Interfaces Definidas\n\n### 1. `User`\n**Propósito:** Representa un usuario autenticado en el sistema.\n\n```typescript\ninterface User {\n  id: string;              // UUID único del usuario (de Supabase Auth)\n  name: string;            // Nombre para mostrar\n  email: string;           // Correo electrónico\n  avatar?: string;         // URL de la imagen de perfil\n  role: 'Admin' | 'Editor' | 'Viewer';  // Rol y permisos\n  bio?: string;            // Biografía opcional\n  phone?: string;          // Teléfono opcional\n  timezone?: string;       // Zona horaria (ej: 'Europe/Madrid')\n  language?: string;       // Idioma preferido\n  theme?: string;          // Tema de la app ('light' | 'dark')\n  notificationsEnabled?: boolean;  // Notificaciones web activas\n  emailAlerts?: boolean;   // Alertas por email activas\n  viewMode?: string;       // Modo de visualización ('standard' | 'compact')\n}\n```\n\n**Uso:** AuthContext, SettingsPage, Sidebar\n\n---\n\n### 2. `Project`\n**Propósito:** Representa un proyecto en el sistema de gestión.\n\n```typescript\ninterface Project {\n  id: string;              // UUID único del proyecto\n  name: string;            // Nombre del proyecto\n  client: string;          // Nombre del cliente\n  description?: string;    // Descripción detallada\n  progress: number;        // Progreso 0-100%\n  status: 'In Progress' | 'Review' | 'Planning' | 'Completed';\n  statusColor: string;     // Color CSS del estado\n  members: string[];       // Array de URLs de avatares de miembros\n  extraMembers?: number;   // Miembros adicionales (para +X)\n  icon: string;            // Tipo de icono ('web' | 'smartphone' | 'campaign')\n  dueDate: string;         // Fecha límite (ISO string)\n  createdById?: string;    // ID del creador\n  createdByName?: string;  // Nombre del creador\n  createdByAvatar?: string; // Avatar del creador\n  attachments?: ProjectAttachment[];  // Archivos adjuntos\n}\n```\n\n**Estados posibles:**\n- `Planning`: Proyecto en fase de planificación\n- `In Progress`: En desarrollo activo\n- `Review`: En revisión/QA\n- `Completed`: Finalizado\n\n**Uso:** ProjectsPage, ProjectModal, AppContext, Dashboard\n\n---\n\n### 3. `ProjectAttachment`\n**Propósito:** Representa un archivo adjunto a un proyecto.\n\n```typescript\ninterface ProjectAttachment {\n  id: string;              // UUID único\n  project_id: string;      // ID del proyecto padre\n  file_name: string;       // Nombre original del archivo\n  file_url: string;        // URL firmada de descarga\n  file_type: string;       // MIME type (ej: 'image/png')\n  file_size: number;       // Tamaño en bytes\n  created_at: string;      // Fecha de subida (ISO string)\n}\n```\n\n**Tipos MIME permitidos:**\n- Imágenes: `image/jpeg`, `image/png`, `image/gif`, `image/webp`, `image/svg+xml`\n- Documentos: `application/pdf`, Word, Excel, PowerPoint\n- Texto: `text/plain`, `text/csv`\n- Archivos: `application/zip`, RAR\n\n**Límite:** 10MB por archivo\n\n**Uso:** ProjectModal, storage.ts\n\n---\n\n### 4. `Task`\n**Propósito:** Representa una tarea dentro del sistema.\n\n```typescript\ninterface Task {\n  id: string;              // UUID único\n  title: string;           // Título de la tarea\n  project: string;         // Nombre del proyecto asociado\n  description?: string;    // Descripción detallada\n  dueDate: string;         // Fecha límite (ISO string)\n  priority: 'High' | 'Medium' | 'Low';  // Prioridad\n  status: 'Todo' | 'In Progress' | 'Done';  // Estado\n  assignee?: string;       // URL del avatar del asignado\n  estimatedHours?: number; // Horas estimadas\n  actualHours?: number;    // Horas reales trabajadas\n}\n```\n\n**Estados del tablero Kanban:**\n- `Todo`: Por hacer\n- `In Progress`: En progreso\n- `Done`: Completado\n\n**Uso:** TasksPage, TaskDetailModal, AppContext, KPICards\n\n---\n\n### 5. `TeamMember`\n**Propósito:** Representa un miembro del equipo.\n\n```typescript\ninterface TeamMember {\n  id: string;              // UUID único\n  name: string;            // Nombre completo\n  role: string;            // Cargo/rol en el equipo\n  avatar: string;          // URL de la imagen de perfil\n  status: 'Online' | 'Offline' | 'Busy';  // Estado de disponibilidad\n  email: string;           // Correo electrónico\n}\n```\n\n**Uso:** TeamPage, storage.ts\n\n---\n\n### 6. `CalendarEvent`\n**Propósito:** Representa un evento en el calendario.\n\n```typescript\ninterface CalendarEvent {\n  id: string;              // UUID único\n  title: string;           // Título del evento\n  date: string;            // Fecha (formato YYYY-MM-DD)\n  type: 'Meeting' | 'Deadline' | 'Review';  // Tipo de evento\n  time: string;            // Hora (formato HH:mm)\n}\n```\n\n**Tipos de evento:**\n- `Meeting`: Reunión (azul)\n- `Deadline`: Fecha límite (rojo)\n- `Review`: Revisión (amarillo)\n\n**Uso:** CalendarPage, NewEventModal\n\n---\n\n### 7. `MeetingNote`\n**Propósito:** Representa una nota de reunión asociada a un proyecto.\n\n```typescript\ninterface MeetingNote {\n  id: string;              // UUID único\n  projectId: string;       // ID del proyecto asociado\n  content: string;         // Contenido de la nota\n  createdAt: string;       // Fecha de creación (ISO string)\n  createdBy?: string;      // ID del creador (opcional, gestionado por backend)\n}\n```\n\n**Uso:** MeetingNotesModal, storage.ts\n\n---\n\n### 8. `Notification`\n**Propósito:** Representa una notificación del sistema.\n\n```typescript\ninterface Notification {\n  id: string;              // UUID único\n  userId: string;          // ID del usuario destinatario\n  title: string;           // Título de la notificación\n  message: string;         // Mensaje/descripción\n  type: 'info' | 'success' | 'warning' | 'error';  // Tipo visual\n  relatedType?: 'project' | 'task' | 'team' | 'system';  // Entidad relacionada\n  relatedId?: string;      // ID de la entidad relacionada\n  read: boolean;           // Estado de lectura\n  createdAt: string;       // Fecha de creación (ISO string)\n}\n```\n\n**Uso:** NotificationCenter, notifications.ts\n\n---\n\n### 9. `KPI`\n**Propósito:** Representa un indicador clave de rendimiento.\n\n```typescript\ninterface KPI {\n  label: string;           // Etiqueta del KPI\n  value: string;           // Valor a mostrar\n  change: string;          // Texto de cambio/variación\n  changePositive: boolean; // Si el cambio es positivo\n  icon: string;            // Identificador del icono\n}\n```\n\n**Uso:** KPICards\n\n---\n\n### 10. `ActivityData`\n**Propósito:** Datos para gráficos de actividad.\n\n```typescript\ninterface ActivityData {\n  day: string;             // Etiqueta del día/período\n  tasks: number;           // Número de tareas\n}\n```\n\n**Uso:** ChartsSection\n\n---\n\n### 11. `ConfirmationConfig`\n**Propósito:** Configuración para modales de confirmación.\n\n```typescript\ninterface ConfirmationConfig {\n  isOpen: boolean;         // Estado de visibilidad\n  title: string;           // Título del diálogo\n  message: string;         // Mensaje de confirmación\n  onConfirm: () => void;   // Callback al confirmar\n}\n```\n\n**Uso:** AppContext, ConfirmationModal\n\n---\n\n## Archivo: `constants.ts`\n\n### Descripción General\nContiene constantes de configuración UI y datos estáticos usados en toda la aplicación.\n\n---\n\n## Constantes Definidas\n\n### `LOGO_URL`\n```typescript\nexport const LOGO_URL = \"https://lh3.googleusercontent.com/...\";\n```\n**Propósito:** URL del logo principal de la aplicación.\n**Uso:** Sidebar\n\n---\n\n### `DEFAULT_AVATAR`\n```typescript\nexport const DEFAULT_AVATAR = \"https://ui-avatars.com/api/?background=random\";\n```\n**Propósito:** Avatar por defecto para usuarios nuevos o sin imagen.\n**Uso:** AuthContext, AppContext\n\n---\n\n### `AVATARS`\n```typescript\nexport const AVATARS = {\n  ana: \"https://images.unsplash.com/...\",\n  bob: \"https://images.unsplash.com/...\",\n  charlie: \"https://images.unsplash.com/...\",\n  david: \"https://images.unsplash.com/...\"\n};\n```\n**Propósito:** Avatares de ejemplo para datos de demostración.\n**Uso:** Modals.tsx (NewMemberModal, ProjectModal)\n\n---\n\n### `MENU_ITEMS`\n```typescript\nexport const MENU_ITEMS = [\n  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },\n  { id: 'projects', icon: Briefcase, label: 'Projects' },\n  { id: 'tasks', icon: CheckSquare, label: 'Tasks' },\n  { id: 'calendar', icon: CalendarDays, label: 'Calendar' },\n  { id: 'team', icon: Users, label: 'Team' },\n  { id: 'settings', icon: Settings, label: 'Settings' },\n];\n```\n**Propósito:** Define los elementos del menú de navegación lateral.\n**Estructura:**\n- `id`: Identificador único (usado para rutas)\n- `icon`: Componente de icono de Lucide React\n- `label`: Texto a mostrar\n\n**Uso:** Sidebar (navegación)\n\n---\n\n## Dependencias de Iconos\n\nEl archivo `constants.ts` importa los siguientes iconos de `lucide-react`:\n- `LayoutDashboard`\n- `Briefcase`\n- `CalendarDays`\n- `Users`\n- `CheckSquare`\n- `Settings`\n\n---\n\n## Notas de Implementación\n\n1. **Tipado Estricto:** Todas las interfaces usan tipos específicos en lugar de `any`.\n2. **Opcionalidad:** Los campos opcionales usan `?` para indicar que pueden ser undefined.\n3. **Roles:** El sistema implementa 3 niveles de acceso: Admin > Editor > Viewer.\n4. **Fechas:** Todas las fechas se manejan como strings ISO para compatibilidad con Supabase.\n5. **IDs:** Todos los IDs son UUIDs generados con la librería `uuid`.\n"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Leer todos los archivos principales del proyecto",
      "status": "completed",
      "activeForm": "Leyendo archivos principales del proyecto"
    },
    {
      "content": "Crear spec de Types y Constants",
      "status": "completed",
      "activeForm": "Creando spec de Types y Constants"
    },
    {
      "content": "Crear spec de Services (storage, notifications, supabase)",
      "status": "in_progress",
      "activeForm": "Creando spec de Services"
    },
    {
      "content": "Crear spec de Context (AuthContext, AppContext)",
      "status": "pending",
      "activeForm": "Creando spec de Context"
    },
    {
      "content": "Crear spec de Components",
      "status": "pending",
      "activeForm": "Creando spec de Components"
    },
    {
      "content": "Crear spec de Hooks y Utils",
      "status": "pending",
      "activeForm": "Creando spec de Hooks y Utils"
    },
    {
      "content": "Crear archivo maestro de arquitectura global",
      "status": "pending",
      "activeForm": "Creando archivo maestro de arquitectura"
    }
  ]
}

🔧 Tool: Write
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/specs/02-SERVICES.spec.md",
  "content": "# Especificación: Services\n\n## Visión General\n\nLa capa de servicios proporciona abstracción sobre las operaciones de datos y comunicación con Supabase. Implementa el patrón de repositorio con fallback a localStorage.\n\n---\n\n## Archivo: `services/supabase.ts`\n\n### Descripción\nConfigura el cliente de Supabase y proporciona utilidades de conexión.\n\n### Configuración del Cliente\n\n```typescript\nexport const supabase: SupabaseClient<Database> = createClient(\n  supabaseUrl,\n  supabaseAnonKey,\n  {\n    auth: {\n      persistSession: true,          // Mantiene sesión entre recargas\n      autoRefreshToken: true,        // Renueva tokens automáticamente\n      detectSessionInUrl: true,      // Detecta tokens en URL (OAuth)\n      storageKey: 'gestion-pro-auth', // Clave de localStorage\n    },\n    realtime: {\n      params: {\n        eventsPerSecond: 10,         // Límite de eventos realtime\n      },\n    },\n  }\n);\n```\n\n### Variables de Entorno Requeridas\n```\nVITE_SUPABASE_URL=https://xxx.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJ...\n```\n\n### Funciones Exportadas\n\n#### `handleSupabaseError(error, context?): string`\n**Propósito:** Maneja errores de Supabase de forma segura, sin exponer información sensible.\n\n**Parámetros:**\n- `error`: Error de PostgrestError o Error genérico\n- `context?`: Contexto opcional para logging\n\n**Retorna:** Mensaje de error seguro para el usuario\n\n**Lógica de filtrado:**\n- Errores JWT/auth → \"Authentication error. Please try logging in again.\"\n- Errores de duplicados → \"This record already exists.\"\n- Errores de foreign key → \"Invalid reference. Please check your data.\"\n- Otros → \"An error occurred. Please try again.\"\n\n#### `testConnection(): Promise<boolean>`\n**Propósito:** Verifica la conexión con Supabase.\n\n**Uso:**\n```typescript\nconst isConnected = await testConnection();\nif (!isConnected) {\n  // Fallback a modo offline\n}\n```\n\n---\n\n## Archivo: `services/storage.ts`\n\n### Descripción\nServicio principal de almacenamiento. Implementa CRUD para todas las entidades con fallback a localStorage.\n\n### Clase: `StorageService`\n\n#### Métodos de Mapeo (Privados)\n\nEstos métodos convierten datos de Supabase (snake_case) al formato de la app (camelCase):\n\n```typescript\nprivate mapMeetingNote(dbNote: any): MeetingNote\nprivate mapProject(dbProject: any): Project\nprivate mapTask(dbTask: any): Task\nprivate mapTeamMember(dbMember: any): TeamMember\nprivate mapEvent(dbEvent: any): CalendarEvent\nprivate mapProjectAttachment(dbAttachment: any): ProjectAttachment\n```\n\n---\n\n### Métodos de Proyectos\n\n#### `getProjects(): Promise<Project[]>`\n**Descripción:** Obtiene todos los proyectos con JOINs optimizados.\n\n**Query SQL equivalente:**\n```sql\nSELECT\n  projects.*,\n  profiles.id, profiles.name, profiles.avatar,\n  project_attachments.*\nFROM projects\nLEFT JOIN profiles ON projects.created_by = profiles.id\nLEFT JOIN project_attachments ON projects.id = project_attachments.project_id\nORDER BY projects.created_at DESC\n```\n\n**Fallback:** `localStorage.getItem('gestion_pro_projects')`\n\n---\n\n#### `saveProject(project: Project): Promise<void>`\n**Descripción:** Crea un nuevo proyecto.\n\n**Datos insertados:**\n- `id`, `name`, `client`, `description`\n- `progress`, `status`, `status_color`\n- `members` (array), `extra_members`\n- `icon`, `due_date`, `created_by`\n\n**Fallback:** Añade al inicio del array en localStorage\n\n---\n\n#### `updateProject(project: Project): Promise<void>`\n**Descripción:** Actualiza un proyecto existente.\n\n**Query:** `UPDATE projects SET ... WHERE id = project.id`\n\n**Fallback:** Map sobre array en localStorage\n\n---\n\n#### `deleteProject(id: string): Promise<void>`\n**Descripción:** Elimina un proyecto y sus datos relacionados (cascade).\n\n**Operaciones en orden:**\n1. Obtener nombre del proyecto\n2. `deleteProjectAttachmentsCascade(id)` - Borra adjuntos y archivos de Storage\n3. Borrar tareas asociadas (`WHERE project = project.name`)\n4. Borrar el proyecto\n\n**Fallback:** Filtra arrays en localStorage\n\n---\n\n### Métodos de Tareas\n\n#### `getTasks(): Promise<Task[]>`\n**Descripción:** Obtiene todas las tareas ordenadas por fecha de creación.\n\n**Query:** `SELECT * FROM tasks ORDER BY created_at DESC`\n\n**Fallback:** `localStorage.getItem('gestion_pro_tasks')`\n\n---\n\n#### `saveTask(task: Task): Promise<void>`\n**Descripción:** Crea una nueva tarea.\n\n**Datos insertados:**\n- `id`, `title`, `project`, `description`\n- `due_date`, `priority`, `status`\n- `assignee`, `estimated_hours`, `actual_hours`\n\n---\n\n#### `updateTask(task: Task): Promise<void>`\n**Descripción:** Actualiza una tarea existente.\n\n---\n\n#### `deleteTask(id: string): Promise<void>`\n**Descripción:** Elimina una tarea por ID.\n\n---\n\n### Métodos de Equipo\n\n#### `getTeam(): Promise<TeamMember[]>`\n**Descripción:** Obtiene todos los miembros del equipo.\n\n**Query:** `SELECT * FROM team_members ORDER BY created_at DESC`\n\n---\n\n#### `saveTeamMember(member: TeamMember): Promise<void>`\n**Descripción:** Añade un nuevo miembro al equipo.\n\n---\n\n#### `deleteTeamMember(id: string): Promise<void>`\n**Descripción:** Elimina un miembro con limpieza de referencias.\n\n**Operaciones:**\n1. Obtener datos del miembro (avatar, email)\n2. Desasignar tareas (`UPDATE tasks SET assignee = null WHERE assignee = avatar`)\n3. Remover de proyectos (actualizar array `members`)\n4. Eliminar perfil asociado (`DELETE FROM profiles WHERE email = ...`)\n5. Eliminar el team_member\n\n---\n\n### Métodos de Eventos\n\n#### `getEvents(): Promise<CalendarEvent[]>`\n**Descripción:** Obtiene eventos ordenados por fecha.\n\n**Query:** `SELECT * FROM calendar_events ORDER BY date ASC`\n\n---\n\n#### `saveEvent(event: CalendarEvent): Promise<void>`\n**Descripción:** Crea un nuevo evento de calendario.\n\n---\n\n### Métodos de Meeting Notes\n\n#### `getMeetingNotes(projectId: string): Promise<MeetingNote[]>`\n**Descripción:** Obtiene notas de un proyecto específico.\n\n**Query:** `SELECT * FROM meeting_notes WHERE project_id = ? ORDER BY created_at DESC`\n\n---\n\n#### `saveMeetingNote(note: Partial<MeetingNote>): Promise<void>`\n**Descripción:** Guarda una nueva nota de reunión.\n\n---\n\n#### `deleteMeetingNote(id: string): Promise<void>`\n**Descripción:** Elimina una nota de reunión.\n\n---\n\n### Métodos de Adjuntos\n\n#### `uploadProjectAttachment(projectId: string, file: File): Promise<ProjectAttachment>`\n**Descripción:** Sube un archivo al Storage de Supabase y crea el registro.\n\n**Validaciones:**\n1. **MIME Type:** Lista blanca de tipos permitidos\n2. **Tamaño:** Máximo 10MB\n\n**Proceso:**\n1. Validar tipo MIME\n2. Validar tamaño\n3. Sanitizar nombre de archivo (quitar tildes, espacios)\n4. Generar nombre único: `{uuid}-{sanitized_name}`\n5. Subir a Storage: `project-attachments/projects/{projectId}/{fileName}`\n6. Crear URL firmada (1 año de validez)\n7. Insertar registro en `project_attachments`\n\n**Retorna:** El attachment creado\n\n---\n\n#### `deleteProjectAttachment(attachmentId: string): Promise<void>`\n**Descripción:** Elimina un adjunto y su archivo de Storage.\n\n**Proceso:**\n1. Obtener datos del attachment\n2. Extraer filepath de la URL\n3. Eliminar de Storage\n4. Eliminar registro de BD\n\n---\n\n#### `getProjectAttachments(projectId: string): Promise<ProjectAttachment[]>`\n**Descripción:** Obtiene adjuntos de un proyecto específico.\n\n---\n\n#### `deleteProjectAttachmentsCascade(projectId: string): Promise<void>`\n**Descripción:** Elimina todos los adjuntos de un proyecto (usado al eliminar proyecto).\n\n**Proceso:**\n1. Obtener todos los attachments del proyecto\n2. Extraer filepaths de las URLs\n3. Eliminar archivos de Storage (batch)\n4. Eliminar registros de BD\n\n---\n\n### Exportación\n\n```typescript\nexport const db = new StorageService();\n```\n\n**Uso en la app:**\n```typescript\nimport { db } from '../services/storage';\n\nconst projects = await db.getProjects();\nawait db.saveTask(newTask);\n```\n\n---\n\n## Archivo: `services/notifications.ts`\n\n### Descripción\nServicio para gestión de notificaciones del usuario.\n\n### Clase: `NotificationService`\n\n#### Método de Mapeo (Privado)\n\n```typescript\nprivate mapNotification(dbNotification: any): Notification\n```\n\n---\n\n### Métodos de Lectura\n\n#### `getNotifications(userId: string): Promise<Notification[]>`\n**Descripción:** Obtiene todas las notificaciones del usuario.\n\n**Query:** `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC`\n\n---\n\n#### `getUnreadNotifications(userId: string): Promise<Notification[]>`\n**Descripción:** Obtiene solo notificaciones no leídas.\n\n**Query:** `SELECT * FROM notifications WHERE user_id = ? AND read = false ORDER BY created_at DESC`\n\n---\n\n#### `getUnreadCount(userId: string): Promise<number>`\n**Descripción:** Cuenta notificaciones no leídas (optimizado).\n\n**Query:** `SELECT count(*) FROM notifications WHERE user_id = ? AND read = false`\n\n---\n\n### Métodos de Creación\n\n#### `createNotification(notification): Promise<void>`\n**Descripción:** Crea una nueva notificación.\n\n**Parámetros:**\n```typescript\n{\n  userId: string;\n  title: string;\n  message: string;\n  type: 'info' | 'success' | 'warning' | 'error';\n  relatedType?: 'project' | 'task' | 'team' | 'system';\n  relatedId?: string;\n  read: boolean;\n}\n```\n\n**Post-acción:** Dispara evento `notificationCreated` para actualizar UI.\n\n```typescript\nwindow.dispatchEvent(new Event('notificationCreated'));\n```\n\n---\n\n### Métodos de Actualización\n\n#### `markAsRead(notificationId: string): Promise<void>`\n**Descripción:** Marca una notificación como leída.\n\n**Query:** `UPDATE notifications SET read = true WHERE id = ?`\n\n---\n\n#### `markAllAsRead(userId: string): Promise<void>`\n**Descripción:** Marca todas las notificaciones del usuario como leídas.\n\n**Query:** `UPDATE notifications SET read = true WHERE user_id = ? AND read = false`\n\n---\n\n### Métodos de Eliminación\n\n#### `deleteNotification(notificationId: string): Promise<void>`\n**Descripción:** Elimina una notificación específica.\n\n---\n\n#### `deleteAllRead(userId: string): Promise<void>`\n**Descripción:** Elimina todas las notificaciones leídas.\n\n**Query:** `DELETE FROM notifications WHERE user_id = ? AND read = true`\n\n---\n\n### Métodos de Conveniencia\n\n#### `notifyProjectUpdate(userId, projectName, projectId, action): Promise<void>`\n**Descripción:** Notifica sobre cambios en un proyecto.\n\n**Ejemplo de uso:**\n```typescript\nawait notificationService.notifyProjectUpdate(\n  userId,\n  'Website Redesign',\n  'uuid-...',\n  'updated'\n);\n// Crea: \"Project 'Website Redesign' has been updated\"\n```\n\n---\n\n#### `notifyTaskAssigned(userId, taskTitle, taskId, projectName): Promise<void>`\n**Descripción:** Notifica sobre asignación de tarea.\n\n**Mensaje generado:** `\"You have been assigned to '{taskTitle}' in {projectName}\"`\n\n---\n\n#### `notifyDeadlineApproaching(userId, taskTitle, taskId, daysRemaining): Promise<void>`\n**Descripción:** Notifica sobre deadline cercano.\n\n**Mensaje generado:** `\"'{taskTitle}' is due in {daysRemaining} day(s)\"`\n\n**Tipo:** `warning`\n\n---\n\n### Exportación\n\n```typescript\nexport const notificationService = new NotificationService();\nexport default notificationService;\n```\n\n---\n\n## Archivo: `services/firebase.ts`\n\n### Estado: DEPRECADO\n\nEste archivo está prácticamente vacío y parece ser un vestigio de una implementación anterior. No se utiliza actualmente en la aplicación.\n\n---\n\n## Patrón de Fallback\n\nTodos los servicios de storage implementan fallback a localStorage:\n\n```typescript\ntry {\n  // Operación con Supabase\n  const { data, error } = await supabase.from('table')...\n  if (error) throw error;\n  return data;\n} catch (e) {\n  // Fallback a localStorage\n  console.warn(\"Supabase no disponible, usando fallback local...\");\n  return JSON.parse(localStorage.getItem('key') || '[]');\n}\n```\n\n**Claves de localStorage:**\n- `gestion_pro_projects`\n- `gestion_pro_tasks`\n- `gestion_pro_team`\n- `gestion_pro_events`\n\n---\n\n## Diagrama de Dependencias\n\n```\nApp\n └─> AppContext\n      └─> storage.ts (db)\n           └─> supabase.ts (supabase client)\n           └─> types.ts\n      └─> notifications.ts (notificationService)\n           └─> supabase.ts\n           └─> types.ts\n```\n"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Leer todos los archivos principales del proyecto",
      "status": "completed",
      "activeForm": "Leyendo archivos principales del proyecto"
    },
    {
      "content": "Crear spec de Types y Constants",
      "status": "completed",
      "activeForm": "Creando spec de Types y Constants"
    },
    {
      "content": "Crear spec de Services (storage, notifications, supabase)",
      "status": "completed",
      "activeForm": "Creando spec de Services"
    },
    {
      "content": "Crear spec de Context (AuthContext, AppContext)",
      "status": "in_progress",
      "activeForm": "Creando spec de Context"
    },
    {
      "content": "Crear spec de Components",
      "status": "pending",
      "activeForm": "Creando spec de Components"
    },
    {
      "content": "Crear spec de Hooks y Utils",
      "status": "pending",
      "activeForm": "Creando spec de Hooks y Utils"
    },
    {
      "content": "Crear archivo maestro de arquitectura global",
      "status": "pending",
      "activeForm": "Creando archivo maestro de arquitectura"
    }
  ]
}

🔧 Tool: Write
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/specs/03-CONTEXT.spec.md",
  "content": "# Especificación: Context (Estado Global)\n\n## Visión General\n\nLa aplicación utiliza React Context API para gestionar el estado global. Hay dos contextos principales:\n- **AuthContext:** Gestión de autenticación y usuario\n- **AppContext:** Gestión de datos de la aplicación y operaciones CRUD\n\n---\n\n## Archivo: `context/AuthContext.tsx`\n\n### Descripción\nGestiona todo lo relacionado con la autenticación de usuarios y su perfil.\n\n### Interface: `AuthContextType`\n\n```typescript\ninterface AuthContextType {\n  user: User | null;\n  loading: boolean;\n  signOut: () => Promise<void>;\n  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;\n  signUpWithEmail: (email: string, password: string, name: string, role?: 'Admin' | 'Editor' | 'Viewer') => Promise<{ error: string | null }>;\n  updateProfile: (updates: Partial<User>) => Promise<{ error: string | null }>;\n  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;\n  uploadAvatar: (file: File) => Promise<{ error: string | null; url?: string }>;\n  setUser: (user: User | null) => void;\n}\n```\n\n---\n\n### Estado Interno\n\n```typescript\nconst [user, setUser] = useState<User | null>(null);\nconst [loading, setLoading] = useState(true);\n```\n\n---\n\n### Inicialización de Sesión\n\n```typescript\nuseEffect(() => {\n  // 1. Verificar sesión existente\n  supabase.auth.getSession().then(({ data: { session } }) => {\n    handleSessionChange(session);\n    setLoading(false);\n  });\n\n  // 2. Escuchar cambios de autenticación\n  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {\n    handleSessionChange(session);\n  });\n\n  return () => subscription.unsubscribe();\n}, []);\n```\n\n---\n\n### Función: `handleSessionChange(session)`\n\n**Propósito:** Procesa cambios de sesión y carga datos del usuario.\n\n**Flujo:**\n1. Si hay sesión activa:\n   - Consulta perfil en tabla `profiles` por `session.user.id`\n   - Si existe perfil: Mapea todos los campos (incluyendo settings)\n   - Si no existe: Crea usuario básico con datos de la sesión\n2. Si no hay sesión:\n   - Establece `user` como `null`\n\n**Campos mapeados del perfil:**\n- `id`, `name`, `email`, `avatar`, `role`\n- `bio`, `phone`, `timezone`, `language`, `theme`\n- `notifications_enabled` → `notificationsEnabled`\n- `email_alerts` → `emailAlerts`\n- `view_mode` → `viewMode`\n\n---\n\n### Métodos Expuestos\n\n#### `signInWithEmail(email, password)`\n**Descripción:** Inicia sesión con credenciales.\n\n**Implementación:**\n```typescript\nconst { error } = await supabase.auth.signInWithPassword({\n  email,\n  password,\n});\n```\n\n**Retorna:** `{ error: string | null }`\n\n---\n\n#### `signUpWithEmail(email, password, name, role?)`\n**Descripción:** Registra un nuevo usuario.\n\n**Implementación:**\n```typescript\nconst { data, error } = await supabase.auth.signUp({\n  email,\n  password,\n  options: {\n    data: {\n      name,\n      role,\n      avatar: `https://ui-avatars.com/api/?background=random&name=${encodeURIComponent(name)}`,\n    },\n  },\n});\n```\n\n**Validación de email duplicado:**\n```typescript\nif (data.user && !data.user.identities?.length) {\n  return { error: 'This email is already registered' };\n}\n```\n\n**Rol por defecto:** `'Viewer'`\n\n---\n\n#### `signOut()`\n**Descripción:** Cierra la sesión del usuario.\n\n**Implementación:**\n```typescript\nawait supabase.auth.signOut();\nsetUser(null);\n```\n\n---\n\n#### `updateProfile(updates)`\n**Descripción:** Actualiza datos del perfil del usuario.\n\n**Campos actualizables:**\n- `name`, `email`, `avatar`, `bio`, `phone`\n- `timezone`, `language`, `theme`\n- `notificationsEnabled` → `notifications_enabled`\n- `emailAlerts` → `email_alerts`\n- `viewMode` → `view_mode`\n\n**Implementación:**\n```typescript\nconst { error } = await supabase\n  .from('profiles')\n  .update(dbUpdates)\n  .eq('id', user.id);\n```\n\n**Post-acción:** Actualiza estado local con `setUser({ ...user, ...updates })`\n\n---\n\n#### `updatePassword(newPassword)`\n**Descripción:** Cambia la contraseña del usuario.\n\n**Implementación:**\n```typescript\nconst { error } = await supabase.auth.updateUser({\n  password: newPassword\n});\n```\n\n---\n\n#### `uploadAvatar(file)`\n**Descripción:** Sube una nueva imagen de perfil.\n\n**Proceso:**\n1. Genera nombre de archivo: `{userId}/{timestamp}.{extension}`\n2. Sube a bucket `avatars` con `upsert: true`\n3. Obtiene URL pública\n4. Actualiza perfil con la nueva URL\n\n**Retorna:** `{ error: string | null; url?: string }`\n\n---\n\n### Hook de Consumo\n\n```typescript\nexport const useAuth = () => {\n  const context = useContext(AuthContext);\n  if (!context) throw new Error('useAuth must be used within AuthProvider');\n  return context;\n};\n```\n\n**Uso:**\n```typescript\nconst { user, signOut, updateProfile } = useAuth();\n```\n\n---\n\n## Archivo: `context/AppContext.tsx`\n\n### Descripción\nGestiona el estado de la aplicación: proyectos, tareas, equipo, eventos, y operaciones CRUD.\n\n### Interface: `AppContextType`\n\n```typescript\ninterface AppContextType {\n  // Datos\n  projects: Project[];\n  tasks: Task[];\n  team: TeamMember[];\n  events: CalendarEvent[];\n  isLoading: boolean;\n\n  // Operaciones de Proyecto\n  addProject: (project: ProjectFormData) => Promise<void>;\n  editProject: (project: Project) => Promise<void>;\n  deleteProject: (id: string) => Promise<void>;\n  uploadProjectAttachment: (projectId: string, file: File) => Promise<void>;\n  deleteProjectAttachment: (attachmentId: string) => Promise<void>;\n\n  // Operaciones de Tarea\n  addTask: (task: Partial<Task>) => Promise<void>;\n  editTask: (task: Task) => Promise<void>;\n  deleteTask: (id: string) => Promise<void>;\n  updateTaskStatus: (taskId: string, newStatus: Task['status']) => Promise<void>;\n\n  // Operaciones de Equipo\n  addTeamMember: (member: Partial<TeamMember>) => Promise<void>;\n  removeTeamMember: (id: string) => Promise<void>;\n\n  // Operaciones de Calendario\n  addEvent: (event: Partial<CalendarEvent>) => Promise<void>;\n\n  // Notificaciones Toast\n  notify: (msg: string, type?: 'success' | 'error') => void;\n\n  // Estado de Modal de Proyecto\n  isProjectModalOpen: boolean;\n  editingProject: Project | undefined;\n  openProjectModal: (project?: Project) => void;\n  closeProjectModal: () => void;\n\n  // Estado de Modal de Confirmación\n  confirmConfig: ConfirmationConfig;\n  askConfirmation: (title: string, message: string, onConfirm: () => void) => void;\n  closeConfirmation: () => void;\n}\n```\n\n---\n\n### Interface Auxiliar\n\n```typescript\ninterface ProjectFormData extends Partial<Project> {\n  __queuedFiles?: File[];  // Archivos a subir después de crear proyecto\n}\n```\n\n---\n\n### Estado Interno\n\n```typescript\nconst { user } = useAuth();\nconst [projects, setProjects] = useState<Project[]>([]);\nconst [tasks, setTasks] = useState<Task[]>([]);\nconst [team, setTeam] = useState<TeamMember[]>([]);\nconst [events, setEvents] = useState<CalendarEvent[]>([]);\nconst [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);\nconst [isLoading, setIsLoading] = useState(true);\n\n// Estado de modales\nconst [isProjectModalOpen, setIsProjectModalOpen] = useState(false);\nconst [editingProject, setEditingProject] = useState<Project | undefined>(undefined);\nconst [confirmConfig, setConfirmConfig] = useState({\n  isOpen: false,\n  title: '',\n  message: '',\n  onConfirm: () => {},\n});\n```\n\n---\n\n### Función: `loadData()`\n\n**Propósito:** Carga todos los datos de la aplicación desde Supabase.\n\n**Implementación:**\n```typescript\nconst loadData = async () => {\n  if (!user) return;\n  try {\n    setIsLoading(true);\n    const [p, t, tm, e] = await Promise.all([\n      db.getProjects(),\n      db.getTasks(),\n      db.getTeam(),\n      db.getEvents()\n    ]);\n    setProjects(p);\n    setTasks(t);\n    setTeam(tm);\n    setEvents(e);\n\n    // Verificar deadlines cercanos\n    await checkForDeadlines(t, p);\n  } catch (error) {\n    notify(\"Offline Mode: Sync with server failed.\", 'error');\n  } finally {\n    setIsLoading(false);\n  }\n};\n```\n\n---\n\n### Función: `checkForDeadlines(taskList, projectList)`\n\n**Propósito:** Crea notificaciones automáticas para deadlines próximos.\n\n**Días de notificación:** `[1, 3, 7]` días antes del deadline\n\n**Lógica:**\n1. Filtra tareas no completadas\n2. Calcula días restantes hasta deadline\n3. Si días está en `NOTIFY_DAYS`:\n   - Verifica que no exista notificación duplicada\n   - Crea notificación de tipo `warning`\n4. Repite para proyectos no completados\n\n---\n\n### Suscripción Realtime\n\n```typescript\nuseEffect(() => {\n  if (user) {\n    loadData();\n\n    const channel = supabase\n      .channel('db_changes')\n      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => loadData())\n      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => loadData())\n      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => loadData())\n      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events' }, () => loadData())\n      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_attachments' }, () => loadData())\n      .subscribe();\n\n    return () => supabase.removeChannel(channel);\n  } else {\n    // Limpiar datos si no hay usuario\n    setProjects([]);\n    setTasks([]);\n    setTeam([]);\n    setEvents([]);\n    setIsLoading(false);\n  }\n}, [user]);\n```\n\n**Tablas monitoreadas:**\n- `projects`\n- `tasks`\n- `team_members`\n- `calendar_events`\n- `project_attachments`\n\n---\n\n### Métodos de Proyecto\n\n#### `addProject(projectData)`\n**Proceso:**\n1. Extrae `__queuedFiles` de los datos\n2. Genera UUID para el proyecto\n3. Añade `createdById`, `createdByName`, `createdByAvatar` del usuario actual\n4. Guarda proyecto en DB\n5. Sube archivos encolados (si hay)\n6. Recarga datos\n7. Muestra toast de éxito\n\n---\n\n#### `editProject(project)`\n**Proceso:**\n1. Actualiza proyecto en DB\n2. Recarga datos\n3. Cierra modal\n4. Muestra toast\n\n---\n\n#### `deleteProject(id)`\n**Proceso:**\n1. Elimina proyecto (cascade a attachments y tasks)\n2. Recarga datos\n3. Muestra toast\n\n---\n\n#### `openProjectModal(project?)`\n**Proceso:**\n1. Si hay proyecto para editar:\n   - Carga attachments del proyecto\n   - Establece `editingProject`\n2. Abre modal\n\n---\n\n### Métodos de Tarea\n\n#### `addTask(taskData)`\n- Genera UUID\n- Guarda en DB\n- Recarga datos\n\n#### `editTask(task)`\n- Actualiza en DB\n- Recarga datos\n\n#### `deleteTask(id)`\n- Elimina de DB\n- Recarga datos\n\n#### `updateTaskStatus(taskId, newStatus)`\n**Descripción:** Actualiza solo el status de una tarea (usado en drag & drop).\n\n---\n\n### Métodos de Equipo\n\n#### `addTeamMember(memberData)`\n- Genera UUID\n- Guarda en DB\n- Recarga datos\n\n#### `removeTeamMember(id)`\n- Elimina de DB (cascade a tasks y projects)\n- Recarga datos\n\n---\n\n### Métodos de Calendario\n\n#### `addEvent(eventData)`\n- Genera UUID\n- Guarda en DB\n- Recarga datos\n\n---\n\n### Métodos de Attachments\n\n#### `uploadProjectAttachment(projectId, file)`\n- Valida parámetros\n- Llama a `db.uploadProjectAttachment`\n- Recarga datos\n- Muestra toast\n\n#### `deleteProjectAttachment(attachmentId)`\n- Elimina de DB y Storage\n- Actualiza estado local (optimistic update)\n- Muestra toast\n\n---\n\n### Métodos de Modal de Confirmación\n\n#### `askConfirmation(title, message, onConfirm)`\n**Descripción:** Muestra un diálogo de confirmación.\n\n**Uso:**\n```typescript\naskConfirmation(\n  \"Delete Project\",\n  \"Are you sure you want to delete this project?\",\n  () => deleteProject(id)\n);\n```\n\n#### `closeConfirmation()`\n**Descripción:** Cierra el diálogo de confirmación.\n\n---\n\n### Método de Notificación Toast\n\n#### `notify(message, type?)`\n**Descripción:** Muestra un toast de notificación.\n\n**Tipos:** `'success'` (default), `'error'`\n\n**Implementación:**\n```typescript\nconst notify = (message: string, type: 'success' | 'error' = 'success') => {\n  setToast({ message, type });\n};\n```\n\n---\n\n### Renderizado\n\n```typescript\nreturn (\n  <AppContext.Provider value={value}>\n    {children}\n    {toast && (\n      <Toast\n        message={toast.message}\n        type={toast.type}\n        onClose={() => setToast(null)}\n      />\n    )}\n  </AppContext.Provider>\n);\n```\n\n---\n\n### Hook de Consumo\n\n```typescript\nexport const useApp = () => {\n  const context = useContext(AppContext);\n  if (!context) throw new Error('useApp must be used within AppProvider');\n  return context;\n};\n```\n\n**Uso:**\n```typescript\nconst {\n  projects,\n  tasks,\n  addProject,\n  deleteTask,\n  notify\n} = useApp();\n```\n\n---\n\n## Diagrama de Flujo de Datos\n\n```\n                    ┌─────────────────┐\n                    │   Supabase      │\n                    │   (Backend)     │\n                    └────────┬────────┘\n                             │\n                    ┌────────▼────────┐\n                    │    services/    │\n                    │  storage.ts     │\n                    │  notifications  │\n                    └────────┬────────┘\n                             │\n        ┌────────────────────┴────────────────────┐\n        │                                          │\n┌───────▼───────┐                        ┌────────▼────────┐\n│  AuthContext  │                        │   AppContext    │\n│               │                        │                 │\n│ - user        │◄───────────────────────│ - projects      │\n│ - loading     │                        │ - tasks         │\n│ - signIn/Out  │                        │ - team          │\n│ - updateProf  │                        │ - events        │\n└───────┬───────┘                        │ - CRUD ops      │\n        │                                │ - modals        │\n        │                                └────────┬────────┘\n        │                                         │\n        └────────────────────┬────────────────────┘\n                             │\n                    ┌────────▼────────┐\n                    │   Components    │\n                    │   (UI Layer)    │\n                    └─────────────────┘\n```\n\n---\n\n## Orden de Proveedores\n\n```typescript\n// App.tsx\n<BrowserRouter>\n  <AuthProvider>      {/* Primero: Autenticación */}\n    <AppProvider>     {/* Segundo: Datos de App */}\n      <AppLayout />   {/* Contenido */}\n    </AppProvider>\n  </AuthProvider>\n</BrowserRouter>\n```\n\n**Importante:** `AppProvider` depende de `AuthContext` para obtener el usuario actual.\n"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Leer todos los archivos principales del proyecto",
      "status": "completed",
      "activeForm": "Leyendo archivos principales del proyecto"
    },
    {
      "content": "Crear spec de Types y Constants",
      "status": "completed",
      "activeForm": "Creando spec de Types y Constants"
    },
    {
      "content": "Crear spec de Services (storage, notifications, supabase)",
      "status": "completed",
      "activeForm": "Creando spec de Services"
    },
    {
      "content": "Crear spec de Context (AuthContext, AppContext)",
      "status": "completed",
      "activeForm": "Creando spec de Context"
    },
    {
      "content": "Crear spec de Components",
      "status": "in_progress",
      "activeForm": "Creando spec de Components"
    },
    {
      "content": "Crear spec de Hooks y Utils",
      "status": "pending",
      "activeForm": "Creando spec de Hooks y Utils"
    },
    {
      "content": "Crear archivo maestro de arquitectura global",
      "status": "pending",
      "activeForm": "Creando archivo maestro de arquitectura"
    }
  ]
}

🔧 Tool: Write
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/specs/04-COMPONENTS.spec.md",
  "content": "# Especificación: Components\n\n## Visión General\n\nLa aplicación tiene 17 componentes React organizados en:\n- **Páginas:** Componentes de nivel de ruta\n- **Layout:** Estructura visual\n- **Compartidos:** Reutilizables en múltiples lugares\n- **Modales:** Diálogos y formularios\n\n---\n\n## Componentes de Layout\n\n### `App.tsx` (Componente Raíz)\n\n**Ubicación:** `/App.tsx`\n**Líneas:** ~162\n\n**Responsabilidades:**\n- Configuración de rutas con React Router\n- Wrapper de proveedores (AuthProvider, AppProvider)\n- Layout principal (header, sidebar, contenido)\n\n**Componente Interno: `AppLayout`**\n\n```typescript\nconst AppLayout: React.FC = () => {\n  const { user, signOut } = useAuth();\n  const [sidebarOpen, setSidebarOpen] = useState(false);\n  // ...\n}\n```\n\n**Estructura:**\n```\n┌─────────────────────────────────────────────┐\n│ Header (h-16)                               │\n│ ┌─────┐ ┌───────────────┐ ┌───┐ ┌───┐ ┌───┐│\n│ │Menu │ │Title + Role   │ │🔍 │ │🔔 │ │⏻  ││\n│ └─────┘ └───────────────┘ └───┘ └───┘ └───┘│\n├─────────┬───────────────────────────────────┤\n│ Sidebar │ Content Area (Routes)             │\n│         │                                   │\n│ Logo    │ <Dashboard />                     │\n│ Nav     │ <ProjectsPage />                  │\n│ User    │ <TasksPage />                     │\n│ Button  │ <CalendarPage />                  │\n│         │ <TeamPage />                      │\n│         │ <SettingsPage />                  │\n└─────────┴───────────────────────────────────┘\n```\n\n**Rutas definidas:**\n| Path | Componente |\n|------|------------|\n| `/` | `<Dashboard />` |\n| `/projects` | `<ProjectsPage />` |\n| `/tasks` | `<TasksPage />` |\n| `/calendar` | `<CalendarPage />` |\n| `/team` | `<TeamPage />` |\n| `/settings` | `<SettingsPage />` |\n| `*` | `<Navigate to=\"/\" />` |\n\n**Lógica de autenticación:**\n```typescript\nif (!user) {\n  return <AuthPage />;\n}\n```\n\n---\n\n### `Sidebar.tsx`\n\n**Ubicación:** `/components/Sidebar.tsx`\n**Líneas:** ~101\n\n**Props:**\n```typescript\ninterface SidebarProps {\n  onClose?: () => void;  // Para cerrar en móvil\n}\n```\n\n**Estructura:**\n- Logo y nombre de la app\n- Navegación con `NavLink` (active state automático)\n- Mini perfil del usuario\n- Botón \"New Project\" (solo Admin/Editor)\n\n**Dependencias:**\n- `MENU_ITEMS`, `LOGO_URL` de constants\n- `useApp()` para `openProjectModal`\n- `useAuth()` para datos del usuario\n\n**Estilos:**\n- Ancho fijo: `w-64`\n- Activo: `bg-primary/20`\n- Hover: `hover:bg-black/5`\n\n---\n\n## Páginas\n\n### `AuthPage.tsx`\n\n**Ubicación:** `/components/AuthPage.tsx`\n\n**Estados:**\n- `isLogin`: Toggle entre Login/Register\n- `email`, `password`, `name`: Campos del formulario\n- `error`, `loading`: Estados de UI\n\n**Formularios:**\n- **Login:** Email + Password\n- **Register:** Email + Password + Name\n\n**Validaciones:**\n- Password mínimo 6 caracteres (en registro)\n- Email requerido\n- Muestra errores de Supabase Auth\n\n---\n\n### `Dashboard.tsx`\n\n**Ubicación:** `/components/Dashboard.tsx`\n**Líneas:** ~19\n\n**Descripción:** Página de inicio con resumen general.\n\n**Estructura:**\n```typescript\n<div className=\"flex flex-col gap-4\">\n  <KPICards />\n  <ChartsSection />\n  <ActiveProjects />\n  <PendingTasks />\n</div>\n```\n\n**Subcomponentes:**\n- `KPICards`: 4 tarjetas de métricas\n- `ChartsSection`: Gráficos de progreso\n- `ActiveProjects`: Lista de proyectos activos\n- `PendingTasks`: Lista de tareas pendientes\n\n---\n\n### `ProjectsPage.tsx`\n\n**Ubicación:** `/components/ProjectsPage.tsx`\n**Líneas:** ~277\n\n**Estados:**\n```typescript\nconst [filter, setFilter] = useState('All');\nconst [activeMenu, setActiveMenu] = useState<string | null>(null);\nconst [isNotesModalOpen, setIsNotesModalOpen] = useState(false);\nconst [selectedProjectForNotes, setSelectedProjectForNotes] = useState<Project | null>(null);\n```\n\n**Filtros disponibles:**\n- All\n- In Progress\n- Review\n- Planning\n- Completed\n\n**Funciones de utilidad:**\n- `getIcon(type)`: Retorna icono según tipo de proyecto\n- `getStatusColor(status)`: Retorna clases CSS según estado\n- `formatDate(dateStr)`: Formatea fecha\n- `getCreatorInfo(project)`: Obtiene info del creador con fallbacks\n\n**Permisos:**\n- `canEdit = user?.role !== 'Viewer'`\n- Botones de edición/eliminación solo para Admin/Editor\n\n**Elementos interactivos:**\n- Filtros de estado\n- Menú contextual por proyecto (Edit/Delete)\n- Botón de notas de reunión\n- Badge de attachments\n\n---\n\n### `TasksPage.tsx`\n\n**Ubicación:** `/components/TasksPage.tsx`\n**Líneas:** ~426\n\n**Estados:**\n```typescript\nconst [isModalOpen, setIsModalOpen] = useState(false);\nconst [isDetailModalOpen, setIsDetailModalOpen] = useState(false);\nconst [editingTask, setEditingTask] = useState<Task | undefined>();\nconst [viewingTask, setViewingTask] = useState<Task | null>(null);\nconst [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);\nconst [dragOverColumn, setDragOverColumn] = useState<string | null>(null);\nconst [selectedProject, setSelectedProject] = useState('All');\nconst [activeMenuTask, setActiveMenuTask] = useState<string | null>(null);\n```\n\n**Columnas Kanban:**\n- `Todo`\n- `In Progress`\n- `Done`\n\n**Drag & Drop:**\n```typescript\n// Handlers\nhandleDragStart(e, taskId)  // Inicia arrastre\nhandleDragOver(e, status)   // Sobre columna\nhandleDrop(e, status)       // Suelta en columna\nhandleDragEnd()             // Finaliza arrastre\n```\n\n**Indicadores de deadline:**\n- `overdue`: Pasado (rojo)\n- `today`: Hoy (naranja)\n- `soon`: En 2 días (amarillo)\n- `normal`: Más de 2 días\n\n**Modales:**\n- `NewTaskModal`: Crear/Editar tarea\n- `TaskDetailModal`: Ver detalles de tarea\n\n---\n\n### `CalendarPage.tsx`\n\n**Ubicación:** `/components/CalendarPage.tsx`\n**Líneas:** ~169\n\n**Estados:**\n```typescript\nconst [currentDate, setCurrentDate] = useState(new Date());\nconst [isModalOpen, setIsModalOpen] = useState(false);\nconst [selectedDate, setSelectedDate] = useState('');\n```\n\n**Funciones de calendario:**\n- `prevMonth()`: Navegar al mes anterior\n- `nextMonth()`: Navegar al mes siguiente\n- `goToToday()`: Ir a hoy\n\n**Generación de grid:**\n1. Calcula primer día del mes\n2. Añade padding de días del mes anterior\n3. Añade días del mes actual\n4. Añade padding de días del mes siguiente\n5. Completa a 35 o 42 celdas\n\n**Colores de eventos:**\n| Tipo | Color |\n|------|-------|\n| Meeting | Azul |\n| Deadline | Rojo |\n| Review | Amarillo (primary) |\n\n---\n\n### `TeamPage.tsx`\n\n**Ubicación:** `/components/TeamPage.tsx`\n**Líneas:** ~148\n\n**Estados:**\n```typescript\nconst [searchTerm, setSearchTerm] = useState('');\nconst [isModalOpen, setIsModalOpen] = useState(false);\nconst [activeMenu, setActiveMenu] = useState<string | null>(null);\n```\n\n**Permisos:**\n- `isAdmin = user?.role === 'Admin'`\n- Solo Admin puede añadir/eliminar miembros\n\n**Filtro de búsqueda:**\n```typescript\nconst filteredTeam = team.filter(member =>\n  member.name.toLowerCase().includes(searchTerm) ||\n  member.role.toLowerCase().includes(searchTerm)\n);\n```\n\n**Indicadores de estado:**\n- Online: Verde\n- Busy: Rojo\n- Offline: Gris\n\n---\n\n### `SettingsPage.tsx`\n\n**Ubicación:** `/components/SettingsPage.tsx`\n**Líneas:** ~428\n\n**Tabs:**\n1. **Profile:** Foto, nombre, email, teléfono, timezone, bio\n2. **Notifications:** Web notifications, email alerts\n3. **Appearance:** Tema, densidad, idioma\n4. **Security:** Cambio de contraseña, 2FA (coming soon)\n\n**Estado del formulario:**\n```typescript\nconst [settings, setSettings] = useState({\n  name: user?.name || '',\n  email: user?.email || '',\n  bio: user?.bio || '',\n  phone: user?.phone || '',\n  timezone: user?.timezone || 'Europe/Madrid',\n  language: user?.language || 'Spanish',\n  theme: user?.theme || 'light',\n  notificationsEnabled: user?.notificationsEnabled ?? true,\n  emailAlerts: user?.emailAlerts ?? false,\n  viewMode: user?.viewMode || 'standard',\n});\n```\n\n**Funciones:**\n- `handleSave()`: Guarda configuración\n- `handleAvatarUpload(file)`: Sube nuevo avatar (max 2MB)\n\n**Componente interno: `PasswordModal`**\n- Validación robusta de contraseña:\n  - Mínimo 12 caracteres\n  - Mayúsculas, minúsculas, números, caracteres especiales\n  - Confirmación de contraseña\n\n---\n\n## Componentes del Dashboard\n\n### `KPICards.tsx`\n\n**Ubicación:** `/components/KPICards.tsx`\n**Líneas:** ~92\n\n**KPIs calculados:**\n| Métrica | Cálculo |\n|---------|---------|\n| Total Projects | `projects.length` |\n| Hours Spent | `sum(tasks.actualHours)` |\n| Tasks Completed | `tasks.filter(status === 'Done').length` |\n| Critical Tasks | `tasks.filter(status !== 'Done' && priority === 'High').length` |\n\n**Iconos:**\n- folder: `FolderOpen`\n- clock: `Clock`\n- check: `CheckCircle2`\n- alert: `AlertTriangle`\n\n---\n\n### `ChartsSection.tsx`\n\n**Ubicación:** `/components/ChartsSection.tsx`\n**Líneas:** ~105\n\n**Gráficos:**\n1. **Project Progress:** Barras de progreso de los 3 primeros proyectos\n2. **Task Distribution:** Gráfico de barras con distribución por estado\n\n**Librería:** Recharts\n```typescript\n<BarChart data={chartData}>\n  <Bar dataKey=\"tasks\" radius={[8, 8, 0, 0]}>\n    {chartData.map((entry, index) => (\n      <Cell key={`cell-${index}`} fill=\"#f9f506\" />\n    ))}\n  </Bar>\n</BarChart>\n```\n\n---\n\n### `ActiveProjects.tsx`\n\n**Ubicación:** `/components/ActiveProjects.tsx`\n\n**Descripción:** Muestra los proyectos activos más recientes.\n\n---\n\n### `PendingTasks.tsx`\n\n**Ubicación:** `/components/PendingTasks.tsx`\n\n**Descripción:** Lista de tareas pendientes con prioridad.\n\n---\n\n## Componentes de UI\n\n### `NotificationCenter.tsx`\n\n**Ubicación:** `/components/NotificationCenter.tsx`\n**Líneas:** ~261\n\n**Estados:**\n```typescript\nconst [isOpen, setIsOpen] = useState(false);\nconst [notifications, setNotifications] = useState<Notification[]>([]);\nconst [unreadCount, setUnreadCount] = useState(0);\nconst [loading, setLoading] = useState(false);\n```\n\n**Actualización automática:**\n- Polling cada 10 segundos\n- Escucha evento `notificationCreated`\n\n**Funciones:**\n- `loadNotifications()`: Carga todas las notificaciones\n- `loadUnreadCount()`: Cuenta no leídas\n- `handleMarkAsRead(id)`: Marca una como leída\n- `handleMarkAllAsRead()`: Marca todas como leídas\n- `handleDelete(id)`: Elimina una notificación\n- `handleDeleteAllRead()`: Elimina todas las leídas\n\n**Iconos por tipo:**\n- success: `CheckCircle` (verde)\n- warning: `AlertCircle` (amarillo)\n- error: `AlertCircle` (rojo)\n- info: `Info` (azul)\n\n**Formato de fecha:**\n- Just now\n- Xm ago\n- Xh ago\n- Xd ago\n- Fecha completa (>7 días)\n\n---\n\n### `Toast.tsx`\n\n**Ubicación:** `/components/Toast.tsx`\n\n**Props:**\n```typescript\ninterface ToastProps {\n  message: string;\n  type: 'success' | 'error';\n  onClose: () => void;\n}\n```\n\n**Comportamiento:**\n- Aparece en esquina superior derecha\n- Auto-cierre después de 3 segundos\n- Animación de entrada/salida\n\n---\n\n### `ErrorBoundary.tsx`\n\n**Ubicación:** `/components/ErrorBoundary.tsx`\n\n**Descripción:** Captura errores de React y muestra fallback.\n\n---\n\n### `MeetingNotesModal.tsx`\n\n**Ubicación:** `/components/MeetingNotesModal.tsx`\n\n**Props:**\n```typescript\ninterface MeetingNotesModalProps {\n  project: Project;\n  isOpen: boolean;\n  onClose: () => void;\n}\n```\n\n**Funcionalidades:**\n- Lista de notas del proyecto\n- Crear nueva nota\n- Eliminar nota\n\n---\n\n## Modales (Modals.tsx)\n\n### `BaseModal`\n\n**Descripción:** Componente base para todos los modales.\n\n**Props:**\n```typescript\ninterface BaseModalProps {\n  isOpen: boolean;\n  onClose: () => void;\n  title: string;\n  children: React.ReactNode;\n}\n```\n\n**Estructura:**\n- Overlay con backdrop-blur\n- Contenedor centrado con max-height 90vh\n- Header con título y botón cerrar\n- Contenido scrollable\n\n---\n\n### `TaskDetailModal`\n\n**Descripción:** Panel lateral para ver detalles de tarea.\n\n**Secciones:**\n- Header con badges (prioridad, estado)\n- Grid de atributos (proyecto, fecha, asignado, referencia)\n- Time tracking (estimado vs actual)\n- Descripción\n- Actividad reciente\n- Footer con botón editar\n\n**Animación:** Slide desde la derecha\n\n---\n\n### `ConfirmationModal`\n\n**Descripción:** Diálogo de confirmación para acciones destructivas.\n\n**Props:**\n```typescript\ninterface ConfirmationModalProps {\n  isOpen: boolean;\n  onClose: () => void;\n  onConfirm: () => void;\n  title: string;\n  message: string;\n}\n```\n\n---\n\n### `ProjectModal`\n\n**Descripción:** Formulario de creación/edición de proyecto.\n**Líneas:** ~450 (el más complejo)\n\n**Tabs:**\n1. **Basic Info:** Nombre, cliente, fecha, estado, progreso\n2. **Description:** Descripción larga\n3. **Attachments:** Subida y gestión de archivos\n\n**Estados:**\n```typescript\nconst [activeTab, setActiveTab] = useState<'basic' | 'description' | 'attachments'>('basic');\nconst [formData, setFormData] = useState({...});\nconst [attachments, setAttachments] = useState<ProjectAttachment[]>([]);\nconst [queuedFiles, setQueuedFiles] = useState<File[]>([]);\nconst [uploadingFile, setUploadingFile] = useState<string | null>(null);\nconst [dragOver, setDragOver] = useState(false);\n```\n\n**Drag & Drop de archivos:**\n- Zona de drop con feedback visual\n- Validación cliente de tamaño (10MB)\n- Archivos encolados para proyectos nuevos\n- Subida inmediata para proyectos existentes\n\n---\n\n### `NewTaskModal`\n\n**Descripción:** Formulario de creación/edición de tarea.\n\n**Campos:**\n- Title, Description\n- Project (select), Priority (select)\n- Status (select), Due Date\n- Estimated Hours, Actual Hours\n\n---\n\n### `NewEventModal`\n\n**Descripción:** Formulario de creación de evento.\n\n**Campos:**\n- Title\n- Date, Time\n- Type (Meeting/Deadline/Review)\n\n---\n\n### `NewMemberModal`\n\n**Descripción:** Formulario de invitación de miembro.\n\n**Campos:**\n- Full Name\n- Email Address\n- Role\n\n**Nota:** Asigna avatar aleatorio de `AVATARS`.\n\n---\n\n## Resumen de Componentes\n\n| Componente | Tipo | Líneas | Complejidad |\n|------------|------|--------|-------------|\n| App | Layout | ~162 | Media |\n| Sidebar | Layout | ~101 | Baja |\n| AuthPage | Página | - | Media |\n| Dashboard | Página | ~19 | Baja |\n| ProjectsPage | Página | ~277 | Alta |\n| TasksPage | Página | ~426 | Alta |\n| CalendarPage | Página | ~169 | Media |\n| TeamPage | Página | ~148 | Media |\n| SettingsPage | Página | ~428 | Alta |\n| KPICards | Dashboard | ~92 | Baja |\n| ChartsSection | Dashboard | ~105 | Media |\n| ActiveProjects | Dashboard | - | Baja |\n| PendingTasks | Dashboard | - | Baja |\n| NotificationCenter | UI | ~261 | Alta |\n| Toast | UI | - | Baja |\n| ErrorBoundary | UI | - | Baja |\n| MeetingNotesModal | Modal | - | Media |\n| Modals (varios) | Modal | ~1100 | Alta |\n"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Leer todos los archivos principales del proyecto",
      "status": "completed",
      "activeForm": "Leyendo archivos principales del proyecto"
    },
    {
      "content": "Crear spec de Types y Constants",
      "status": "completed",
      "activeForm": "Creando spec de Types y Constants"
    },
    {
      "content": "Crear spec de Services (storage, notifications, supabase)",
      "status": "completed",
      "activeForm": "Creando spec de Services"
    },
    {
      "content": "Crear spec de Context (AuthContext, AppContext)",
      "status": "completed",
      "activeForm": "Creando spec de Context"
    },
    {
      "content": "Crear spec de Components",
      "status": "completed",
      "activeForm": "Creando spec de Components"
    },
    {
      "content": "Crear spec de Hooks y Utils",
      "status": "in_progress",
      "activeForm": "Creando spec de Hooks y Utils"
    },
    {
      "content": "Crear archivo maestro de arquitectura global",
      "status": "pending",
      "activeForm": "Creando archivo maestro de arquitectura"
    }
  ]
}

🔧 Tool: Write
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/specs/05-HOOKS-UTILS.spec.md",
  "content": "# Especificación: Hooks y Utils\n\n## Visión General\n\nEl proyecto incluye hooks personalizados y utilidades para funcionalidades comunes:\n- **Hooks:** Lógica reutilizable de React\n- **Utils:** Funciones de utilidad puras\n\n---\n\n## Hooks (`/hooks/`)\n\n### Archivo: `hooks/index.ts`\n\n**Descripción:** Barrel file para exportar todos los hooks.\n\n```typescript\nexport { useClickOutside } from './useClickOutside';\nexport { useDebounce } from './useDebounce';\n```\n\n---\n\n### Hook: `useClickOutside`\n\n**Archivo:** `hooks/useClickOutside.ts`\n**Líneas:** ~35\n\n#### Descripción\nDetecta clics fuera de un elemento referenciado. Útil para cerrar menús dropdown, modales, etc.\n\n#### Firma\n```typescript\nfunction useClickOutside<T extends HTMLElement = HTMLElement>(\n  ref: RefObject<T>,\n  handler: (event: MouseEvent | TouchEvent) => void\n): void\n```\n\n#### Parámetros\n| Parámetro | Tipo | Descripción |\n|-----------|------|-------------|\n| `ref` | `RefObject<T>` | Referencia al elemento DOM a monitorear |\n| `handler` | `(event) => void` | Callback ejecutado al detectar clic fuera |\n\n#### Implementación\n\n```typescript\nuseEffect(() => {\n  const listener = (event: MouseEvent | TouchEvent) => {\n    const el = ref.current;\n\n    // No hacer nada si el clic es dentro del elemento\n    if (!el || el.contains(event.target as Node)) {\n      return;\n    }\n\n    handler(event);\n  };\n\n  // Escuchar eventos de mouse y touch\n  document.addEventListener('mousedown', listener);\n  document.addEventListener('touchstart', listener);\n\n  return () => {\n    document.removeEventListener('mousedown', listener);\n    document.removeEventListener('touchstart', listener);\n  };\n}, [ref, handler]);\n```\n\n#### Eventos Monitoreados\n- `mousedown`: Clic con mouse\n- `touchstart`: Toque en pantalla táctil\n\n#### Ejemplo de Uso\n\n```typescript\nimport { useRef } from 'react';\nimport { useClickOutside } from '../hooks';\n\nconst DropdownMenu: React.FC = () => {\n  const [isOpen, setIsOpen] = useState(true);\n  const menuRef = useRef<HTMLDivElement>(null);\n\n  useClickOutside(menuRef, () => {\n    setIsOpen(false);\n  });\n\n  return (\n    <div ref={menuRef}>\n      {isOpen && <div>Menu content...</div>}\n    </div>\n  );\n};\n```\n\n#### Uso en la App\n- `NotificationCenter`: Cerrar dropdown de notificaciones\n- `ProjectsPage`: Cerrar menú contextual de proyecto\n- `TasksPage`: Cerrar menú contextual de tarea\n- `TeamPage`: Cerrar menú de miembro\n\n---\n\n### Hook: `useDebounce`\n\n**Archivo:** `hooks/useDebounce.ts`\n**Líneas:** ~28\n\n#### Descripción\nRetarda la actualización de un valor hasta que pase un tiempo sin cambios. Útil para optimizar búsquedas, filtros, o llamadas a API.\n\n#### Firma\n```typescript\nfunction useDebounce<T>(value: T, delay?: number): T\n```\n\n#### Parámetros\n| Parámetro | Tipo | Default | Descripción |\n|-----------|------|---------|-------------|\n| `value` | `T` | - | Valor a debounce |\n| `delay` | `number` | `500` | Milisegundos de espera |\n\n#### Retorna\nEl valor debounced (actualizado solo después del delay).\n\n#### Implementación\n\n```typescript\nexport function useDebounce<T>(value: T, delay: number = 500): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    // Configurar timeout\n    const timeoutId = setTimeout(() => {\n      setDebouncedValue(value);\n    }, delay);\n\n    // Limpiar timeout si el valor cambia antes del delay\n    return () => {\n      clearTimeout(timeoutId);\n    };\n  }, [value, delay]);\n\n  return debouncedValue;\n}\n```\n\n#### Ejemplo de Uso\n\n```typescript\nimport { useState } from 'react';\nimport { useDebounce } from '../hooks';\n\nconst SearchComponent: React.FC = () => {\n  const [searchTerm, setSearchTerm] = useState('');\n  const debouncedSearch = useDebounce(searchTerm, 300);\n\n  useEffect(() => {\n    if (debouncedSearch) {\n      // Solo buscar después de 300ms sin cambios\n      performSearch(debouncedSearch);\n    }\n  }, [debouncedSearch]);\n\n  return (\n    <input\n      value={searchTerm}\n      onChange={(e) => setSearchTerm(e.target.value)}\n      placeholder=\"Search...\"\n    />\n  );\n};\n```\n\n#### Uso Potencial en la App\n- Búsqueda en TeamPage (actualmente sin debounce)\n- Filtros de proyectos/tareas\n- Campos de formulario con validación async\n\n---\n\n## Utils (`/utils/`)\n\n### Archivo: `utils/sanitize.ts`\n\n**Líneas:** ~46\n\n#### Descripción\nProporciona funciones de sanitización para prevenir ataques XSS (Cross-Site Scripting).\n\n**Dependencia:** `dompurify`\n\n---\n\n### Función: `sanitizeHtml`\n\n#### Descripción\nSanitiza contenido HTML manteniendo tags seguros.\n\n#### Firma\n```typescript\nfunction sanitizeHtml(dirty: string): string\n```\n\n#### Configuración\n\n```typescript\nreturn DOMPurify.sanitize(dirty, {\n  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'],\n  ALLOWED_ATTR: ['href', 'title', 'target'],\n  ALLOW_DATA_ATTR: false,\n});\n```\n\n#### Tags Permitidos\n| Tag | Uso |\n|-----|-----|\n| `b`, `strong` | Negrita |\n| `i`, `em` | Itálica |\n| `a` | Enlaces (con href, title, target) |\n| `p` | Párrafos |\n| `br` | Saltos de línea |\n| `ul`, `ol`, `li` | Listas |\n| `code`, `pre` | Código |\n\n#### Ejemplo de Uso\n\n```typescript\nimport { sanitizeHtml } from '../utils/sanitize';\n\nconst userInput = '<script>alert(\"XSS\")</script><b>Hello</b>';\nconst safe = sanitizeHtml(userInput);\n// Resultado: \"<b>Hello</b>\"\n```\n\n---\n\n### Función: `sanitizeText`\n\n#### Descripción\nEscapa entidades HTML para texto plano. Útil cuando el input debe mostrarse literalmente sin interpretarse como HTML.\n\n#### Firma\n```typescript\nfunction sanitizeText(text: string): string\n```\n\n#### Implementación\n\n```typescript\nexport const sanitizeText = (text: string): string => {\n  const div = document.createElement('div');\n  div.textContent = text;\n  return div.innerHTML;\n};\n```\n\n#### Ejemplo\n\n```typescript\nconst userInput = '<script>alert(\"XSS\")</script>';\nconst safe = sanitizeText(userInput);\n// Resultado: \"&lt;script&gt;alert(\"XSS\")&lt;/script&gt;\"\n```\n\n#### Caracteres Escapados\n| Original | Escapado |\n|----------|----------|\n| `<` | `&lt;` |\n| `>` | `&gt;` |\n| `&` | `&amp;` |\n| `\"` | `&quot;` |\n| `'` | `&#39;` |\n\n---\n\n### Función: `sanitizeUrl`\n\n#### Descripción\nValida y sanitiza URLs para prevenir ataques via `javascript:` o `data:` URIs.\n\n#### Firma\n```typescript\nfunction sanitizeUrl(url: string): string\n```\n\n#### Implementación\n\n```typescript\nexport const sanitizeUrl = (url: string): string => {\n  try {\n    const parsed = new URL(url);\n    // Solo permitir protocolos seguros\n    if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {\n      return '';\n    }\n    return url;\n  } catch {\n    // URL inválida\n    return '';\n  }\n};\n```\n\n#### Protocolos Permitidos\n- `http:`\n- `https:`\n- `mailto:`\n\n#### Protocolos Bloqueados\n- `javascript:` (XSS)\n- `data:` (inyección de contenido)\n- `file:` (acceso a sistema local)\n- Cualquier otro protocolo\n\n#### Ejemplos\n\n```typescript\nsanitizeUrl('https://example.com')    // \"https://example.com\"\nsanitizeUrl('javascript:alert(1)')    // \"\"\nsanitizeUrl('data:text/html,...')     // \"\"\nsanitizeUrl('not a url')              // \"\"\nsanitizeUrl('mailto:user@email.com')  // \"mailto:user@email.com\"\n```\n\n---\n\n## Diagrama de Uso\n\n```\n┌─────────────────────────────────────────────────────────┐\n│                    Components                           │\n├─────────────────────────────────────────────────────────┤\n│                                                          │\n│  NotificationCenter ──┐                                  │\n│  ProjectsPage ────────┼──► useClickOutside()            │\n│  TasksPage ───────────┤                                  │\n│  TeamPage ────────────┘                                  │\n│                                                          │\n│  (Futuro) SearchComponent ──► useDebounce()             │\n│                                                          │\n│  MeetingNotesModal ──┐                                   │\n│  ProjectModal ───────┼──► sanitizeHtml() (descripcion)  │\n│  TaskDetailModal ────┘                                   │\n│                                                          │\n│  (Links externos) ──► sanitizeUrl()                     │\n│                                                          │\n│  (Input de usuario) ──► sanitizeText()                  │\n│                                                          │\n└─────────────────────────────────────────────────────────┘\n```\n\n---\n\n## Mejores Prácticas\n\n### Para `useClickOutside`\n1. Siempre pasar un `ref` que persista entre renders\n2. El `handler` debería ser un `useCallback` para evitar re-suscripciones innecesarias\n\n```typescript\nconst handleClose = useCallback(() => {\n  setIsOpen(false);\n}, []);\n\nuseClickOutside(ref, handleClose);\n```\n\n### Para `useDebounce`\n1. Usar delays apropiados:\n   - Búsqueda: 300-500ms\n   - Validación: 300ms\n   - Auto-save: 1000-2000ms\n2. No usar para inputs críticos donde el usuario espera feedback inmediato\n\n### Para Sanitización\n1. **Siempre** sanitizar contenido generado por usuarios antes de renderizar\n2. Usar `sanitizeHtml` para rich text\n3. Usar `sanitizeText` para texto plano\n4. Usar `sanitizeUrl` para cualquier URL que venga de input de usuario\n5. Nunca confiar en sanitización del cliente como única capa de seguridad\n\n---\n\n## Notas de Implementación\n\n### Hooks no Utilizados\n- `useDebounce` está definido pero no se utiliza actualmente en la aplicación\n- Puede ser útil para optimizar la búsqueda en `TeamPage`\n\n### Sanitización Limitada\n- Las funciones de sanitización existen pero se usan de forma limitada\n- Se recomienda ampliar su uso especialmente en:\n  - Descripciones de proyectos/tareas\n  - Notas de reunión\n  - Nombres ingresados por usuario\n"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Leer todos los archivos principales del proyecto",
      "status": "completed",
      "activeForm": "Leyendo archivos principales del proyecto"
    },
    {
      "content": "Crear spec de Types y Constants",
      "status": "completed",
      "activeForm": "Creando spec de Types y Constants"
    },
    {
      "content": "Crear spec de Services (storage, notifications, supabase)",
      "status": "completed",
      "activeForm": "Creando spec de Services"
    },
    {
      "content": "Crear spec de Context (AuthContext, AppContext)",
      "status": "completed",
      "activeForm": "Creando spec de Context"
    },
    {
      "content": "Crear spec de Components",
      "status": "completed",
      "activeForm": "Creando spec de Components"
    },
    {
      "content": "Crear spec de Hooks y Utils",
      "status": "completed",
      "activeForm": "Creando spec de Hooks y Utils"
    },
    {
      "content": "Crear archivo maestro de arquitectura global",
      "status": "in_progress",
      "activeForm": "Creando archivo maestro de arquitectura"
    }
  ]
}

🔧 Tool: Write
Input: {
  "file_path": "/Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/specs/00-ARQUITECTURA-GLOBAL.spec.md",
  "content": "# Gestión Pro Dashboard - Arquitectura Global\n\n## Información del Proyecto\n\n| Campo | Valor |\n|-------|-------|\n| **Nombre** | Gestión Pro Dashboard |\n| **Tipo** | SPA (Single Page Application) |\n| **Framework** | React 18.3.1 + TypeScript 5.8.2 |\n| **Build Tool** | Vite 6.2.0 |\n| **Backend** | Supabase (PostgreSQL + Auth + Storage) |\n| **Estilos** | Tailwind CSS 3.4.19 |\n| **Routing** | React Router DOM 7.11.0 |\n| **Visualización** | Recharts 2.12.7 |\n| **Iconos** | Lucide React 0.263.1 |\n\n---\n\n## Estructura del Proyecto\n\n```\ngestión-pro-dashboard/\n│\n├── 📁 specs/                          # Documentación técnica (NUEVO)\n│   ├── 00-ARQUITECTURA-GLOBAL.spec.md\n│   ├── 01-TYPES-CONSTANTS.spec.md\n│   ├── 02-SERVICES.spec.md\n│   ├── 03-CONTEXT.spec.md\n│   ├── 04-COMPONENTS.spec.md\n│   └── 05-HOOKS-UTILS.spec.md\n│\n├── 📁 components/                     # Componentes React\n│   ├── AuthPage.tsx                   # Página de login/registro\n│   ├── Dashboard.tsx                  # Dashboard principal\n│   ├── ProjectsPage.tsx               # Gestión de proyectos\n│   ├── TasksPage.tsx                  # Tablero Kanban de tareas\n│   ├── CalendarPage.tsx               # Calendario de eventos\n│   ├── TeamPage.tsx                   # Directorio de equipo\n│   ├── SettingsPage.tsx               # Configuración de usuario\n│   ├── Sidebar.tsx                    # Navegación lateral\n│   ├── Modals.tsx                     # Todos los modales\n│   ├── NotificationCenter.tsx         # Centro de notificaciones\n│   ├── KPICards.tsx                   # Tarjetas de métricas\n│   ├── ChartsSection.tsx              # Gráficos del dashboard\n│   ├── ActiveProjects.tsx             # Lista proyectos activos\n│   ├── PendingTasks.tsx               # Lista tareas pendientes\n│   ├── MeetingNotesModal.tsx          # Modal de notas de reunión\n│   ├── Toast.tsx                      # Notificaciones toast\n│   └── ErrorBoundary.tsx              # Manejo de errores\n│\n├── 📁 context/                        # Estado global\n│   ├── AuthContext.tsx                # Autenticación y usuario\n│   └── AppContext.tsx                 # Datos de la aplicación\n│\n├── 📁 services/                       # Capa de datos\n│   ├── supabase.ts                    # Cliente de Supabase\n│   ├── storage.ts                     # CRUD de entidades\n│   ├── notifications.ts               # Servicio de notificaciones\n│   └── firebase.ts                    # (Deprecado)\n│\n├── 📁 hooks/                          # Hooks personalizados\n│   ├── index.ts                       # Barrel file\n│   ├── useClickOutside.ts             # Detectar clic fuera\n│   └── useDebounce.ts                 # Debounce de valores\n│\n├── 📁 utils/                          # Utilidades\n│   └── sanitize.ts                    # Sanitización XSS\n│\n├── 📁 types/                          # Tipos de Supabase\n│   └── supabase.ts                    # Tipos auto-generados\n│\n├── 📁 public/                         # Assets estáticos\n│   └── icons/                         # Iconos PWA\n│\n├── 📁 dist/                           # Build de producción\n│\n├── 📄 App.tsx                         # Componente raíz\n├── 📄 index.tsx                       # Punto de entrada React\n├── 📄 index.html                      # HTML template\n├── 📄 index.css                       # Estilos globales\n├── 📄 types.ts                        # Interfaces TypeScript\n├── 📄 constants.ts                    # Constantes UI\n├── 📄 vite.config.ts                  # Configuración Vite\n├── 📄 tailwind.config.js              # Configuración Tailwind\n├── 📄 tsconfig.json                   # Configuración TypeScript\n├── 📄 package.json                    # Dependencias\n├── 📄 sw.js                           # Service Worker (PWA)\n├── 📄 manifest.json                   # Manifest PWA\n└── 📄 supabase-*.sql                  # Esquemas de base de datos\n```\n\n---\n\n## Arquitectura de Alto Nivel\n\n```\n┌─────────────────────────────────────────────────────────────────────┐\n│                           FRONTEND                                   │\n│                    (React + TypeScript + Vite)                       │\n│  ┌─────────────────────────────────────────────────────────────┐   │\n│  │                        Components                            │   │\n│  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │   │\n│  │  │ Pages   │ │ Layout  │ │ Shared  │ │ Modals  │           │   │\n│  │  └────┬────┘ └────┬────┘ └────┬────┘ └────┬────┘           │   │\n│  │       └───────────┴───────────┴───────────┘                 │   │\n│  └───────────────────────────┬─────────────────────────────────┘   │\n│                              │                                       │\n│  ┌───────────────────────────▼─────────────────────────────────┐   │\n│  │                      Context Layer                           │   │\n│  │  ┌─────────────────┐         ┌─────────────────┐            │   │\n│  │  │   AuthContext   │────────▶│   AppContext    │            │   │\n│  │  │  (User, Auth)   │         │  (Data, CRUD)   │            │   │\n│  │  └────────┬────────┘         └────────┬────────┘            │   │\n│  └───────────┼───────────────────────────┼─────────────────────┘   │\n│              │                           │                          │\n│  ┌───────────▼───────────────────────────▼─────────────────────┐   │\n│  │                     Services Layer                           │   │\n│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │\n│  │  │ supabase.ts  │  │ storage.ts   │  │ notifications.ts │   │   │\n│  │  │  (Client)    │  │   (CRUD)     │  │   (Alerts)       │   │   │\n│  │  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘   │   │\n│  └─────────┼─────────────────┼───────────────────┼─────────────┘   │\n│            └─────────────────┴───────────────────┘                  │\n│                              │                                       │\n└──────────────────────────────┼───────────────────────────────────────┘\n                               │ HTTPS\n┌──────────────────────────────▼───────────────────────────────────────┐\n│                           SUPABASE                                    │\n│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │\n│  │   PostgreSQL    │  │   Auth          │  │   Storage       │      │\n│  │   (Database)    │  │   (Auth users)  │  │   (Files)       │      │\n│  │                 │  │                 │  │                 │      │\n│  │  - profiles     │  │  - Sessions     │  │  - avatars      │      │\n│  │  - projects     │  │  - JWT Tokens   │  │  - project-     │      │\n│  │  - tasks        │  │  - RLS Policies │  │    attachments  │      │\n│  │  - team_members │  │                 │  │                 │      │\n│  │  - calendar_    │  │                 │  │                 │      │\n│  │    events       │  │                 │  │                 │      │\n│  │  - notifications│  │                 │  │                 │      │\n│  │  - meeting_notes│  │                 │  │                 │      │\n│  │  - project_     │  │                 │  │                 │      │\n│  │    attachments  │  │                 │  │                 │      │\n│  └─────────────────┘  └─────────────────┘  └─────────────────┘      │\n│                                                                       │\n│  ┌─────────────────────────────────────────────────────────────┐    │\n│  │                      Realtime                                │    │\n│  │            (WebSocket subscriptions to tables)               │    │\n│  └─────────────────────────────────────────────────────────────┘    │\n└───────────────────────────────────────────────────────────────────────┘\n```\n\n---\n\n## Flujo de Datos\n\n### 1. Autenticación\n```\nUsuario → AuthPage → supabase.auth.signIn/signUp → Supabase Auth\n                                                          ↓\n                                               JWT Token (localStorage)\n                                                          ↓\n                                               AuthContext.handleSessionChange\n                                                          ↓\n                                               profiles table → User object\n```\n\n### 2. Operaciones CRUD\n```\nUsuario → Componente → useApp() → AppContext\n                                       ↓\n                            addProject/editTask/etc.\n                                       ↓\n                              db.saveProject/updateTask/etc.\n                                       ↓\n                              Supabase (INSERT/UPDATE/DELETE)\n                                       ↓\n                              Realtime trigger\n                                       ↓\n                              loadData() → Actualizar estado\n```\n\n### 3. Notificaciones en Tiempo Real\n```\nSupabase Change Event\n        ↓\nchannel.on('postgres_changes', ...)\n        ↓\nloadData() called\n        ↓\ncheckForDeadlines()\n        ↓\nnotificationService.notifyDeadlineApproaching()\n        ↓\nwindow.dispatchEvent('notificationCreated')\n        ↓\nNotificationCenter.loadNotifications()\n```\n\n---\n\n## Modelo de Datos (Supabase)\n\n### Diagrama ER Simplificado\n\n```\n┌─────────────┐       ┌─────────────────┐       ┌─────────────────┐\n│   profiles  │       │    projects     │       │     tasks       │\n├─────────────┤       ├─────────────────┤       ├─────────────────┤\n│ id (PK)     │───────│ created_by (FK) │       │ id (PK)         │\n│ email       │       │ id (PK)         │◄──────│ project (name)  │\n│ name        │       │ name            │       │ title           │\n│ avatar      │       │ client          │       │ status          │\n│ role        │       │ status          │       │ priority        │\n│ settings... │       │ progress        │       │ due_date        │\n└─────────────┘       │ due_date        │       │ assignee        │\n      │               │ members[]       │       │ estimated_hours │\n      │               └────────┬────────┘       │ actual_hours    │\n      │                        │                └─────────────────┘\n      │               ┌────────▼────────┐\n      │               │ project_        │\n      │               │ attachments     │\n      │               ├─────────────────┤\n      │               │ id (PK)         │\n      │               │ project_id (FK) │\n      │               │ file_name       │\n      │               │ file_url        │\n      │               │ file_type       │\n      │               └─────────────────┘\n\n┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐\n│  team_members   │   │ calendar_events │   │  notifications  │\n├─────────────────┤   ├─────────────────┤   ├─────────────────┤\n│ id (PK)         │   │ id (PK)         │   │ id (PK)         │\n│ name            │   │ title           │   │ user_id (FK)    │\n│ email           │   │ date            │   │ title           │\n│ role            │   │ time            │   │ message         │\n│ avatar          │   │ type            │   │ type            │\n│ status          │   └─────────────────┘   │ read            │\n└─────────────────┘                         │ related_type    │\n                                            │ related_id      │\n┌─────────────────┐                         └─────────────────┘\n│  meeting_notes  │\n├─────────────────┤\n│ id (PK)         │\n│ project_id (FK) │\n│ content         │\n│ created_at      │\n│ created_by      │\n└─────────────────┘\n```\n\n---\n\n## Sistema de Permisos\n\n### Roles de Usuario\n\n| Rol | Descripción | Permisos |\n|-----|-------------|----------|\n| **Admin** | Administrador completo | Todo: CRUD proyectos, tareas, equipo, eventos |\n| **Editor** | Colaborador | CRUD proyectos, tareas, eventos. No gestiona equipo |\n| **Viewer** | Solo lectura | Solo visualización. No puede crear/editar/eliminar |\n\n### Implementación en Código\n\n```typescript\n// En componentes\nconst { user } = useAuth();\nconst canEdit = user?.role !== 'Viewer';\nconst isAdmin = user?.role === 'Admin';\n\n// Condicionales\n{canEdit && <button>Edit</button>}\n{isAdmin && <button>Delete User</button>}\n```\n\n### RLS en Supabase\n```sql\n-- Ejemplo: Solo el creador puede editar su proyecto\nCREATE POLICY \"Users can update own projects\"\nON projects FOR UPDATE\nUSING (created_by = auth.uid());\n```\n\n---\n\n## Tecnologías y Dependencias\n\n### Producción\n| Paquete | Versión | Uso |\n|---------|---------|-----|\n| react | 18.3.1 | UI Framework |\n| react-dom | 18.3.1 | DOM Rendering |\n| react-router-dom | 7.11.0 | Routing |\n| @supabase/supabase-js | 2.89.0 | Backend SDK |\n| lucide-react | 0.263.1 | Iconos |\n| recharts | 2.12.7 | Gráficos |\n| dompurify | 3.3.1 | Sanitización XSS |\n| uuid | - | Generación IDs |\n\n### Desarrollo\n| Paquete | Versión | Uso |\n|---------|---------|-----|\n| vite | 6.2.0 | Build tool |\n| typescript | 5.8.2 | Type checking |\n| tailwindcss | 3.4.19 | Estilos |\n| eslint | 9.39.2 | Linting |\n| prettier | 3.7.4 | Formateo |\n\n---\n\n## Configuración de Entorno\n\n### Variables Requeridas (`.env.local`)\n```env\nVITE_SUPABASE_URL=https://your-project.supabase.co\nVITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\n```\n\n### Variables Opcionales\n```env\nVITE_GEMINI_API_KEY=...  # Para futuras integraciones AI\n```\n\n---\n\n## Scripts NPM\n\n```json\n{\n  \"dev\": \"vite\",                    // Servidor de desarrollo\n  \"build\": \"vite build\",            // Build producción\n  \"preview\": \"vite preview\",        // Preview del build\n  \"lint\": \"eslint . --ext .ts,.tsx\",\n  \"lint:fix\": \"eslint . --ext .ts,.tsx --fix\",\n  \"format\": \"prettier --write **/*.{ts,tsx,js,jsx,json,css,md}\",\n  \"format:check\": \"prettier --check ...\",\n  \"type-check\": \"tsc --noEmit\"\n}\n```\n\n---\n\n## Características Principales\n\n### 1. Gestión de Proyectos\n- CRUD completo de proyectos\n- Estados: Planning, In Progress, Review, Completed\n- Barra de progreso\n- Adjuntos de archivos (hasta 10MB)\n- Notas de reunión por proyecto\n\n### 2. Gestión de Tareas\n- Tablero Kanban con drag & drop\n- Columnas: Todo, In Progress, Done\n- Prioridades: High, Medium, Low\n- Asignación a miembros del equipo\n- Time tracking (estimado vs actual)\n- Indicadores de deadline (overdue, today, soon)\n\n### 3. Calendario\n- Vista mensual\n- Tipos de evento: Meeting, Deadline, Review\n- Navegación por mes\n- Creación de eventos al hacer clic en día\n\n### 4. Gestión de Equipo\n- Directorio de miembros\n- Estados: Online, Offline, Busy\n- Búsqueda por nombre/rol\n- Solo Admin puede añadir/eliminar\n\n### 5. Notificaciones\n- Centro de notificaciones en tiempo real\n- Alertas de deadlines (1, 3, 7 días)\n- Marcar como leído\n- Eliminar notificaciones\n\n### 6. Configuración de Usuario\n- Perfil: Nombre, email, avatar, bio, teléfono\n- Preferencias: Timezone, idioma\n- Apariencia: Tema (light/dark), densidad\n- Seguridad: Cambio de contraseña\n\n### 7. PWA\n- Service Worker para cache\n- Manifest para instalación\n- Iconos optimizados\n\n---\n\n## Patrones de Diseño Utilizados\n\n1. **Context Pattern:** Para estado global (Auth, App)\n2. **Repository Pattern:** StorageService abstrae la fuente de datos\n3. **Fallback Pattern:** localStorage como respaldo de Supabase\n4. **Observer Pattern:** Realtime subscriptions\n5. **Component Composition:** Modales reutilizables con BaseModal\n6. **Custom Hooks:** Lógica reutilizable (useClickOutside, useDebounce)\n\n---\n\n## Archivos de Especificación\n\n| Archivo | Contenido |\n|---------|-----------|\n| `00-ARQUITECTURA-GLOBAL.spec.md` | Este documento - visión general |\n| `01-TYPES-CONSTANTS.spec.md` | Interfaces TypeScript y constantes |\n| `02-SERVICES.spec.md` | Servicios de datos (Supabase, Storage, Notifications) |\n| `03-CONTEXT.spec.md` | AuthContext y AppContext |\n| `04-COMPONENTS.spec.md` | Todos los componentes React |\n| `05-HOOKS-UTILS.spec.md` | Hooks personalizados y utilidades |\n\n---\n\n## Próximos Pasos Sugeridos\n\n1. **Mejoras de Seguridad:**\n   - Implementar 2FA\n   - Rate limiting en el cliente\n   - Ampliar uso de sanitización\n\n2. **Mejoras de UX:**\n   - Dark mode completo\n   - Búsqueda global\n   - Filtros avanzados\n\n3. **Nuevas Funcionalidades:**\n   - Comentarios en tareas\n   - Subtareas\n   - Historial de cambios\n   - Exportación de datos\n   - Integraciones (Slack, Email)\n\n4. **Optimizaciones:**\n   - Lazy loading de componentes\n   - Virtualización de listas largas\n   - Optimistic updates\n"
}

🔧 Tool: TodoWrite
Input: {
  "todos": [
    {
      "content": "Leer todos los archivos principales del proyecto",
      "status": "completed",
      "activeForm": "Leyendo archivos principales del proyecto"
    },
    {
      "content": "Crear spec de Types y Constants",
      "status": "completed",
      "activeForm": "Creando spec de Types y Constants"
    },
    {
      "content": "Crear spec de Services (storage, notifications, supabase)",
      "status": "completed",
      "activeForm": "Creando spec de Services"
    },
    {
      "content": "Crear spec de Context (AuthContext, AppContext)",
      "status": "completed",
      "activeForm": "Creando spec de Context"
    },
    {
      "content": "Crear spec de Components",
      "status": "completed",
      "activeForm": "Creando spec de Components"
    },
    {
      "content": "Crear spec de Hooks y Utils",
      "status": "completed",
      "activeForm": "Creando spec de Hooks y Utils"
    },
    {
      "content": "Crear archivo maestro de arquitectura global",
      "status": "completed",
      "activeForm": "Creando archivo maestro de arquitectura"
    }
  ]
}

🔧 Tool: Bash
Input: {
  "command": "ls -la /Users/maitellerenasobrino/Documents/development/gestión-pro-dashboard/specs/",
  "description": "List created spec files"
}
He completado el análisis completo del proyecto y creado todos los ficheros de especificaciones. Aquí está el resumen:

<summary>
## Summary: Análisis Completo del Proyecto y Creación de Especificaciones

### Changes Implemented
- Análisis exhaustivo de toda la base de código del proyecto "Gestión Pro Dashboard"
- Creación de 6 ficheros de especificaciones técnicas detalladas en el directorio `/specs/`
- Documentación de todas las interfaces TypeScript, servicios, contextos, componentes, hooks y utilidades
- Creación de diagramas de arquitectura y flujo de datos

### Files Created
- `specs/00-ARQUITECTURA-GLOBAL.spec.md` (21 KB) - Visión general del proyecto, estructura, tecnologías, patrones de diseño
- `specs/01-TYPES-CONSTANTS.spec.md` (9.5 KB) - Documentación de todas las interfaces TypeScript y constantes
- `specs/02-SERVICES.spec.md` (12 KB) - Especificación de servicios (Supabase, Storage, Notifications)
- `specs/03-CONTEXT.spec.md` (15 KB) - Documentación de AuthContext y AppContext
- `specs/04-COMPONENTS.spec.md` (15 KB) - Especificación de todos los 17 componentes React
- `specs/05-HOOKS-UTILS.spec.md` (10 KB) - Documentación de hooks personalizados y utilidades

### Project Overview Discovered
**Tipo:** SPA de gestión de proyectos (React 18 + TypeScript + Vite)
**Backend:** Supabase (PostgreSQL + Auth + Storage)
**Estilos:** Tailwind CSS
**~4000+ líneas de código** distribuidas en:
- 17 componentes React
- 2 contextos de estado global
- 3 servicios de datos
- 2 hooks personalizados
- 3 utilidades de sanitización

**Funcionalidades principales documentadas:**
1. Gestión de proyectos con adjuntos y notas
2. Tablero Kanban con drag & drop
3. Calendario de eventos
4. Directorio de equipo
5. Sistema de notificaciones en tiempo real
6. Configuración de usuario y seguridad
7. Sistema de roles (Admin/Editor/Viewer)

### Notes for Developer
- Los specs están organizados numéricamente para lectura secuencial
- El archivo `00-ARQUITECTURA-GLOBAL.spec.md` proporciona la visión de alto nivel
- Cada spec incluye firmas de funciones, parámetros, y ejemplos de uso
- Se incluyen diagramas de flujo de datos y modelos ER
- Las sugerencias de mejoras futuras están documentadas en el spec de arquitectura
</summary>