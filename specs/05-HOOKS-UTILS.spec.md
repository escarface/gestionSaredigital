# Especificación: Hooks y Utils

## Visión General

El proyecto incluye hooks personalizados y utilidades para funcionalidades comunes:
- **Hooks:** Lógica reutilizable de React
- **Utils:** Funciones de utilidad puras

---

## Hooks (`/hooks/`)

### Archivo: `hooks/index.ts`

**Descripción:** Barrel file para exportar todos los hooks.

```typescript
export { useClickOutside } from './useClickOutside';
export { useDebounce } from './useDebounce';
```

---

### Hook: `useClickOutside`

**Archivo:** `hooks/useClickOutside.ts`
**Líneas:** ~35

#### Descripción
Detecta clics fuera de un elemento referenciado. Útil para cerrar menús dropdown, modales, etc.

#### Firma
```typescript
function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void
): void
```

#### Parámetros
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `ref` | `RefObject<T>` | Referencia al elemento DOM a monitorear |
| `handler` | `(event) => void` | Callback ejecutado al detectar clic fuera |

#### Implementación

```typescript
useEffect(() => {
  const listener = (event: MouseEvent | TouchEvent) => {
    const el = ref.current;

    // No hacer nada si el clic es dentro del elemento
    if (!el || el.contains(event.target as Node)) {
      return;
    }

    handler(event);
  };

  // Escuchar eventos de mouse y touch
  document.addEventListener('mousedown', listener);
  document.addEventListener('touchstart', listener);

  return () => {
    document.removeEventListener('mousedown', listener);
    document.removeEventListener('touchstart', listener);
  };
}, [ref, handler]);
```

#### Eventos Monitoreados
- `mousedown`: Clic con mouse
- `touchstart`: Toque en pantalla táctil

#### Ejemplo de Uso

```typescript
import { useRef } from 'react';
import { useClickOutside } from '../hooks';

const DropdownMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const menuRef = useRef<HTMLDivElement>(null);

  useClickOutside(menuRef, () => {
    setIsOpen(false);
  });

  return (
    <div ref={menuRef}>
      {isOpen && <div>Menu content...</div>}
    </div>
  );
};
```

#### Uso en la App
- `NotificationCenter`: Cerrar dropdown de notificaciones
- `ProjectsPage`: Cerrar menú contextual de proyecto
- `TasksPage`: Cerrar menú contextual de tarea
- `TeamPage`: Cerrar menú de miembro

---

### Hook: `useDebounce`

**Archivo:** `hooks/useDebounce.ts`
**Líneas:** ~28

#### Descripción
Retarda la actualización de un valor hasta que pase un tiempo sin cambios. Útil para optimizar búsquedas, filtros, o llamadas a API.

#### Firma
```typescript
function useDebounce<T>(value: T, delay?: number): T
```

#### Parámetros
| Parámetro | Tipo | Default | Descripción |
|-----------|------|---------|-------------|
| `value` | `T` | - | Valor a debounce |
| `delay` | `number` | `500` | Milisegundos de espera |

#### Retorna
El valor debounced (actualizado solo después del delay).

#### Implementación

```typescript
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configurar timeout
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpiar timeout si el valor cambia antes del delay
    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

#### Ejemplo de Uso

```typescript
import { useState } from 'react';
import { useDebounce } from '../hooks';

