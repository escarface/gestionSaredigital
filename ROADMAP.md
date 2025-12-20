# 🎯 ROADMAP - Gestión Pro Dashboard

## Estado Actual
✅ Backend Supabase completamente funcional  
✅ Autenticación implementada  
✅ CRUD completo de todas las entidades  
✅ Row Level Security configurado  
✅ Permisos por rol funcionando  

---

## 📋 PRÓXIMAS FASES DE DESARROLLO

### 📊 **FASE 1: Validación y Estabilidad** (1-2 días)
**Prioridad:** 🔴 ALTA  
**Estado:** ⏳ Pendiente

#### 1.1 Testing Completo
- [ ] Probar todos los CRUDs (crear, editar, eliminar)
  - [X] Proyectos: Create, Read, Update, Delete - ✅ SOLUCIONADO: Cascade delete de tareas implementado
  - [X] Tareas: Create, Read, Update, Delete, cambio de estado - ✅ SOLUCIONADO: Método deleteTask implementado
  - [X] Eventos: Create, Read, Update, Delete
  - [X] Team: Create, Read, Update, Delete - Al borrar un miembro del equipo no se borran sus proyectos ni tareas, ademas de reasignar sus proyectos y tareas a otro miembro del equipo, y notificar al nuevo miembro asignado. El acceso de ese miembro al sistema no se elimina correctamente.
- [ ] Verificar permisos por rol
  - [ ] Admin: debe tener acceso completo
  - [ ] Editor: puede crear/editar pero no eliminar todo
  - [ ] Viewer: solo lectura
- [ ] Test de carga
  - [ ] Crear 50+ proyectos
  - [ ] Crear 100+ tareas
  - [ ] Verificar rendimiento de queries
- [ ] Probar modo offline
  - [ ] Desconectar Supabase
  - [ ] Verificar fallback a localStorage
  - [ ] Reconectar y verificar sincronización

#### 1.2 Manejo de Errores
- [ ] Mejorar mensajes de error (más descriptivos)
  - [ ] Errores de red
  - [ ] Errores de validación
  - [ ] Errores de permisos
- [ ] Añadir validación de formularios
  - [ ] Validar campos requeridos
  - [ ] Validar formatos (email, fechas)
  - [ ] Validar longitudes máximas/mínimas
- [ ] Handling de estados de carga
  - [ ] Spinners/loaders consistentes
  - [ ] Skeleton screens
  - [ ] Disable buttons durante operaciones
- [ ] Recuperación de errores de red
  - [ ] Retry automático (con backoff)
  - [ ] Mensajes claros al usuario
  - [ ] Opciones de reintentar manualmente

**Tiempo estimado:** 1-2 días  
**Dependencias:** Ninguna

---

### 🚀 **FASE 2: Funcionalidades Core Faltantes** (2-3 días)
**Prioridad:** 🔴 ALTA  
**Estado:** ⏳ Pendiente

#### 2.1 Búsqueda Real
**Archivos a modificar:** `App.tsx`, nuevo componente `SearchBar.tsx`

- [ ] Implementar búsqueda global en header
  - [ ] Diseñar componente de búsqueda
  - [ ] Crear índice de búsqueda (proyectos + tareas + equipo)
  - [ ] Implementar debounce (300ms)
  - [ ] Mostrar resultados en dropdown
- [ ] Búsqueda de proyectos
  - [ ] Por nombre
  - [ ] Por cliente
  - [ ] Por estado
- [ ] Búsqueda de tareas
  - [ ] Por título
  - [ ] Por proyecto asignado
  - [ ] Por assignee
- [ ] Búsqueda de miembros de equipo
  - [ ] Por nombre
  - [ ] Por rol
  - [ ] Por email
- [ ] Features avanzadas
  - [ ] Highlight de términos encontrados
  - [ ] Navegación con teclado (↑↓ Enter)
  - [ ] Recent searches
  - [ ] Clear search

#### 2.2 Funcionalidades Pendientes

