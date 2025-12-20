# ✅ Checklist de Configuración Supabase

Usa esta checklist para configurar paso a paso tu integración con Supabase.

---

## 📦 Fase 1: Preparación

- [ ] ✅ Supabase está levantándose en Coolify
- [ ] ✅ Tengo acceso al panel de Supabase
- [ ] ✅ `npm install` ejecutado correctamente
- [ ] ✅ Todos los archivos del proyecto descargados

---

## 🔑 Fase 2: Credenciales

- [ ] He obtenido la **URL de Supabase** desde Coolify
- [ ] He obtenido la **ANON KEY** (clave pública)
- [ ] He editado `.env.local` con mis credenciales reales
- [ ] Las variables empiezan con `VITE_` (importante para Vite)
- [ ] He guardado el archivo `.env.local`

```env
# Tu .env.local debe verse así:
VITE_SUPABASE_URL=https://tu-url-real.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6...
```

---

## 🗄️ Fase 3: Base de Datos

### Schema Principal
- [ ] He abierto el SQL Editor en Supabase
- [ ] He copiado TODO el contenido de `supabase-schema.sql`
- [ ] He ejecutado el script en Supabase
- [ ] He verificado que se crearon 5 tablas:
  - [ ] `profiles`
  - [ ] `projects`
  - [ ] `tasks`
  - [ ] `team_members`
  - [ ] `calendar_events`

### Desactivar Confirmación de Email (Recomendado)
- [ ] He ejecutado `supabase-disable-email-confirmation.sql`
- [ ] He verificado que los usuarios se auto-confirman
- [ ] Ya no necesito verificar emails al registrarme

### Verificar RLS (Row Level Security)
- [ ] He ido a **Authentication → Policies** en Supabase
- [ ] Veo políticas (policies) para cada tabla
- [ ] RLS está habilitado (enabled) en todas las tablas

### Datos de Ejemplo (Opcional)
- [ ] He ejecutado `supabase-seed-data.sql` (OPCIONAL)
- [ ] Veo datos de ejemplo en Table Editor (OPCIONAL)

---

## 🚀 Fase 4: Ejecutar la App

- [ ] He ejecutado `npm run dev`
- [ ] El servidor inició sin errores
- [ ] He abierto http://localhost:3000 en el navegador
- [ ] Veo la página de login

### Verificar Conexión
- [ ] He abierto DevTools (F12) → Console
- [ ] Veo el mensaje: `✅ Supabase connected successfully`
- [ ] NO veo errores de "credentials missing" o "connection failed"

---

## 👤 Fase 5: Crear Primera Cuenta

### Opción A: Sign Up en la App
- [ ] He hecho clic en **"Sign Up"**
- [ ] He completado el formulario:
  - [ ] Name
  - [ ] Email
  - [ ] Password (mínimo 6 caracteres)
  - [ ] Role: **Admin** seleccionado
- [ ] He recibido email de verificación
- [ ] He confirmado mi email
- [ ] Puedo hacer Sign In

### Opción B: Crear Usuario en Supabase Dashboard
- [ ] He ido a **Authentication → Users → Add User**
- [ ] He completado:
  - [ ] Email
  - [ ] Password
  - [ ] ✅ **Auto Confirm User** (MARCADO)
- [ ] El usuario fue creado
- [ ] Puedo hacer Sign In en la app

### Verificar Perfil
- [ ] He ido a **Table Editor → profiles**
- [ ] Veo mi usuario con:
  - [ ] Email correcto
  - [ ] Role: Admin
  - [ ] ID correcto (UUID)

---

## 🧪 Fase 6: Testing

### Test Básico
- [ ] He hecho login exitosamente
- [ ] Veo el dashboard principal
- [ ] Mi nombre aparece en el header
- [ ] Mi rol aparece (badge "ADMIN")

### Test de Proyectos
- [ ] He ido a **Projects** en el menú lateral
- [ ] He hecho clic en **New Project**
- [ ] He completado el formulario
- [ ] El proyecto se guardó sin errores
- [ ] Veo el proyecto en la lista

### Verificar en Supabase
- [ ] He ido a **Table Editor → projects** en Supabase
- [ ] Veo el proyecto que acabo de crear
- [ ] El campo `created_by` tiene mi UUID
- [ ] La fecha `created_at` es correcta

### Test de Tareas
- [ ] He ido a **Tasks** en el menú
- [ ] He creado una nueva tarea
- [ ] La tarea aparece en la lista
- [ ] Puedo cambiar su estado (Todo → In Progress → Done)

### Test de Calendario
- [ ] He ido a **Calendar**
- [ ] He creado un nuevo evento
- [ ] El evento aparece en el calendario
- [ ] La notificación aparece si es para hoy

