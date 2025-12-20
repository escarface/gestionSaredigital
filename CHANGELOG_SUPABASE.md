# 📝 Changelog - Integración de Supabase

## Versión 2.0.0 - Backend Implementation (20 Diciembre 2025)

### 🎉 Nueva Funcionalidad: Backend con Supabase

Se ha implementado un backend completo usando Supabase self-hosted en Coolify, reemplazando el sistema anterior basado en localStorage.

---

### ✨ Nuevas Características

#### 🔐 Autenticación Real
- **Antes**: localStorage simulado, inseguro
- **Ahora**: Supabase Auth con JWT tokens
- Sign Up con verificación de email
- Sign In con sesiones persistentes
- Sign Out seguro
- Modo Guest para demo (sin backend)

#### 💾 Base de Datos PostgreSQL
- 5 tablas relacionales con constraints
- Row Level Security (RLS) implementado
- Triggers automáticos para timestamps
- Índices para optimización de queries
- Función automática para crear perfiles en signup

#### 🔒 Sistema de Permisos
- **Admin**: Acceso completo a todo
- **Editor**: Puede crear/editar proyectos y tareas
- **Viewer**: Solo lectura
- Permisos a nivel de base de datos (no solo frontend)

#### 🌐 Arquitectura Híbrida
- **Modo Online**: Usa Supabase cuando está disponible
- **Modo Offline**: Fallback a localStorage automático
- Sincronización transparente
- Sin cambios en la UX

---

### 📦 Dependencias Nuevas

```json
{
  "@supabase/supabase-js": "^2.x" // Cliente oficial de Supabase
}
```

---

### 📁 Archivos Creados

#### Servicios
- `services/supabase.ts` - Cliente de Supabase configurado
- `types/supabase.ts` - Tipos TypeScript auto-generados

#### SQL
- `supabase-schema.sql` - Schema completo de la base de datos
- `supabase-seed-data.sql` - Datos de ejemplo para testing

#### Documentación
- `SUPABASE_SETUP.md` - Guía completa de configuración
- `SUPABASE_QUICKSTART.md` - Guía rápida de inicio
- `CHANGELOG_SUPABASE.md` - Este archivo

#### Configuración
- `.env.example` - Template de variables de entorno
- `vite-env.d.ts` - Tipos para variables de entorno

---

### 🔧 Archivos Modificados

#### `services/storage.ts`
**Cambios principales:**
- Métodos actualizados para usar Supabase client
- Mappers para convertir datos DB → App
- Fallback automático a localStorage
- Manejo de errores mejorado

**Antes:**
```typescript
async getProjects() {
  return await this.request('/projects'); // API REST inexistente
}
```

**Ahora:**
```typescript
async getProjects() {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*');
    if (error) throw error;
    return data.map(this.mapProject);
  } catch (e) {
    // Fallback a localStorage
  }
}
```

#### `context/AuthContext.tsx`
**Cambios principales:**
- Integración con Supabase Auth
- Métodos `signInWithEmail()` y `signUpWithEmail()`
- Listener de cambios de sesión
- Auto-carga de perfiles desde la tabla `profiles`
- Soporte para metadata de usuarios

**Antes:**
```typescript
const signOut = async () => {
  localStorage.removeItem('user');
};
```

**Ahora:**
```typescript
const signOut = async () => {
  await supabase.auth.signOut();
  setUser(null);
};
```

#### `components/AuthPage.tsx`
**Cambios principales:**
- Formulario completo de Sign Up con nombre y role
- Validación de emails duplicados
- Mensajes de éxito/error mejorados
- Integración con Supabase Auth
- Botón de "Continue as Guest" mantenido

**Nuevo:**
- Campo "Name" en registro
- Selector de "Role" (Admin/Editor/Viewer)
- Mensaje de verificación de email
- Estados de loading/error/success

#### `tsconfig.json`
**Cambios:**
```json
"types": ["node", "vite/client"] // Añadido soporte para Vite
```

#### `.env.local`
**Nuevas variables:**
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

---

### 🗃️ Estructura de Base de Datos

#### Tabla: `profiles`
Extiende `auth.users` con información adicional:
- `id` (UUID) - FK a auth.users
- `name` (TEXT)
- `email` (TEXT)
- `avatar` (TEXT) - URL del avatar
- `role` (ENUM) - Admin | Editor | Viewer
- `created_at`, `updated_at`

#### Tabla: `projects`
- `id` (UUID)
- `name`, `client`, `description`
- `progress` (0-100)
- `status` (In Progress | Review | Planning | Completed)
- `members` (TEXT[]) - Array de URLs de avatares
- `due_date` (DATE)
- `created_by` (UUID) - FK a profiles

#### Tabla: `tasks`
- `id` (UUID)
- `title`, `description`
- `project` (TEXT) - Nombre del proyecto
- `priority` (High | Medium | Low)
- `status` (Todo | In Progress | Done)
- `due_date` (DATE)
- `assignee` (TEXT)

