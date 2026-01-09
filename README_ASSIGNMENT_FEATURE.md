# ✅ Sistema de Asignación - Implementación Completa

## 📦 Archivos SQL de Migración Generados

He creado **3 archivos SQL** que debes ejecutar en orden en tu Supabase SQL Editor:

### 1️⃣ `has-role-function.sql`
Crea la función helper `has_role()` que valida roles de usuario.

### 2️⃣ `project-assignments-migration.sql` ✨ **REGENERADO**
Crea toda la infraestructura para asignaciones de proyectos:
- Columna `project_leader_id` en tabla `projects`
- Tabla `project_assignments` para relación many-to-many
- Índices de performance
- Políticas RLS (Row Level Security)
- Realtime habilitado

### 3️⃣ `task-assignments-migration.sql`
Agrega columna `assigned_to` a tabla `tasks` para asignaciones.

---

## ✅ BUGFIX: Compatibilidad sin Migraciones

**Actualización (9 Enero 2026):** La aplicación ahora funciona correctamente **ANTES** de ejecutar las migraciones SQL.

**Problema resuelto:** Los proyectos no se mostraban porque el código intentaba hacer JOINs con tablas que no existían.

**Solución:** El código ahora detecta automáticamente si las migraciones están ejecutadas y usa el query apropiado:
- ✅ **Sin migraciones** → Query básico, muestra proyectos normalmente
- ✅ **Con migraciones** → Query completo, incluye asignaciones

Ver `BUGFIX_NO_PROJECTS.md` para detalles técnicos.

---

## 🚀 Cómo Ejecutar las Migraciones

### Opción A: Copiar y Pegar (Recomendado)

1. **Ve a Supabase Dashboard**
   - Abre tu proyecto en https://supabase.com
   - Navega a **SQL Editor** (en el menú lateral)

2. **Ejecuta en orden:**

   **Paso 1:** Abre `has-role-function.sql`, copia el contenido y ejecútalo

   **Paso 2:** Abre `project-assignments-migration.sql`, copia el contenido y ejecútalo

   **Paso 3:** Abre `task-assignments-migration.sql`, copia el contenido y ejecútalo

3. **Verifica que funcionó:**
   ```sql
   -- Debe retornar true/false, no error
   SELECT public.has_role(auth.uid(), 'Admin');

   -- Debe retornar una fila con 'project_leader_id'
   SELECT column_name FROM information_schema.columns
   WHERE table_name = 'projects' AND column_name = 'project_leader_id';

   -- Debe retornar 0 filas, pero no error
   SELECT COUNT(*) FROM project_assignments;

   -- Debe retornar una fila con 'assigned_to'
   SELECT column_name FROM information_schema.columns
   WHERE table_name = 'tasks' AND column_name = 'assigned_to';
   ```

### Opción B: Usar Supabase CLI

Si tienes Supabase CLI instalado:

```bash
# Desde la raíz del proyecto
supabase db push has-role-function.sql
supabase db push project-assignments-migration.sql
supabase db push task-assignments-migration.sql
```

---

## 📋 ¿Qué hace cada migración?

### `has-role-function.sql`
```sql
-- Crea función para verificar roles
CREATE OR REPLACE FUNCTION public.has_role(user_id uuid, required_role text)
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**Uso:** Permite a las políticas RLS verificar roles de usuario de forma eficiente.

### `project-assignments-migration.sql`

**Crea:**

1. **Columna en projects:**
   ```sql
   ALTER TABLE public.projects
   ADD COLUMN project_leader_id uuid REFERENCES public.profiles(id);
   ```

2. **Tabla project_assignments:**
   ```sql
   CREATE TABLE public.project_assignments (
     id uuid PRIMARY KEY,
     project_id uuid REFERENCES projects,
     user_id uuid REFERENCES profiles,
     assigned_at timestamp,
     assigned_by uuid REFERENCES profiles
   );
   ```

3. **Índices de performance:**
   - `idx_projects_leader` - Búsqueda rápida de líderes
   - `idx_project_assignments_project` - Obtener miembros de un proyecto
   - `idx_project_assignments_user` - Obtener proyectos de un usuario

4. **Políticas RLS:**
   - Todos pueden ver asignaciones
   - Solo Admins/Editors pueden crear/eliminar asignaciones

### `task-assignments-migration.sql`

```sql
ALTER TABLE public.tasks
ADD COLUMN assigned_to uuid REFERENCES public.profiles(id);

CREATE INDEX idx_tasks_assigned_to ON public.tasks(assigned_to);
```

**Efecto:** Ahora las tareas pueden ser asignadas a usuarios específicos de la tabla `profiles`.

---

## 🎯 ¿Qué puedo hacer después de ejecutar las migraciones?

### ✅ Para Tareas (UI Ya Implementada):

1. **Crear tarea con asignado:**
   - Ve a **Tasks** → **New Task**
   - Verás el selector **"Assigned To"**
   - Selecciona un usuario del dropdown
   - ¡Guarda y listo!

2. **Ver tarea asignada:**
   - Haz clic en cualquier tarea
   - En el panel lateral verás **"Assigned To"**
   - Muestra nombre, avatar y rol del usuario

### 🚧 Para Proyectos (Backend Listo, UI Pendiente):

El backend está 100% funcional, pero falta la UI en `ProjectModal.tsx`.

**Puedes:**
- Llamar directamente a las funciones desde el código
- Agregar la UI siguiendo el mismo patrón del `NewTaskModal`

**Funciones disponibles:**
```typescript
// Desde cualquier componente que use useApp()
const { assignUserToProject, removeUserFromProject, updateProjectLeader } = useApp();