---

## 🔒 Fase 7: Permisos

### Test de Roles
- [ ] He creado un usuario con role "Viewer" (en Supabase o via Sign Up)
- [ ] He hecho login como Viewer
- [ ] NO puedo crear proyectos (botón oculto)
- [ ] Puedo VER proyectos existentes
- [ ] Los datos se muestran correctamente

### Cambiar Role
- [ ] He ido a **Table Editor → profiles**
- [ ] He cambiado mi role de Viewer a Admin
- [ ] He recargado la app
- [ ] Ahora SÍ puedo crear proyectos

---

## 📊 Fase 8: Datos

### Si usaste Seed Data
- [ ] Veo 5 proyectos de ejemplo
- [ ] Veo 8 tareas de ejemplo
- [ ] Veo 6 miembros de equipo
- [ ] Veo 8 eventos en calendario
- [ ] Los KPIs muestran datos correctos

### Si empiezas sin datos
- [ ] Los KPIs muestran 0 correctamente
- [ ] Veo mensajes de "No data" en gráficos
- [ ] Puedo crear mi primer proyecto
- [ ] Los KPIs se actualizan al crear datos

---

## 🌐 Fase 9: Modo Offline

### Test de Fallback
- [ ] He detenido Supabase (o desconectado internet)
- [ ] La app sigue funcionando
- [ ] Veo mensaje "Offline Mode" en console
- [ ] Puedo crear proyectos (se guardan en localStorage)
- [ ] He reiniciado Supabase
- [ ] Los datos se muestran correctamente

---

## 🎨 Fase 10: UX/UI

- [ ] Las notificaciones aparecen al crear/editar/eliminar
- [ ] Los toasts desaparecen automáticamente
- [ ] Los modales se abren y cierran correctamente
- [ ] La navegación funciona (sidebar)
- [ ] El responsive funciona en móvil
- [ ] Los loading states se muestran
- [ ] Los errores se muestran claramente

---

## 🔧 Troubleshooting Realizado

Si tuviste problemas, marca los que resolviste:

- [ ] ❌ "Supabase credentials missing" → Reinicié npm run dev
- [ ] ❌ "Failed to fetch" → Verifiqué URL de Supabase
- [ ] ❌ "Invalid API key" → Usé ANON key (no service key)
- [ ] ❌ No puedo crear proyectos → Cambié role a Admin
- [ ] ❌ RLS Policy Error → Re-ejecuté el schema SQL
- [ ] ❌ Email no verificado → Usé Auto Confirm User
- [ ] ❌ Tipos de TypeScript → Ya están solucionados en el proyecto

---

## 📚 Documentación Consultada

Marca lo que revisaste:

- [ ] `IMPLEMENTACION_COMPLETA.md` - Resumen general
- [ ] `SUPABASE_QUICKSTART.md` - Inicio rápido
- [ ] `SUPABASE_SETUP.md` - Guía completa
- [ ] `CHANGELOG_SUPABASE.md` - Qué cambió
- [ ] `.env.example` - Template de variables
- [ ] `supabase-schema.sql` - Schema de DB
- [ ] `supabase-seed-data.sql` - Datos de ejemplo

---

## 🎯 Próximos Pasos

Una vez que TODO lo anterior funciona:

- [ ] Configurar email templates en Supabase
- [ ] Habilitar Supabase Storage para avatares
- [ ] Activar Realtime para sync automático
- [ ] Configurar backup automático
- [ ] Deploy a producción (Vercel/Netlify)
- [ ] Configurar dominio personalizado
- [ ] Agregar analytics
- [ ] Implementar tests automatizados

---

## ✅ Estado Final

### Marcar cuando TODO esté completo:

- [ ] ✨ **CONFIGURACIÓN 100% COMPLETA**
  - [ ] Supabase conectado
  - [ ] Auth funcionando
  - [ ] CRUD de proyectos OK
  - [ ] CRUD de tareas OK
  - [ ] Permisos verificados
  - [ ] UI responsiva
  - [ ] Sin errores en console

---

## 📞 Si Necesitas Ayuda

1. ✅ Revisa `SUPABASE_SETUP.md` → Sección Troubleshooting
2. ✅ Ejecuta `./check-setup.sh` para verificar configuración
3. ✅ Revisa logs en DevTools Console (F12)
4. ✅ Revisa logs en Supabase Dashboard
5. ✅ Verifica que todas las tablas existen en Table Editor

---

**Fecha:** ________  
**Estado:** [ ] En Progreso | [ ] Completado  
**Notas:** _______________________________________________

---

**¡Éxito! 🎉** Una vez que todas las casillas estén marcadas, tu app está 100% funcional con Supabase.
