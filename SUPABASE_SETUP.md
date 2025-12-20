# 🚀 Guía de Configuración: Gestión Pro + Supabase

## 📋 Tabla de Contenidos
1. [Configuración de Supabase en Coolify](#configuración-de-supabase-en-coolify)
2. [Configuración del Proyecto](#configuración-del-proyecto)
3. [Migración de Datos](#migración-de-datos)
4. [Ejecución](#ejecución)
5. [Troubleshooting](#troubleshooting)

---

## 🔧 Configuración de Supabase en Coolify

### 1. Accede a tu instancia de Supabase en Coolify

Una vez que Supabase esté levantado en Coolify, necesitarás obtener:

- **URL de Supabase**: La URL pública de tu instancia
- **Anon Key**: La clave pública (anon/public key)

### 2. Ejecutar el Schema SQL

1. Accede al **SQL Editor** de tu Supabase (usualmente en `https://tu-supabase-url/project/default/sql`)
2. Copia todo el contenido del archivo `supabase-schema.sql`
3. Pégalo en el editor SQL y ejecuta (Run)
4. Verifica que se crearon todas las tablas:
   - `profiles`
   - `projects`
   - `tasks`
   - `team_members`
   - `calendar_events`

### 3. Verificar RLS (Row Level Security)

- Ve a **Authentication > Policies**
- Deberías ver políticas para cada tabla
- Asegúrate de que RLS está habilitado (enabled) en todas las tablas

---

## ⚙️ Configuración del Proyecto

### 1. Configurar Variables de Entorno

Edita el archivo `.env.local` en la raíz del proyecto:

```env
# Reemplaza con tus credenciales de Coolify/Supabase
VITE_SUPABASE_URL=https://tu-supabase-instance.coolify.app
VITE_SUPABASE_ANON_KEY=tu-clave-anon-aqui
```

**¿Dónde encuentro estas credenciales?**

1. **Coolify Dashboard** → Tu instancia de Supabase → Settings → API
2. O en Supabase directo: Settings → API → Project URL y anon/public key

### 2. Instalar Dependencias (ya hecho)

```bash
npm install
```

---

## 📦 Migración de Datos (Opcional)

Si ya tienes datos en `localStorage`, puedes migrarlos a Supabase.

### Opción 1: Migración Manual via UI

1. Inicia sesión en la app
2. Los datos existentes en `localStorage` se mantendrán como fallback
3. Crea nuevos proyectos/tareas → se guardarán en Supabase automáticamente

### Opción 2: Script de Migración

(Próximamente: script automático para migrar localStorage → Supabase)

---

## 🚀 Ejecución

### Desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000`

### Producción

```bash
npm run build
npm run preview
```

---

## 🔐 Crear tu Primera Cuenta

### Opción A: Sign Up via UI

1. Ve a la página de login
2. Haz clic en **Sign Up**
3. Completa:
   - **Name**: Tu nombre completo
   - **Email**: Tu email
   - **Password**: Mínimo 6 caracteres
   - **Role**: Admin (para tener acceso completo)
4. **Importante**: Recibirás un email de verificación
   - Revisa tu bandeja de entrada
   - Haz clic en el link de confirmación
   - Luego podrás hacer Sign In

### Opción B: Crear Usuario Admin Directamente en Supabase

Si no tienes configurado el servicio de email, puedes crear usuarios directamente:

1. Ve a **Authentication > Users** en tu Supabase Dashboard
2. Haz clic en **Add User**
3. Completa:
   - Email
   - Password
   - Auto Confirm User: **✅ Activado**
   - Metadata (opcional):
     ```json
     {
       "name": "Tu Nombre",
       "role": "Admin"
     }
     ```
4. El trigger automático creará el perfil en la tabla `profiles`

### Opción C: Modo Guest (Demo)

- Haz clic en **Continue as Guest**
- Tendrás acceso de solo lectura (role: Viewer)
- Los datos se guardan en localStorage (no en Supabase)

---

## 🛠️ Troubleshooting

### ❌ Error: "Supabase credentials missing"

**Solución:**
1. Verifica que `.env.local` existe
2. Asegúrate de que las variables empiezan con `VITE_`
3. Reinicia el servidor de desarrollo (`npm run dev`)

### ❌ Error: "Failed to fetch" o timeout

**Posibles causas:**
1. **Supabase no está accesible**: Verifica que tu instancia en Coolify está corriendo
2. **URL incorrecta**: Revisa la URL en `.env.local`
3. **Firewall**: Asegúrate de que el puerto está abierto

**Solución temporal:**
- La app funcionará con `localStorage` como fallback
- Los datos se sincronizarán cuando Supabase esté disponible

### ❌ Error: "Invalid API key"

**Solución:**
- Verifica que copiaste la **anon key** (no la service key)
- Debe ser la clave **pública**, no la privada

### ❌ No puedo crear proyectos (Viewer role)

**Solución:**
1. Ve a **Supabase Dashboard → Table Editor → profiles**
2. Encuentra tu usuario
3. Cambia el campo `role` a `Editor` o `Admin`
4. Recarga la app

### ❌ RLS Policy Error

**Solución:**
1. Verifica que ejecutaste TODO el schema SQL
2. Ve a **Authentication → Policies**
3. Asegúrate de que existen políticas para tu rol
4. Si no: Re-ejecuta la parte de RLS del schema

---

## 📊 Verificar Conexión

### Test de Conexión

1. Abre las **DevTools del navegador** (F12)
2. Ve a la pestaña **Console**
3. Deberías ver:
   ```
   ✅ Supabase connected successfully
   ```

Si ves:
```
❌ Supabase connection failed
```

Revisa los pasos de troubleshooting arriba.

---

## 🎯 Estructura de Datos

### Tablas Creadas

| Tabla | Descripción | RLS |
|-------|-------------|-----|
| `profiles` | Perfiles de usuario (extends auth.users) | ✅ |
| `projects` | Proyectos con progreso y estados | ✅ |
| `tasks` | Tareas asignadas a proyectos | ✅ |
| `team_members` | Directorio de equipo | ✅ |
| `calendar_events` | Eventos y reuniones | ✅ |

### Roles y Permisos

| Rol | Proyectos | Tareas | Team | Eventos |
|-----|-----------|--------|------|---------|
| **Admin** | ✅ CRUD | ✅ CRUD | ✅ CRUD | ✅ CRUD |
| **Editor** | ✅ Create/Update | ✅ CRUD | ❌ Read only | ✅ CRUD |
| **Viewer** | 👁️ Read only | 👁️ Read only | 👁️ Read only | 👁️ Read only |

---

## 🔄 Actualizar desde localStorage a Supabase

El sistema tiene **fallback automático**:

- Si Supabase está disponible → usa Supabase
- Si falla → usa localStorage

Esto significa que puedes desarrollar offline y los datos se sincronizarán cuando Supabase esté disponible.

---

## 📝 Próximos Pasos

- [ ] Configurar email templates en Supabase (para verificación de cuentas)
- [ ] Implementar Storage para avatares (subir imágenes)
- [ ] Habilitar Realtime (sync automático entre usuarios)
- [ ] Agregar logging y analytics
- [ ] Configurar backups automáticos

---

## 🆘 Soporte

Si tienes problemas:

1. Revisa los logs en la consola del navegador
2. Verifica los logs de Supabase en Coolify
3. Comprueba que las tablas existen en **Table Editor**
4. Verifica que RLS está configurado correctamente

---

## ✅ Checklist de Configuración

- [ ] Supabase levantado en Coolify
- [ ] Schema SQL ejecutado exitosamente
- [ ] Tablas creadas (5 tablas)
- [ ] RLS habilitado en todas las tablas
- [ ] `.env.local` configurado con URL y ANON_KEY
- [ ] Dependencias instaladas (`npm install`)
- [ ] Test de conexión exitoso (✅ en consola)
- [ ] Primera cuenta creada (Admin)
- [ ] Login funcional
- [ ] Proyectos creables

---

¡Listo! 🎉 Tu instancia de Gestión Pro está conectada a Supabase.
