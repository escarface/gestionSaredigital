# ✅ Checklist - Implementación de Asignaciones

## 📝 Lista de Tareas para Activar la Funcionalidad

Sigue estos pasos **en orden** para activar el sistema de asignación de tareas y proyectos.

---

### 1️⃣ Ejecutar Migraciones SQL en Supabase

#### Paso 1: Abrir Supabase SQL Editor
- [ ] Ve a https://supabase.com
- [ ] Abre tu proyecto: **gestión-pro-dashboard**
- [ ] Haz clic en **SQL Editor** en el menú lateral

#### Paso 2: Ejecutar `has-role-function.sql`
- [ ] Abre el archivo `has-role-function.sql` en tu editor de código
- [ ] Copia todo el contenido
- [ ] Pégalo en el SQL Editor de Supabase
- [ ] Haz clic en **Run** (o presiona Cmd/Ctrl + Enter)
- [ ] Verifica que dice: "Success. No rows returned"

#### Paso 3: Ejecutar `project-assignments-migration.sql`
- [ ] Abre el archivo `project-assignments-migration.sql`
- [ ] Copia todo el contenido
- [ ] Pégalo en el SQL Editor de Supabase
- [ ] Haz clic en **Run**
- [ ] Verifica que dice: "Success. No rows returned"

#### Paso 4: Ejecutar `task-assignments-migration.sql`
- [ ] Abre el archivo `task-assignments-migration.sql`
- [ ] Copia todo el contenido
- [ ] Pégalo en el SQL Editor de Supabase
- [ ] Haz clic en **Run**
- [ ] Verifica que dice: "Success. No rows returned"

---

### 2️⃣ Verificar que las Migraciones Funcionaron

#### Opción A: Ejecutar Script de Verificación
- [ ] Abre el archivo `verify-assignments-migration.sql`
- [ ] Copia todo el contenido
- [ ] Pégalo en el SQL Editor de Supabase
- [ ] Haz clic en **Run**
- [ ] **Verifica que todos los tests muestran ✅ PASS**

#### Opción B: Verificación Manual
- [ ] Ejecuta este query en Supabase:
  ```sql
  SELECT column_name FROM information_schema.columns
  WHERE table_name = 'projects' AND column_name = 'project_leader_id';
  ```
  **Debe retornar 1 fila**

- [ ] Ejecuta:
  ```sql
  SELECT * FROM project_assignments LIMIT 1;
  ```
  **No debe dar error (puede retornar 0 filas)**

- [ ] Ejecuta:
  ```sql
  SELECT column_name FROM information_schema.columns
  WHERE table_name = 'tasks' AND column_name = 'assigned_to';
  ```
  **Debe retornar 1 fila**

---

### 3️⃣ Verificar que hay Usuarios en la Base de Datos

- [ ] Ejecuta en Supabase:
  ```sql
  SELECT id, name, email, role FROM public.profiles;
  ```
- [ ] **Debe retornar al menos 1 usuario**
- [ ] Si está vacío, necesitas crear usuarios primero en la app

---

### 4️⃣ Reiniciar la Aplicación

- [ ] En la terminal, detén el servidor (Ctrl + C)
- [ ] Ejecuta: `npm run dev`
- [ ] Espera a que el servidor inicie
- [ ] Abre la aplicación en el navegador
- [ ] Haz **hard refresh** (Cmd + Shift + R en Mac, Ctrl + Shift + R en Windows)

**✅ BUGFIX APLICADO:** La app ahora funciona ANTES y DESPUÉS de ejecutar las migraciones SQL. Los proyectos deberían verse correctamente incluso sin ejecutar las migraciones. Ver `BUGFIX_NO_PROJECTS.md` para detalles.

---

### 5️⃣ Probar la Funcionalidad de Tareas

#### Crear Tarea con Asignación
- [ ] Ve a la página **Tasks** en la app
- [ ] Haz clic en **"+ New Task"**
- [ ] **Verifica que aparece el campo "Assigned To"** ⭐
- [ ] Haz clic en el selector "Assigned To"
- [ ] **Verifica que aparece un dropdown con usuarios**
- [ ] Selecciona un usuario
- [ ] Completa el resto del formulario (título, proyecto, etc.)
- [ ] Haz clic en **"Create Task"**
- [ ] **Verifica que la tarea se crea sin errores**