#### Tabla: `team_members`
- `id` (UUID)
- `name`, `role`, `email`
- `avatar` (TEXT)
- `status` (Online | Offline | Busy)

#### Tabla: `calendar_events`
- `id` (UUID)
- `title`, `date`, `time`
- `type` (Meeting | Deadline | Review)
- `created_by` (UUID)

---

### 🔐 Row Level Security (RLS)

Todas las tablas tienen RLS habilitado con políticas basadas en roles:

#### Profiles
- ✅ Todos pueden leer todos los perfiles
- ✅ Usuarios pueden actualizar su propio perfil
- ✅ Admins pueden actualizar cualquier perfil

#### Projects
- ✅ Todos pueden leer
- ✅ Admins y Editors pueden crear/actualizar
- ✅ Solo Admins pueden eliminar

#### Tasks
- ✅ Todos pueden leer
- ✅ Admins y Editors pueden crear/actualizar/eliminar

#### Team Members
- ✅ Todos pueden leer
- ✅ Solo Admins pueden crear/actualizar/eliminar

#### Calendar Events
- ✅ Todos pueden leer
- ✅ Admins y Editors pueden crear/actualizar/eliminar

---

### 🚀 Mejoras de Rendimiento

- Índices en columnas frecuentemente consultadas:
  - `projects.status`
  - `projects.due_date`
  - `tasks.status`
  - `tasks.priority`
  - `calendar_events.date`

- Triggers automáticos para `updated_at`
- Queries optimizadas con `.select('*')` específicas

---

### 🛡️ Seguridad

#### Implementado
✅ JWT tokens con auto-refresh
✅ Row Level Security a nivel de DB
✅ Passwords hasheados (Supabase bcrypt)
✅ Validación de email obligatoria
✅ CORS configurado en Supabase
✅ HTTPS en producción (Coolify)
✅ Variables de entorno para credenciales

#### Mejoras vs. Versión Anterior
- ❌ **Antes**: Passwords en localStorage (plain text)
- ✅ **Ahora**: Passwords hasheados en PostgreSQL
- ❌ **Antes**: Sin validación de sesión
- ✅ **Ahora**: JWT con expiración automática
- ❌ **Antes**: Permisos solo en frontend
- ✅ **Ahora**: Permisos a nivel de base de datos

---

### 🐛 Bugs Corregidos

1. **AuthContext**: Se removió el hardcoded user (axierlu@gmail.com)
2. **Storage**: API REST inexistente eliminada
3. **Firebase**: Archivo deprecado marcado correctamente
4. **TypeScript**: Errores de `import.meta.env` solucionados

---

### 📊 Métricas

#### Antes (v1.0)
- **Backend**: ❌ Ninguno (solo localStorage)
- **Auth**: ❌ Simulada
- **Permisos**: ⚠️ Solo frontend
- **Persistencia**: ⚠️ Solo navegador
- **Multi-usuario**: ❌ No soportado

#### Ahora (v2.0)
- **Backend**: ✅ Supabase PostgreSQL
- **Auth**: ✅ Real con JWT
- **Permisos**: ✅ Row Level Security
- **Persistencia**: ✅ Base de datos real
- **Multi-usuario**: ✅ Completamente soportado

---

### 🔄 Breaking Changes

#### Variables de Entorno
**Requerido**: Debes configurar `.env.local` con:
```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

#### Datos Existentes
- Los datos de `localStorage` se mantienen como fallback
- Para migrar a Supabase: crea nuevos datos desde la UI
- O ejecuta `supabase-seed-data.sql` para datos de ejemplo

#### Autenticación
- Ya no funciona el login con `axierlu@gmail.com`
- Debes crear una cuenta real vía Sign Up
- O crear usuario en Supabase Dashboard

---

### 📚 Documentación

Toda la documentación está disponible en:
- `SUPABASE_SETUP.md` - Guía completa paso a paso
- `SUPABASE_QUICKSTART.md` - Inicio rápido
- `README.md` - (Pendiente de actualizar)

---

### 🎯 Próximos Pasos Recomendados

1. ✅ **Backend completado** - Implementado
2. ⏳ **Email templates** - Configurar en Supabase
3. ⏳ **Storage para avatares** - Usar Supabase Storage
4. ⏳ **Realtime sync** - Habilitar subscriptions
5. ⏳ **Tests automatizados** - Vitest + React Testing Library
6. ⏳ **CI/CD** - GitHub Actions
7. ⏳ **Deploy a producción** - Vercel/Netlify

---

### 🙏 Créditos

- **Supabase**: https://supabase.com
- **Coolify**: https://coolify.io
- **React + TypeScript**: Mantiene la base sólida del proyecto

---

### 📞 Soporte

Para problemas o dudas:
1. Revisa `SUPABASE_SETUP.md` (sección Troubleshooting)
2. Verifica logs en DevTools Console
3. Consulta logs de Supabase en Coolify

---

**Versión**: 2.0.0  
**Fecha**: 20 Diciembre 2025  
**Estado**: ✅ Producción lista (requiere configuración)