**A) Hours Spent - Sistema de Tracking de Tiempo**
- [ ] Crear tabla `time_entries` en Supabase
- [ ] Modelo de datos:
  ```sql
  - id (UUID)
  - project_id (FK)
  - user_id (FK)
  - hours (DECIMAL)
  - date (DATE)
  - description (TEXT)
  ```
- [ ] Componente de time tracking
- [ ] Actualizar KPI "Hours Spent" con datos reales
- [ ] Reportes de tiempo por proyecto/usuario

**B) Notificaciones - "Mark all as read"**
- [ ] Crear tabla `notifications` en Supabase
- [ ] Estados: unread, read, archived
- [ ] Implementar "Mark all as read"
- [ ] Implementar "Mark as read" individual
- [ ] Badge counter actualizado
- [ ] Borrar notificaciones antiguas (>30 días)

**C) Filtros Avanzados**
- [ ] Filtro por rango de fechas
  - [ ] Date picker
  - [ ] Presets (Hoy, Esta semana, Este mes)
- [ ] Filtro por múltiples estados (checkboxes)
- [ ] Filtro por prioridad
- [ ] Combinar filtros (AND/OR)
- [ ] Guardar filtros favoritos

**D) Ordenamiento**
- [ ] Ordenar proyectos por:
  - [ ] Fecha de creación
  - [ ] Fecha de vencimiento
  - [ ] Progreso (%)
  - [ ] Nombre (A-Z)
  - [ ] Cliente
- [ ] Ordenar tareas por:
  - [ ] Prioridad
  - [ ] Fecha de vencimiento
  - [ ] Estado
  - [ ] Proyecto
- [ ] Toggle ASC/DESC
- [ ] Persistir preferencias de orden

**Tiempo estimado:** 2-3 días  
**Dependencias:** Fase 1 completada

---

### ✨ **FASE 3: Mejoras de UX** (2-3 días)
**Prioridad:** 🟡 MEDIA  
**Estado:** ⏳ Pendiente

#### 3.1 Supabase Storage (Avatares)
**Archivos a modificar:** `services/supabase.ts`, `components/SettingsPage.tsx`, `components/TeamPage.tsx`

- [ ] Configurar Storage bucket en Supabase
  - [ ] Crear bucket "avatars" (público)
  - [ ] Configurar políticas RLS para uploads
  - [ ] Limitar tamaño de archivos (2MB max)
  - [ ] Limitar tipos (jpg, png, webp)
- [ ] Upload de avatares de usuario
  - [ ] Componente de upload con drag & drop
  - [ ] Preview antes de subir
  - [ ] Crop/resize automático
  - [ ] Progress bar durante upload
- [ ] Upload de imágenes de proyectos
  - [ ] Logo/icono de proyecto
  - [ ] Screenshots del proyecto
  - [ ] Galería de imágenes
- [ ] Optimización
  - [ ] Compresión automática
  - [ ] Generar thumbnails
  - [ ] CDN de Supabase
  - [ ] Lazy loading de imágenes

#### 3.2 Realtime Sync
**Archivos a modificar:** `services/supabase.ts`, `context/AppContext.tsx`

- [ ] Habilitar Supabase Realtime
  - [ ] Configurar en Supabase Dashboard
  - [ ] Suscribirse a cambios en `projects`
  - [ ] Suscribirse a cambios en `tasks`
  - [ ] Suscribirse a cambios en `calendar_events`
- [ ] Sincronización automática entre usuarios
  - [ ] Update automático cuando otro usuario edita
  - [ ] Insert automático cuando otro crea
  - [ ] Delete automático cuando otro elimina
- [ ] Notificaciones en tiempo real
  - [ ] "Nuevo proyecto creado por X"
  - [ ] "Tarea asignada a ti"
  - [ ] "Proyecto actualizado"
- [ ] Indicadores de presencia
  - [ ] "Usuario X está editando..."
  - [ ] Avatares de usuarios online
  - [ ] Última vez visto