const SearchComponent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearch) {
      // Solo buscar después de 300ms sin cambios
      performSearch(debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <input
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

#### Uso Potencial en la App
- Búsqueda en TeamPage (actualmente sin debounce)
- Filtros de proyectos/tareas
- Campos de formulario con validación async

---

## Utils (`/utils/`)

### Archivo: `utils/sanitize.ts`

**Líneas:** ~46

#### Descripción
Proporciona funciones de sanitización para prevenir ataques XSS (Cross-Site Scripting).

**Dependencia:** `dompurify`

---

### Función: `sanitizeHtml`

#### Descripción
Sanitiza contenido HTML manteniendo tags seguros.

#### Firma
```typescript
function sanitizeHtml(dirty: string): string
```

#### Configuración

```typescript
return DOMPurify.sanitize(dirty, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'code', 'pre'],
  ALLOWED_ATTR: ['href', 'title', 'target'],
  ALLOW_DATA_ATTR: false,
});
```

#### Tags Permitidos
| Tag | Uso |
|-----|-----|
| `b`, `strong` | Negrita |
| `i`, `em` | Itálica |
| `a` | Enlaces (con href, title, target) |
| `p` | Párrafos |
| `br` | Saltos de línea |
| `ul`, `ol`, `li` | Listas |
| `code`, `pre` | Código |

#### Ejemplo de Uso

```typescript
import { sanitizeHtml } from '../utils/sanitize';

const userInput = '<script>alert("XSS")</script><b>Hello</b>';
const safe = sanitizeHtml(userInput);
// Resultado: "<b>Hello</b>"
```

---

### Función: `sanitizeText`

#### Descripción
Escapa entidades HTML para texto plano. Útil cuando el input debe mostrarse literalmente sin interpretarse como HTML.

#### Firma
```typescript
function sanitizeText(text: string): string
```

#### Implementación

```typescript
export const sanitizeText = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};
```

#### Ejemplo

```typescript
const userInput = '<script>alert("XSS")</script>';
const safe = sanitizeText(userInput);
// Resultado: "&lt;script&gt;alert("XSS")&lt;/script&gt;"
```

#### Caracteres Escapados
| Original | Escapado |
|----------|----------|
| `<` | `&lt;` |
| `>` | `&gt;` |
| `&` | `&amp;` |
| `"` | `&quot;` |
| `'` | `&#39;` |

---

### Función: `sanitizeUrl`

#### Descripción
Valida y sanitiza URLs para prevenir ataques via `javascript:` o `data:` URIs.

#### Firma
```typescript
function sanitizeUrl(url: string): string
```

#### Implementación

```typescript
export const sanitizeUrl = (url: string): string => {
  try {
    const parsed = new URL(url);
    // Solo permitir protocolos seguros
    if (!['http:', 'https:', 'mailto:'].includes(parsed.protocol)) {
      return '';
    }
    return url;
  } catch {
    // URL inválida
    return '';
  }
};
```

#### Protocolos Permitidos
- `http:`
- `https:`
- `mailto:`

#### Protocolos Bloqueados
- `javascript:` (XSS)
- `data:` (inyección de contenido)
- `file:` (acceso a sistema local)
- Cualquier otro protocolo

#### Ejemplos

```typescript
sanitizeUrl('https://example.com')    // "https://example.com"
sanitizeUrl('javascript:alert(1)')    // ""
sanitizeUrl('data:text/html,...')     // ""
sanitizeUrl('not a url')              // ""
sanitizeUrl('mailto:user@email.com')  // "mailto:user@email.com"
```

---

## Diagrama de Uso

```
┌─────────────────────────────────────────────────────────┐
│                    Components                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  NotificationCenter ──┐                                  │
│  ProjectsPage ────────┼──► useClickOutside()            │
│  TasksPage ───────────┤                                  │
│  TeamPage ────────────┘                                  │
│                                                          │
│  (Futuro) SearchComponent ──► useDebounce()             │
│                                                          │
│  MeetingNotesModal ──┐                                   │
│  ProjectModal ───────┼──► sanitizeHtml() (descripcion)  │
│  TaskDetailModal ────┘                                   │
│                                                          │
│  (Links externos) ──► sanitizeUrl()                     │
│                                                          │
│  (Input de usuario) ──► sanitizeText()                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Mejores Prácticas

### Para `useClickOutside`
1. Siempre pasar un `ref` que persista entre renders
2. El `handler` debería ser un `useCallback` para evitar re-suscripciones innecesarias

```typescript
const handleClose = useCallback(() => {
  setIsOpen(false);
}, []);

useClickOutside(ref, handleClose);
```

### Para `useDebounce`
1. Usar delays apropiados:
   - Búsqueda: 300-500ms
   - Validación: 300ms
   - Auto-save: 1000-2000ms
2. No usar para inputs críticos donde el usuario espera feedback inmediato

### Para Sanitización
1. **Siempre** sanitizar contenido generado por usuarios antes de renderizar
2. Usar `sanitizeHtml` para rich text
3. Usar `sanitizeText` para texto plano
4. Usar `sanitizeUrl` para cualquier URL que venga de input de usuario
5. Nunca confiar en sanitización del cliente como única capa de seguridad

---

## Notas de Implementación

### Hooks no Utilizados
- `useDebounce` está definido pero no se utiliza actualmente en la aplicación
- Puede ser útil para optimizar la búsqueda en `TeamPage`

### Sanitización Limitada
- Las funciones de sanitización existen pero se usan de forma limitada
- Se recomienda ampliar su uso especialmente en:
  - Descripciones de proyectos/tareas
  - Notas de reunión
  - Nombres ingresados por usuario
