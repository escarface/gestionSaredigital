
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../services/storage';
import { supabase } from '../services/supabase';
import { Project, Task, TeamMember, CalendarEvent } from '../types';
import { DEFAULT_AVATAR } from '../constants';
import { v4 as uuidv4 } from 'uuid';
import Toast from '../components/Toast';
import notificationService from '../services/notifications';

// Interface for project form data with optional queued files
interface ProjectFormData extends Partial<Project> {
  __queuedFiles?: File[];
}

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  team: TeamMember[];
  events: CalendarEvent[];
  isLoading: boolean;

  // Actions
  addProject: (project: ProjectFormData) => Promise<void>;
  editProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  uploadProjectAttachment: (projectId: string, file: File) => Promise<void>;
  deleteProjectAttachment: (attachmentId: string) => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  editTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  updateTaskStatus: (taskId: string, newStatus: Task['status']) => Promise<void>;
  addEvent: (event: Partial<CalendarEvent>) => Promise<void>;
  addTeamMember: (member: Partial<TeamMember>) => Promise<void>;
  removeTeamMember: (id: string) => Promise<void>;
  notify: (msg: string, type?: 'success' | 'error') => void;

  // Modal State
  isProjectModalOpen: boolean;
  editingProject: Project | undefined;
  openProjectModal: (project?: Project) => void;
  closeProjectModal: () => void;

  // Confirmation State
  confirmConfig: { isOpen: boolean; title: string; message: string; onConfirm: () => void };
  askConfirmation: (title: string, message: string, onConfirm: () => void) => void;
  closeConfirmation: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // Get user from AuthContext
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ... (Modal State and Confirm State kept same, assuming I don't need to touch them explicitly in this block unless I reach line limit)
  // Actually I need to be careful with line matching. 
  // I will replace from start of AppProvider to end of useEffect.

  // Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);

  // Confirmation State
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
  });

  const loadData = async () => {
    if (!user) return; // Guard: Don't fetch if not logged in
    try {
      setIsLoading(true);
      const [p, t, tm, e] = await Promise.all([
        db.getProjects(),
        db.getTasks(),
        db.getTeam(),
        db.getEvents()
      ]);
      setProjects(p);
      setTasks(t);
      setTeam(tm);
      setEvents(e);

      // Check for upcoming deadlines and create notifications
      await checkForDeadlines(t, p);
    } catch (error) {
      console.error("Failed to sync with VPS:", error);
      notify("Offline Mode: Sync with server failed.", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Check for upcoming task and project deadlines and create notifications
  const checkForDeadlines = async (taskList: Task[], projectList: Project[]) => {
    if (!user) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Only notify for these specific days before deadline
    const NOTIFY_DAYS = [1, 3, 7];

    // Check task deadlines
    for (const task of taskList) {
      if (task.status === 'Done') continue;

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Only notify for specific days and not for past/far deadlines
      if (!NOTIFY_DAYS.includes(daysRemaining)) continue;

      try {
        // Check if notification already exists
        const existingNotifications = await notificationService.getNotifications(user.id);
        const alreadyNotified = existingNotifications.some(
          n => n.relatedId === task.id && 
               n.title.includes('Task:') && 
               n.message.includes(`${daysRemaining} day`)
        );

        if (!alreadyNotified) {
          await notificationService.notifyDeadlineApproaching(
            user.id,
            task.title,
            task.id,
            daysRemaining
          );
        }
      } catch (e) {
        // Notification might already exist
      }
    }

    // Check project deadlines
    for (const project of projectList) {
      if (project.status === 'Completed') continue;

      const dueDate = new Date(project.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

      // Only notify for specific days and not for past/far deadlines
      if (!NOTIFY_DAYS.includes(daysRemaining)) continue;

      try {
        // Check if notification already exists
        const existingNotifications = await notificationService.getNotifications(user.id);
        const alreadyNotified = existingNotifications.some(
          n => n.relatedId === project.id && 
               n.title.includes('Project:') && 
               n.message.includes(`${daysRemaining} day`)
        );

        if (!alreadyNotified) {
          await notificationService.notifyDeadlineApproaching(
            user.id,
            project.name,
            project.id,
            daysRemaining
          );
        }
      } catch (e) {
        // Notification might already exist
      }
    }
  };

  useEffect(() => {
    if (user) {
      loadData();

      // Subscribe to Realtime changes
      const channel = supabase
        .channel('db_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => loadData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => loadData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, () => loadData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_events' }, () => loadData())
        .on('postgres_changes', { event: '*', schema: 'public', table: 'project_attachments' }, () => loadData())
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log('Supabase Realtime connected');
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      // Clear data if logged out
      setProjects([]);
      setTasks([]);
      setTeam([]);
      setEvents([]);
      setIsLoading(false);
    }
  }, [user]);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const openProjectModal = async (project?: Project) => {
    if (project) {
      try {
        // Cargar attachments cuando se abre para editar
        const attachments = await db.getProjectAttachments(project.id);
        setEditingProject({ ...project, attachments });
      } catch (error) {
        console.error('Error loading attachments:', error);
        setEditingProject(project);
      }
    } else {
      setEditingProject(undefined);
    }
    setIsProjectModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsProjectModalOpen(false);
    setEditingProject(undefined);
  };

  const askConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmConfig({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        closeConfirmation();
      }
    });
  };

  const closeConfirmation = () => {
    setConfirmConfig(prev => ({ ...prev, isOpen: false }));
  };

  const addProject = async (projectData: ProjectFormData) => {
    const { __queuedFiles, ...projectFields } = projectData;
    const avatar = user?.avatar || DEFAULT_AVATAR;
    const newProject: Project = {
      ...projectFields,
      id: uuidv4(),
      createdById: user?.id,
      createdByName: user?.name,
      createdByAvatar: avatar,
    } as Project;
    try {
      await db.saveProject(newProject);
      // Subir archivos encolados (si hay)
      if (__queuedFiles && __queuedFiles.length > 0) {
        for (const file of __queuedFiles) {
          try {
            await db.uploadProjectAttachment(newProject.id, file);
          } catch (e) {
            console.error('Error uploading queued file:', e);
          }
        }
      }
      await loadData();
      notify(`Project "${newProject.name}" saved.`);
      closeProjectModal();
    } catch (e) { notify("Error saving project", "error"); }
  };

  const editProject = async (project: Project) => {
    try {
      await db.updateProject(project);
      await loadData();
      notify(`Project "${project.name}" updated!`);
      closeProjectModal();
    } catch (e) { notify("Error updating project", "error"); }
  };

  const deleteProject = async (id: string) => {
    try {
      await db.deleteProject(id);
      await loadData();
      notify('Project deleted', 'success');
    } catch (e) { notify("Error deleting project", "error"); }
  };

  const addTask = async (taskData: Partial<Task>) => {
    const newTask = { ...taskData, id: uuidv4() } as Task;
    try {
      await db.saveTask(newTask);
      await loadData();
      notify('Task synchronized');
    } catch (e) { notify("Error adding task", "error"); }
  };

  const editTask = async (task: Task) => {
    try {
      await db.updateTask(task);
      await loadData();
      notify('Task updated');
    } catch (e) { notify("Error updating task", "error"); }
  };

  const deleteTask = async (id: string) => {
    try {
      await db.deleteTask(id);
      await loadData();
      notify('Task deleted', 'success');
    } catch (e) { notify("Error deleting task", "error"); }
  };

  const updateTaskStatus = async (taskId: string, newStatus: Task['status']) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updated = { ...task, status: newStatus };
      try {
        await db.updateTask(updated);
        await loadData();
        notify(`Task status: ${newStatus}`);
      } catch (e) { notify("Error updating status", "error"); }
    }
  };

  const addEvent = async (eventData: Partial<CalendarEvent>) => {
    const newEvent = { ...eventData, id: uuidv4() } as CalendarEvent;
    try {
      await db.saveEvent(newEvent);
      await loadData();
      notify('Calendar synchronized');
    } catch (e) { notify("Error adding event", "error"); }
  };

  const addTeamMember = async (memberData: Partial<TeamMember>) => {
    const newMember = { ...memberData, id: uuidv4() } as TeamMember;
    try {
      await db.saveTeamMember(newMember);
      await loadData();
      notify('Team data updated');
    } catch (e) { notify("Error adding member", "error"); }
  };

  const removeTeamMember = async (id: string) => {
    try {
      await db.deleteTeamMember(id);
      await loadData();
      notify('Member removed');
    } catch (e) { notify("Error removing member", "error"); }
  };

  const uploadProjectAttachment = async (projectId: string, file: File) => {
    try {
      console.log('AppContext.uploadProjectAttachment called with:', { projectId, fileName: file?.name, fileSize: file?.size });
      if (!projectId || !file) {
        throw new Error(`Invalid parameters: projectId=${projectId}, file=${file?.name}`);
      }
      const attachment = await db.uploadProjectAttachment(projectId, file);
      // Recargar datos para actualizar attachments
      await loadData();
      notify(`File "${file.name}" uploaded successfully`);
      return attachment;
    } catch (e) {
      const error = e instanceof Error ? e : new Error(String(e));
      console.error('AppContext.uploadProjectAttachment error:', error);
      notify(error.message || "Error uploading file", "error");
      throw e;
    }
  };

  const deleteProjectAttachment = async (attachmentId: string) => {
    try {
      await db.deleteProjectAttachment(attachmentId);
      // Actualizar todos los proyectos para eliminar el attachment
      const updatedProjects = projects.map(p => ({
        ...p,
        attachments: (p.attachments || []).filter(a => a.id !== attachmentId)
      }));
      setProjects(updatedProjects);
      notify('Attachment deleted');
    } catch (e) { notify("Error deleting attachment", "error"); }
  };

  const value = useMemo(
    () => ({
      projects,
      tasks,
      team,
      events,
      isLoading,
      addProject,
      editProject,
      deleteProject,
      uploadProjectAttachment,
      deleteProjectAttachment,
      addTask,
      editTask,
      deleteTask,
      updateTaskStatus,
      addEvent,
      addTeamMember,
      removeTeamMember,
      notify,
      isProjectModalOpen,
      editingProject,
      openProjectModal,
      closeProjectModal,
      confirmConfig,
      askConfirmation,
      closeConfirmation,
    }),
    [
      projects,
      tasks,
      team,
      events,
      isLoading,
      isProjectModalOpen,
      editingProject,
      confirmConfig,
    ]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