#### 3.3 Optimizaciones de Performance

**A) Paginación**
- [ ] Implementar paginación en Projects
  - [ ] 20 proyectos por página
  - [ ] Load more / infinite scroll
  - [ ] Contador de páginas
- [ ] Implementar paginación en Tasks
  - [ ] 50 tareas por página
  - [ ] Virtual scrolling para listas largas

**B) Lazy Loading**
- [ ] Code splitting por rutas
- [ ] Lazy load de componentes pesados
- [ ] Lazy load de imágenes (IntersectionObserver)
- [ ] Placeholder/skeleton mientras carga

**C) Caché**
- [ ] React Query / SWR para caché de datos
- [ ] Stale-while-revalidate
- [ ] Prefetch de datos anticipados
- [ ] Invalidación inteligente de caché

**D) Optimistic Updates**
- [ ] UI responde inmediatamente
- [ ] Rollback si falla la operación
- [ ] Feedback visual mientras se confirma

**Tiempo estimado:** 2-3 días  
**Dependencias:** Fase 2 completada

---

### 📱 **FASE 4: PWA Completa** (1 día)
**Prioridad:** 🟢 BAJA  
**Estado:** ⏳ Pendiente

#### 4.1 Service Worker Mejorado
**Archivos a modificar:** `sw.js`, `manifest.json`

- [ ] Estrategias de caché avanzadas
  - [ ] Network First para datos dinámicos
  - [ ] Cache First para assets estáticos
  - [ ] Stale-While-Revalidate para imágenes
- [ ] Caché de rutas de la app
- [ ] Caché de fuentes y assets
- [ ] Actualización automática del SW
- [ ] Prompt de "Nueva versión disponible"

#### 4.2 Notificaciones Push
- [ ] Configurar Firebase Cloud Messaging (o Supabase Edge Functions)
- [ ] Pedir permiso de notificaciones
- [ ] Enviar notificaciones de:
  - [ ] Tareas asignadas
  - [ ] Deadlines próximos
  - [ ] Mensiones/comentarios
- [ ] Configuración de notificaciones en Settings

#### 4.3 Instalación como App
- [ ] Mejorar manifest.json
  - [ ] Screenshots
  - [ ] Descripción completa
  - [ ] Categoría
- [ ] Prompt de instalación personalizado
- [ ] Detección de instalación
- [ ] Analytics de instalaciones

#### 4.4 Modo Offline Robusto
- [ ] Queue de operaciones offline
- [ ] Sincronización al reconectar
- [ ] Indicador de modo offline
- [ ] Conflictos de sincronización

**Tiempo estimado:** 1 día  
**Dependencias:** Fase 3.3 (optimizaciones)

---

### 🌐 **FASE 5: Deploy a Producción** (1 día)
**Prioridad:** 🔴 ALTA  
**Estado:** ⏳ Pendiente

#### 5.1 Build Optimizado

- [ ] Bundlear TailwindCSS (no CDN)
  - [ ] `npm install -D tailwindcss postcss autoprefixer`
  - [ ] Configurar `tailwind.config.js`
  - [ ] Crear archivo CSS
  - [ ] Remover CDN de `index.html`
- [ ] Optimizar bundle
  - [ ] Code splitting
  - [ ] Tree shaking
  - [ ] Minificación
  - [ ] Compresión gzip/brotli
- [ ] Optimización de imágenes
  - [ ] Convertir a WebP
  - [ ] Responsive images
  - [ ] Lazy loading
- [ ] Verificar build
  - [ ] `npm run build` sin errores
  - [ ] `npm run preview` funciona
  - [ ] Lighthouse score > 90

#### 5.2 Deploy

**Opción A: Vercel (Recomendado)**
- [ ] Crear cuenta en Vercel
- [ ] Conectar repositorio GitHub
- [ ] Configurar variables de entorno
- [ ] Deploy automático
- [ ] Configurar dominio personalizado