// Asignar líder
await updateProjectLeader(projectId, userId);

// Agregar miembro
await assignUserToProject(projectId, userId);

// Remover miembro
await removeUserFromProject(assignmentId);
```

---

## 🔍 Estructura de la Base de Datos

```
┌─────────────┐
│  profiles   │ ← Usuarios del sistema (con auth)
├─────────────┤
│ id (PK)     │
│ name        │
│ email       │
│ role        │ ← Admin/Editor/Viewer
└─────────────┘
       ▲
       │ FK: project_leader_id
       │
┌─────────────┐
│  projects   │
├─────────────┤
│ id (PK)     │
│ name        │
│ leader_id ─►│ (nuevo)
└─────────────┘
       │
       │ FK: project_id
       ▼
┌──────────────────────┐
│ project_assignments  │ (nuevo)
├──────────────────────┤
│ id (PK)              │
│ project_id (FK) ────►│
│ user_id (FK) ────────┤
│ assigned_by (FK)     │
│ assigned_at          │
└──────────────────────┘
                        │
                        │
                        ▼
                  ┌─────────────┐
                  │  profiles   │
                  └─────────────┘

┌─────────────┐
│   tasks     │
├─────────────┤
│ id (PK)     │
│ title       │
│ assigned_to ┼──► profiles(id) (nuevo)
│ assignee    │ ← Legacy (viejo)
└─────────────┘
```

---

## 🛡️ Seguridad (RLS Policies)

### Tabla `project_assignments`:

| Acción | Quién puede | Política |
|--------|-------------|----------|
| SELECT | Todos los autenticados | `USING (true)` |
| INSERT | Admins y Editors | `WITH CHECK (role IN ('Admin', 'Editor'))` |
| DELETE | Admins y Editors | `USING (role IN ('Admin', 'Editor'))` |

### Columna `project_leader_id`:
- Cualquiera puede verla
- Solo Admins/Editors pueden modificarla (heredado de policies de `projects`)

### Columna `assigned_to` en tasks:
- Cualquiera puede verla
- Solo Admins/Editors pueden modificarla (heredado de policies de `tasks`)

---

## 📝 Notas Técnicas

### Compatibilidad hacia atrás:
- ✅ Campos legacy (`members`, `assignee`) se mantienen
- ✅ La UI escribe en ambos campos (nuevo y legacy)
- ✅ La lectura prioriza campos nuevos

### Performance:
- ✅ Índices en todas las FK
- ✅ Queries optimizados con JOINs
- ✅ Realtime habilitado para actualizaciones instantáneas

### Realtime:
Las tablas con realtime habilitado:
- `project_assignments` ← ¡Nuevo!
- `projects`
- `tasks`
- `profiles`

**Efecto:** Cuando se asigna un usuario, todos los clientes conectados ven el cambio instantáneamente.

---

## ⚠️ Problemas Comunes

### Error: "function handle_updated_at does not exist"
**Solución:** Ejecuta primero el `supabase-schema.sql` completo.

### Error: "relation project_assignments already exists"
**Solución:** Ya ejecutaste la migración. Puedes ignorarla.

### Error: "permission denied for table profiles"
**Solución:**
1. Verifica que estés autenticado en Supabase
2. Verifica que tu usuario tenga rol Admin
3. Verifica las políticas RLS de `profiles`

### Error al asignar: "new row violates foreign key constraint"
**Solución:** El `user_id` que intentas asignar no existe en `profiles`. Verifica:
```sql
SELECT id, name, email FROM profiles;
```

### No veo el selector de usuario en Tasks
**Solución:**
1. Verifica que ejecutaste las migraciones
2. Recarga la página (hard refresh: Cmd+Shift+R)
3. Verifica que `profiles` tenga usuarios:
   ```sql
   SELECT COUNT(*) FROM profiles;
   ```

---

## 🎉 ¡Todo Listo!

Una vez ejecutadas las migraciones:

1. ✅ La funcionalidad de asignación de **tareas** está 100% operativa
2. ✅ El backend para asignación de **proyectos** está listo
3. ⏳ Falta agregar la UI de asignación en `ProjectModal` (opcional)

**Para ver los cambios:**
- Reinicia tu aplicación (`npm run dev`)
- Ve a **Tasks** → **New Task**
- ¡Verás el selector de usuario!

---

## 📚 Documentación Adicional

- `MIGRATION_INSTRUCTIONS.md` - Instrucciones paso a paso
- `ASSIGNMENT_FEATURE_SUMMARY.md` - Resumen técnico completo
- `components/UserSelector.tsx` - Componente de selector de usuarios

---

**¿Necesitas ayuda?** Revisa los archivos de documentación o verifica que las migraciones se ejecutaron correctamente.
