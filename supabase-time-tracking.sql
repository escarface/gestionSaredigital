-- Añadir columnas de tracking de horas a la tabla tasks
ALTER TABLE public.tasks 
ADD COLUMN IF NOT EXISTS estimated_hours DECIMAL(5,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS actual_hours DECIMAL(5,2) DEFAULT 0;

-- Crear índice para optimizar consultas de suma
CREATE INDEX IF NOT EXISTS idx_tasks_actual_hours ON public.tasks(actual_hours);