**Opción B: Netlify**
- [ ] Crear cuenta en Netlify
- [ ] Conectar repositorio
- [ ] Build settings
- [ ] Variables de entorno
- [ ] Deploy

**Opción C: Coolify (Self-hosted)**
- [ ] Crear servicio en Coolify
- [ ] Configurar Dockerfile o buildpack
- [ ] Variables de entorno
- [ ] Deploy manual o Git integration

#### 5.3 Configuración de Producción

- [ ] Variables de entorno
  - [ ] `VITE_SUPABASE_URL` (producción)
  - [ ] `VITE_SUPABASE_ANON_KEY` (producción)
  - [ ] `VITE_APP_URL`
- [ ] HTTPS configurado ✅ (automático en Vercel/Netlify)
- [ ] Dominio personalizado
  - [ ] Comprar dominio (Namecheap, etc.)
  - [ ] Configurar DNS
  - [ ] SSL automático
- [ ] CORS en Supabase
  - [ ] Añadir dominio de producción
  - [ ] Whitelist URLs permitidas
- [ ] Analytics
  - [ ] Google Analytics
  - [ ] Vercel Analytics
  - [ ] Plausible (privacy-friendly)

**Tiempo estimado:** 1 día  
**Dependencias:** Fase 1 y 2 completadas

---

### 📊 **FASE 6: Monitoreo y Analytics** (1-2 días)
**Prioridad:** 🟡 MEDIA  
**Estado:** ⏳ Pendiente

#### 6.1 Analytics de Usuarios

- [ ] Google Analytics 4
  - [ ] Configurar tracking
  - [ ] Eventos personalizados
  - [ ] Conversiones
  - [ ] User flow
- [ ] Plausible (alternativa privacy-first)
  - [ ] Lightweight
  - [ ] GDPR compliant
  - [ ] Dashboard simple

#### 6.2 Monitoreo de Errores

- [ ] Sentry
  - [ ] Captura de errores JS
  - [ ] Source maps
  - [ ] Breadcrumbs
  - [ ] Release tracking
- [ ] Logs de actividad
  - [ ] Crear tabla `activity_logs`
  - [ ] Log de acciones importantes
  - [ ] Auditoría de cambios

#### 6.3 Métricas de Negocio

- [ ] Dashboard de métricas en Supabase
  - [ ] Usuarios activos (DAU/MAU)
  - [ ] Proyectos creados por día
  - [ ] Tareas completadas
  - [ ] Tiempo promedio de proyecto
- [ ] Reportes automáticos
  - [ ] Resumen semanal
  - [ ] Resumen mensual
  - [ ] Exportar a PDF/CSV

#### 6.4 Backups

- [ ] Backups automáticos de Supabase
  - [ ] Configurar en Supabase Dashboard
  - [ ] Retención 30 días
  - [ ] Point-in-time recovery
- [ ] Backup manual
  - [ ] Script de export
  - [ ] Almacenar en cloud (S3, etc.)

**Tiempo estimado:** 1-2 días  
**Dependencias:** Deploy en producción (Fase 5)

---

### 🧪 **FASE 7: Testing Automatizado** (2-3 días)
**Prioridad:** 🟢 BAJA (pero importante a largo plazo)  
**Estado:** ⏳ Pendiente

#### 7.1 Unit Tests (Vitest)

- [ ] Configurar Vitest
  - [ ] `npm install -D vitest @vitest/ui`
  - [ ] `vitest.config.ts`
  - [ ] Scripts en package.json
- [ ] Tests de utilidades
  - [ ] services/storage.ts
  - [ ] Helpers y mappers
- [ ] Tests de contextos
  - [ ] AppContext
  - [ ] AuthContext
- [ ] Target: 60% coverage

#### 7.2 Component Tests (React Testing Library)

- [ ] Configurar RTL
  - [ ] `npm install -D @testing-library/react @testing-library/jest-dom`