#### Ver Tarea Asignada
- [ ] Haz clic en la tarea que acabas de crear
- [ ] Se abre el panel lateral de detalles
- [ ] **Verifica que aparece la sección "Assigned To"**
- [ ] **Verifica que muestra el nombre y rol del usuario**
- [ ] **Verifica que muestra el avatar del usuario**

---

### 6️⃣ Verificar la Consola del Navegador

- [ ] Abre DevTools (F12 o Cmd/Ctrl + Shift + I)
- [ ] Ve a la pestaña **Console**
- [ ] Recarga la página
- [ ] **No debe haber errores rojos relacionados con "profiles" o "assigned"**
- [ ] Verifica que dice: "Supabase Realtime connected" ✅

---

### 7️⃣ Verificar Actualización en Tiempo Real

- [ ] Con la app abierta, ve a Supabase Dashboard
- [ ] Abre **Table Editor** → tabla **tasks**
- [ ] Selecciona una tarea
- [ ] Cambia el campo `assigned_to` a otro usuario ID
- [ ] Guarda el cambio
- [ ] **Vuelve a la app (sin recargar)**
- [ ] **Verifica que la tarea se actualiza automáticamente** 🔄

---

## 🎯 Resultados Esperados

Si todo está correcto, deberías poder:

✅ Ver el selector "Assigned To" al crear/editar tareas
✅ Seleccionar usuarios del dropdown
✅ Ver el nombre y avatar del usuario en los detalles de la tarea
✅ Las asignaciones persisten en la base de datos
✅ Cambios en tiempo real funcionan

---

## ❌ Solución de Problemas

### No veo el selector "Assigned To"
**Posibles causas:**
1. ❌ No ejecutaste las migraciones SQL
2. ❌ No recargaste la página después de las migraciones
3. ❌ Hay un error en la consola del navegador

**Solución:**
1. Ejecuta `verify-assignments-migration.sql`
2. Haz hard refresh (Cmd/Ctrl + Shift + R)
3. Revisa la consola del navegador

### El dropdown está vacío
**Posibles causas:**
1. ❌ No hay usuarios en la tabla `profiles`
2. ❌ Error en la query de perfiles

**Solución:**
1. Ejecuta: `SELECT * FROM profiles;` en Supabase
2. Si está vacío, crea usuarios desde la app
3. Revisa la consola del navegador para errores

### Error: "foreign key constraint"
**Posibles causas:**
1. ❌ El user_id no existe en `profiles`

**Solución:**
1. Verifica que el usuario existe: `SELECT id FROM profiles WHERE id = 'xxx';`
2. Usa solo IDs de usuarios existentes

### Error: "permission denied"
**Posibles causas:**
1. ❌ RLS policies no se aplicaron correctamente
2. ❌ El usuario no tiene rol Admin/Editor

**Solución:**
1. Verifica tu rol: `SELECT role FROM profiles WHERE id = auth.uid();`
2. Re-ejecuta `project-assignments-migration.sql`

---

## 📊 Estado Actual del Proyecto

### ✅ Implementado y Funcionando:
- [x] Migraciones SQL creadas
- [x] Backend completo (storage service)
- [x] Context actualizado (AppContext)
- [x] Componente UserSelector
- [x] UI de asignación en Tasks
- [x] Visualización de usuario asignado
- [x] Realtime updates

### ⏳ Pendiente (Opcional):
- [ ] UI de asignación en ProjectModal
- [ ] Visualización de líder de proyecto en ProjectCard
- [ ] Filtros "Mis Tareas" / "Mis Proyectos"
- [ ] Dashboard de carga de trabajo

---

## 📚 Archivos de Referencia

- `README_ASSIGNMENT_FEATURE.md` - Guía completa
- `MIGRATION_INSTRUCTIONS.md` - Instrucciones de migración
- `ASSIGNMENT_FEATURE_SUMMARY.md` - Resumen técnico
- `verify-assignments-migration.sql` - Script de verificación

---

## ✨ ¡Listo para Usar!

Una vez completados todos los checkboxes, la funcionalidad de asignación de tareas está **100% operativa**.

**¡Disfruta de tu nuevo sistema de asignaciones! 🎉**
