
import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/storage';
import { Project, Task, TeamMember, CalendarEvent } from '../types';
import { v4 as uuidv4 } from 'uuid';
import Toast from '../components/Toast';

interface AppContextType {
  projects: Project[];
  tasks: Task[];
  team: TeamMember[];
  events: CalendarEvent[];
  isLoading: boolean;
  
  // Actions
  addProject: (project: Partial<Project>) => Promise<void>;
  editProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
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
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
  
  // Confirmation State
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  const loadData = async () => {
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
    } catch (error) {
      console.error("Failed to sync with VPS:", error);
      notify("Offline Mode: Sync with server failed.", 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
  };

  const openProjectModal = (project?: Project) => {
    setEditingProject(project);
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

  const addProject = async (projectData: Partial<Project>) => {
    const newProject = { ...projectData, id: uuidv4() } as Project;
    try {
      await db.saveProject(newProject);
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

  return (
    <AppContext.Provider value={{ 
      projects, tasks, team, events, isLoading,
      addProject, editProject, deleteProject, addTask, editTask, deleteTask, updateTaskStatus, addEvent, addTeamMember, removeTeamMember, notify,
      isProjectModalOpen, editingProject, openProjectModal, closeProjectModal,
      confirmConfig, askConfirmation, closeConfirmation
    }}>
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