- [ ] Tests de componentes
  - [ ] KPICards
  - [ ] ProjectsPage
  - [ ] TasksPage
  - [ ] AuthPage
- [ ] Tests de interacción
  - [ ] Formularios
  - [ ] Modales
  - [ ] Navegación

#### 7.3 Integration Tests

- [ ] Tests de flujos completos
  - [ ] Sign up → Login → Create project
  - [ ] Create task → Update status → Complete
  - [ ] Admin permissions vs Viewer
- [ ] Mock de Supabase
  - [ ] msw (Mock Service Worker)
  - [ ] Respuestas simuladas

#### 7.4 E2E Tests (Playwright)

- [ ] Configurar Playwright
  - [ ] `npm install -D @playwright/test`
  - [ ] playwright.config.ts
- [ ] Tests críticos
  - [ ] Flujo de autenticación
  - [ ] CRUD de proyectos
  - [ ] CRUD de tareas
- [ ] Tests en múltiples navegadores
  - [ ] Chrome
  - [ ] Firefox
  - [ ] Safari

#### 7.5 CI/CD

- [ ] GitHub Actions
  - [ ] Workflow de tests automáticos
  - [ ] Ejecutar en cada PR
  - [ ] Bloquear merge si fallan tests
- [ ] Deploy automático
  - [ ] Deploy a staging en cada push a `develop`
  - [ ] Deploy a producción en merge a `main`
- [ ] Badges en README
  - [ ] Coverage badge
  - [ ] Build status
  - [ ] Deploy status

**Tiempo estimado:** 2-3 días  
**Dependencias:** Ninguna (se puede hacer en paralelo)

---

## 🎯 ROADMAP VISUAL

```
FASE 1 (Validación) ────────┐
                            │
FASE 2 (Features Core) ─────┤
                            ├─→ FASE 5 (Deploy) ─→ FASE 6 (Analytics)
FASE 3 (UX Mejoras) ────────┤
                            │
FASE 4 (PWA) ───────────────┘

FASE 7 (Testing) ──────────────────────────────────────────────┐
(se puede hacer en paralelo con cualquier fase)                │
```

---

## 📅 TIMELINE ESTIMADO

| Fase | Duración | Acumulado |
|------|----------|-----------|
| Fase 1: Validación | 1-2 días | 2 días |
| Fase 2: Features Core | 2-3 días | 5 días |
| Fase 3: UX Mejoras | 2-3 días | 8 días |
| Fase 4: PWA | 1 día | 9 días |
| Fase 5: Deploy | 1 día | 10 días |
| Fase 6: Analytics | 1-2 días | 12 días |
| Fase 7: Testing | 2-3 días | 15 días |

**Total estimado:** 2-3 semanas de desarrollo

---

## 🏆 PRIORIDADES RECOMENDADAS

### Sprint 1 (Esta semana)
1. ✅ Fase 1: Validación completa
2. 🔍 Fase 2.1: Búsqueda funcional
3. 🚀 Fase 5: Deploy a producción (básico)

### Sprint 2 (Próxima semana)
4. ⏰ Fase 2.2: Hours tracking
5. 🔔 Fase 2.2: Notificaciones
6. 📸 Fase 3.1: Storage de avatares

### Sprint 3 (Tercera semana)
7. ⚡ Fase 3.2: Realtime sync
8. 🎨 Fase 3.3: Optimizaciones
9. 📊 Fase 6: Analytics

### Backlog (cuando haya tiempo)
- Fase 4: PWA completa
- Fase 7: Testing automatizado

---

## 📌 NOTAS

- Cada checkbox marcado debe actualizarse en este archivo
- Al completar una fase, mover a la siguiente
- Si encuentras bugs, añadirlos a Fase 1 como subtareas
- Nuevas ideas → añadir al final del roadmap

---

**Fecha de creación:** 20 Diciembre 2025  
**Última actualización:** 20 Diciembre 2025  
**Estado general:** 🚀 Backend completado, listo para features
