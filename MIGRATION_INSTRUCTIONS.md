# Instrucciones de Migración - Sistema de Asignaciones

## ⚠️ IMPORTANTE: Ejecuta estos scripts en tu Supabase SQL Editor

Para que la funcionalidad de asignación de tareas y proyectos funcione, debes ejecutar los siguientes scripts SQL en orden en tu Supabase SQL Editor.

### Paso 1: Crear función `has_role`

Ejecuta el contenido del archivo: `has-role-function.sql`

```sql
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

### Paso 2: Crear tablas y columnas para asignaciones de proyectos

Ejecuta el contenido del archivo: `project-assignments-migration.sql`

Este script:
- Agrega columna `project_leader_id` a la tabla `projects`
- Crea tabla `project_assignments` para asignaciones many-to-many
- Crea índices y políticas RLS
- Habilita suscripciones en tiempo real

**Nota**: Este script requiere que la función `handle_updated_at()` ya exista (está en el schema inicial).

### Paso 3: Agregar columna de asignación a tareas

Ejecuta el contenido del archivo: `task-assignments-migration.sql`

```sql
ALTER TABLE public.tasks
ADD COLUMN IF NOT EXISTS assigned_to uuid REFERENCES public.profiles(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON public.tasks(assigned_to);
```

## Cómo Ejecutar

1. Ve a tu proyecto en Supabase
2. Abre el **SQL Editor**
3. Copia y pega cada script en orden (1, 2, 3)
4. Haz clic en **Run** para cada uno

## Verificar que funcionó

Después de ejecutar las migraciones, verifica que:

```sql
-- Verificar que la función existe
SELECT public.has_role(auth.uid(), 'Admin');

-- Verificar nuevas columnas en projects
SELECT column_name FROM information_schema.columns
WHERE table_name = 'projects' AND column_name = 'project_leader_id';

-- Verificar tabla project_assignments
SELECT * FROM project_assignments LIMIT 1;

-- Verificar nueva columna en tasks
SELECT column_name FROM information_schema.columns
WHERE table_name = 'tasks' AND column_name = 'assigned_to';
```

## ¿Qué hace esto?

### Para Proyectos:
- Ahora puedes asignar un **líder de proyecto** (un usuario específico)
- Puedes asignar múltiples **miembros del equipo** al proyecto
- Las asignaciones se relacionan con usuarios reales de la tabla `profiles`

### Para Tareas:
- Ahora puedes asignar una tarea a un **usuario específico** (no solo un avatar)
- La asignación se guarda con el ID del usuario
- Mantiene compatibilidad con el campo antiguo `assignee`

## Próximos Pasos

Una vez ejecutadas las migraciones:
1. Reinicia tu aplicación
2. Ve a la página de **Projects**
3. Edita un proyecto y verás la nueva pestaña **"Team"**
4. Ahí podrás asignar líder de proyecto y miembros
5. Al crear/editar **tareas**, verás un selector para asignar usuarios

## Problemas Comunes

### Error: "function has_role does not exist"
- Asegúrate de ejecutar el Paso 1 primero

### Error: "column project_leader_id already exists"
- Ya ejecutaste la migración antes, puedes saltarte ese paso

### Error: "permission denied"
- Asegúrate de tener permisos de administrador en Supabase
