
import { Project, Task, TeamMember, CalendarEvent } from '../types';
import { supabase, handleSupabaseError } from './supabase';

class StorageService {
  // Helper para convertir datos de Supabase al formato de la app
  private mapProject(dbProject: any): Project {
    return {
      id: dbProject.id,
      name: dbProject.name,
      client: dbProject.client,
      description: dbProject.description || '',
      progress: dbProject.progress,
      status: dbProject.status,
      statusColor: dbProject.status_color,
      members: dbProject.members || [],
      extraMembers: dbProject.extra_members || 0,
      icon: dbProject.icon,
      dueDate: dbProject.due_date,
    };
  }

  private mapTask(dbTask: any): Task {
    return {
      id: dbTask.id,
      title: dbTask.title,
      project: dbTask.project,
      description: dbTask.description || '',
      dueDate: dbTask.due_date,
      priority: dbTask.priority,
      status: dbTask.status,
      assignee: dbTask.assignee || '',
    };
  }

  private mapTeamMember(dbMember: any): TeamMember {
    return {
      id: dbMember.id,
      name: dbMember.name,
      role: dbMember.role,
      avatar: dbMember.avatar,
      status: dbMember.status,
      email: dbMember.email,
    };
  }

  private mapEvent(dbEvent: any): CalendarEvent {
    return {
      id: dbEvent.id,
      title: dbEvent.title,
      date: dbEvent.date,
      type: dbEvent.type,
      time: dbEvent.time,
    };
  }

  // --- Projects ---
  async getProjects(): Promise<Project[]> {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapProject);
    } catch (e) {
      console.warn("Supabase no disponible, usando fallback local...", e);
      return JSON.parse(localStorage.getItem('gestion_pro_projects') || '[]');
    }
  }

  async saveProject(project: Project) {
    try {
      const { error } = await supabase.from('projects').insert({
        id: project.id,
        name: project.name,
        client: project.client,
        description: project.description,
        progress: project.progress,
        status: project.status,
        status_color: project.statusColor,
        members: project.members,
        extra_members: project.extraMembers,
        icon: project.icon,
        due_date: project.dueDate,
      });

      if (error) throw error;
    } catch (e) {
      console.warn('Fallback local activado:', e);
      const projects = JSON.parse(localStorage.getItem('gestion_pro_projects') || '[]');
      projects.unshift(project);
      localStorage.setItem('gestion_pro_projects', JSON.stringify(projects));
    }
  }

  async updateProject(project: Project) {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          name: project.name,
          client: project.client,
          description: project.description,
          progress: project.progress,
          status: project.status,
          status_color: project.statusColor,
          members: project.members,
          extra_members: project.extraMembers,
          icon: project.icon,
          due_date: project.dueDate,
        })
        .eq('id', project.id);

      if (error) throw error;
    } catch (e) {
      const projects = JSON.parse(localStorage.getItem('gestion_pro_projects') || '[]');
      const updated = projects.map((p: any) => p.id === project.id ? project : p);
      localStorage.setItem('gestion_pro_projects', JSON.stringify(updated));
    }
  }

  async deleteProject(id: string) {
    try {
      // Primero obtener el nombre del proyecto para borrar sus tareas asociadas
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('name')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      // Borrar todas las tareas asociadas al proyecto
      if (project) {
        const { error: tasksError } = await supabase
          .from('tasks')
          .delete()
          .eq('project', project.name);

        if (tasksError) console.warn('Error deleting associated tasks:', tasksError);
      }

      // Ahora borrar el proyecto
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      // Fallback a localStorage
      const projects = JSON.parse(localStorage.getItem('gestion_pro_projects') || '[]');
      const project = projects.find((p: any) => p.id === id);
      
      if (project) {
        // Borrar tareas asociadas en localStorage
        const tasks = JSON.parse(localStorage.getItem('gestion_pro_tasks') || '[]');
        const filteredTasks = tasks.filter((t: any) => t.project !== project.name);
        localStorage.setItem('gestion_pro_tasks', JSON.stringify(filteredTasks));
      }

      // Borrar proyecto
      const filtered = projects.filter((p: any) => p.id !== id);
      localStorage.setItem('gestion_pro_projects', JSON.stringify(filtered));
    }
  }

  // --- Tasks ---
  async getTasks(): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapTask);
    } catch (e) {
      return JSON.parse(localStorage.getItem('gestion_pro_tasks') || '[]');
    }
  }

  async saveTask(task: Task) {
    try {
      const { error } = await supabase.from('tasks').insert({
        id: task.id,
        title: task.title,
        project: task.project,
        description: task.description,
        due_date: task.dueDate,
        priority: task.priority,
        status: task.status,
        assignee: task.assignee,
      });

      if (error) throw error;
    } catch (e) {
      const tasks = JSON.parse(localStorage.getItem('gestion_pro_tasks') || '[]');
      tasks.push(task);
      localStorage.setItem('gestion_pro_tasks', JSON.stringify(tasks));
    }
  }

  async updateTask(task: Task) {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: task.title,
          project: task.project,
          description: task.description,
          due_date: task.dueDate,
          priority: task.priority,
          status: task.status,
          assignee: task.assignee,
        })
        .eq('id', task.id);

      if (error) throw error;
    } catch (e) {
      const tasks = JSON.parse(localStorage.getItem('gestion_pro_tasks') || '[]');
      const updated = tasks.map((t: any) => t.id === task.id ? task : t);
      localStorage.setItem('gestion_pro_tasks', JSON.stringify(updated));
    }
  }

  async deleteTask(id: string) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      const tasks = JSON.parse(localStorage.getItem('gestion_pro_tasks') || '[]');
      const filtered = tasks.filter((t: any) => t.id !== id);
      localStorage.setItem('gestion_pro_tasks', JSON.stringify(filtered));
    }
  }

  // --- Team ---
  async getTeam(): Promise<TeamMember[]> {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapTeamMember);
    } catch (e) {
      return JSON.parse(localStorage.getItem('gestion_pro_team') || '[]');
    }
  }

  async saveTeamMember(member: TeamMember) {
    try {
      const { error } = await supabase.from('team_members').insert({
        id: member.id,
        name: member.name,
        role: member.role,
        avatar: member.avatar,
        status: member.status,
        email: member.email,
      });

      if (error) throw error;
    } catch (e) {
      const team = JSON.parse(localStorage.getItem('gestion_pro_team') || '[]');
      team.push(member);
      localStorage.setItem('gestion_pro_team', JSON.stringify(team));
    }
  }

  async deleteTeamMember(id: string) {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      const team = JSON.parse(localStorage.getItem('gestion_pro_team') || '[]');
      const filtered = team.filter((t: any) => t.id !== id);
      localStorage.setItem('gestion_pro_team', JSON.stringify(filtered));
    }
  }
  
  // --- Events ---
  async getEvents(): Promise<CalendarEvent[]> {
    try {
      const { data, error } = await supabase
        .from('calendar_events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      return (data || []).map(this.mapEvent);
    } catch (e) {
      return JSON.parse(localStorage.getItem('gestion_pro_events') || '[]');
    }
  }

  async saveEvent(event: CalendarEvent) {
    try {
      const { error } = await supabase.from('calendar_events').insert({
        id: event.id,
        title: event.title,
        date: event.date,
        type: event.type,
        time: event.time,
      });

      if (error) throw error;
    } catch (e) {
      const events = JSON.parse(localStorage.getItem('gestion_pro_events') || '[]');
      events.push(event);
      localStorage.setItem('gestion_pro_events', JSON.stringify(events));
    }
  }
}

export const db = new StorageService();
