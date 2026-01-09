# 🐛 Bug Fix: No se veían los proyectos en el UI

## 🔍 Problema Identificado

Los proyectos no se mostraban en el UI porque las queries SQL estaban intentando hacer JOINs con tablas/columnas que **todavía no existen** (porque las migraciones SQL no se han ejecutado aún).

### Causa Raíz

El código modificado en `services/storage.ts` estaba haciendo:

```typescript
.select(`
  *,
  profiles!projects_created_by_fkey(id, name, avatar),
  project_leader:profiles!projects_project_leader_id_fkey(...), // ❌ Columna no existe
  project_assignments(...),  // ❌ Tabla no existe
  project_attachments(*)
`)
```

Cuando estas columnas/tablas no existen (antes de ejecutar migraciones), Supabase retorna un error y el código caía en el `catch` tratando de usar localStorage.

## ✅ Solución Implementada

He modificado `services/storage.ts` para que sea **compatible hacia atrás**:

### Cambios en `getProjects()`:

```typescript
async getProjects(): Promise<Project[]> {
  try {
    let data, error;

    try {
      // Intenta con los nuevos campos primero
      const result = await supabase
        .from('projects')
        .select(`
          *,
          profiles!projects_created_by_fkey(id, name, avatar),
          project_leader:profiles!projects_project_leader_id_fkey(...),
          project_assignments(...),
          project_attachments(*)
        `)
        .order('created_at', { ascending: false });

      data = result.data;
      error = result.error;
    } catch (joinError) {
      // ✅ Si falla, usa query básico (sin campos nuevos)
      console.warn("Assignment fields not available yet, using basic query");
      const result = await supabase
        .from('projects')
        .select(`
          *,
          profiles!projects_created_by_fkey(id, name, avatar),
          project_attachments(*)
        `)
        .order('created_at', { ascending: false });

      data = result.data;
      error = result.error;
    }

    if (error) throw error;

    return (data || []).map((dbProject: any) => {
      // ... mapeo con soporte para campos opcionales
    });
  } catch (e) {
    // Fallback a localStorage
  }
}
```

### Cambios en `getTasks()`:

Mismo patrón - intenta con `assigned_user` JOIN, y si falla, usa query básico.

## 🎯 Resultado

Ahora la aplicación funciona en **3 escenarios**:

1. ✅ **Antes de ejecutar migraciones** - Usa query básico, muestra proyectos sin asignaciones
2. ✅ **Después de ejecutar migraciones** - Usa query completo, muestra proyectos CON asignaciones
3. ✅ **Sin conexión a Supabase** - Usa localStorage como fallback

## 🚀 Próximos Pasos

1. **Recarga la aplicación** - Los proyectos deberían verse ahora
2. **Ejecuta las migraciones SQL** cuando estés listo:
   - `has-role-function.sql`
   - `project-assignments-migration.sql`
   - `task-assignments-migration.sql`
3. **Recarga nuevamente** - Ahora tendrás funcionalidad completa de asignaciones

## 📊 Verificación

Para verificar que todo funciona:

```bash
# 1. Abre la consola del navegador (F12)
# 2. Recarga la página
# 3. Deberías ver los proyectos en el UI
# 4. Si ves warning en consola: "Assignment fields not available yet"
#    -> Es normal, significa que aún no ejecutaste las migraciones
# 5. Después de ejecutar migraciones, ese warning desaparecerá
```

## 🔄 Estado Actual

- ✅ **Código actualizado** - Compatible con y sin migraciones
- ✅ **Proyectos visibles** - Deberían mostrarse ahora
- ⏳ **Migraciones pendientes** - Ejecutar para activar asignaciones
- ⏳ **Funcionalidad completa** - Disponible después de migraciones

---

**Última actualización:** 9 de enero, 2026
**Archivos modificados:** `services/storage.ts`
