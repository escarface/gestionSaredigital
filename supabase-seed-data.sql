-- =====================================================
-- SEED DATA para Testing
-- =====================================================
-- Este script inserta datos de ejemplo en la base de datos
-- IMPORTANTE: Ejecuta esto DESPUÉS de haber creado al menos un usuario
-- =====================================================

-- Nota: Reemplaza 'USER_UUID_AQUI' con el UUID de tu usuario
-- Puedes obtenerlo desde: Authentication > Users en Supabase Dashboard

-- =====================================================
-- PROJECTS - Datos de ejemplo
-- =====================================================

INSERT INTO public.projects (name, client, description, progress, status, status_color, members, extra_members, icon, due_date, created_by) VALUES
('Website Redesign', 'Acme Corp', 'Complete redesign of corporate website with modern UI/UX', 75, 'In Progress', '#f9f506', ARRAY['https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=256'], 2, 'web', '2025-01-15', NULL),
('Mobile App Development', 'TechStart Inc', 'Native iOS and Android app for inventory management', 45, 'In Progress', '#f9f506', ARRAY['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=256'], 0, 'smartphone', '2025-02-28', NULL),
('Marketing Campaign', 'BrandBoost', 'Q1 digital marketing campaign across social media platforms', 90, 'Review', '#ff9800', ARRAY['https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=256'], 1, 'campaign', '2025-01-05', NULL),
('Data Migration', 'Global Solutions', 'Migrate legacy database to cloud infrastructure', 30, 'Planning', '#2196f3', ARRAY['https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=256'], 0, 'web', '2025-03-20', NULL),
('E-commerce Platform', 'ShopNow', 'Build custom e-commerce solution with payment integration', 100, 'Completed', '#4caf50', ARRAY['https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=256', 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=256'], 0, 'web', '2024-12-20', NULL);

-- =====================================================
-- TASKS - Datos de ejemplo
-- =====================================================

INSERT INTO public.tasks (title, project, description, due_date, priority, status, assignee) VALUES
('Design homepage mockup', 'Website Redesign', 'Create high-fidelity mockup for the new homepage in Figma', '2025-01-08', 'High', 'In Progress', 'Ana Designer'),
('Setup development environment', 'Mobile App Development', 'Configure React Native and necessary dependencies', '2025-01-10', 'High', 'Done', 'Bob Developer'),
('Write product copy', 'Marketing Campaign', 'Draft compelling copy for all campaign materials', '2025-01-03', 'High', 'Done', 'Charlie Writer'),
('Code review session', 'Website Redesign', 'Review and approve frontend implementation', '2025-01-12', 'Medium', 'Todo', 'David Tech Lead'),
('Database schema design', 'Data Migration', 'Design new cloud database schema and relationships', '2025-01-20', 'High', 'In Progress', 'Bob Developer'),
('User testing', 'Mobile App Development', 'Conduct usability testing with 10 beta users', '2025-02-15', 'Medium', 'Todo', NULL),
('Social media graphics', 'Marketing Campaign', 'Create Instagram and Facebook post templates', '2025-01-04', 'Low', 'Done', 'Ana Designer'),
('Payment gateway integration', 'E-commerce Platform', 'Integrate Stripe payment processing', '2024-12-15', 'High', 'Done', 'Charlie Writer');

-- =====================================================
-- TEAM MEMBERS - Datos de ejemplo
-- =====================================================

INSERT INTO public.team_members (name, role, avatar, status, email) VALUES
('Ana Designer', 'Senior UI/UX Designer', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 'Online', 'ana.designer@gestionpro.com'),
('Bob Developer', 'Full Stack Developer', 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 'Online', 'bob.dev@gestionpro.com'),
('Charlie Writer', 'Content Strategist', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 'Busy', 'charlie@gestionpro.com'),
('David Tech Lead', 'Technical Lead', 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 'Offline', 'david.lead@gestionpro.com'),
('Emma Product Manager', 'Product Manager', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 'Online', 'emma.pm@gestionpro.com'),
('Frank QA Engineer', 'QA Engineer', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80', 'Online', 'frank.qa@gestionpro.com');

-- =====================================================
-- CALENDAR EVENTS - Datos de ejemplo
-- =====================================================

INSERT INTO public.calendar_events (title, date, type, time) VALUES
('Sprint Planning', '2025-12-23', 'Meeting', '10:00 AM'),
('Client Presentation', '2025-12-24', 'Meeting', '2:00 PM'),
('Project Deadline: Marketing Campaign', '2025-01-05', 'Deadline', '5:00 PM'),
('Code Review Session', '2025-12-26', 'Review', '11:00 AM'),
('Stakeholder Meeting', '2025-12-27', 'Meeting', '3:00 PM'),
('Website Launch', '2025-01-15', 'Deadline', '12:00 PM'),
('Team Retrospective', '2025-12-30', 'Meeting', '4:00 PM'),
('Design Review', '2026-01-02', 'Review', '10:30 AM');

-- =====================================================
-- Verificación
-- =====================================================

-- Verifica que se insertaron los datos correctamente:
SELECT COUNT(*) as projects_count FROM public.projects;
SELECT COUNT(*) as tasks_count FROM public.tasks;
SELECT COUNT(*) as team_count FROM public.team_members;
SELECT COUNT(*) as events_count FROM public.calendar_events;

-- Deberías ver:
-- projects_count: 5
-- tasks_count: 8
-- team_count: 6
-- events_count: 8
