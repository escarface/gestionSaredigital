
import { Project, Task, TeamMember, CalendarEvent, MeetingNote, ProjectNote, ProjectAttachment, User, ProjectAssignment } from '../types';
import { supabase, handleSupabaseError } from './supabase';
import { v4 as uuidv4 } from 'uuid';

class StorageService {
  // Helper para convertir datos de Supabase al formato de la app
  private mapMeetingNote(dbNote: any): MeetingNote {
    return {
      id: dbNote.id,
      projectId: dbNote.project_id,
      content: dbNote.content,
      createdAt: dbNote.created_at,
      createdBy: dbNote.created_by
    };
  }

  private mapProjectNote(dbNote: any): ProjectNote {
    return {
      id: dbNote.id,
      projectId: dbNote.project_id,
      title: dbNote.title,
      content: dbNote.content,
      createdAt: dbNote.created_at,
      updatedAt: dbNote.updated_at,
      createdBy: dbNote.created_by
    };
  }

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
      createdById: dbProject.created_by,
      // createdByName y createdByAvatar se agregan en getProjects desde el JOIN
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
      estimatedHours: dbTask.estimated_hours || 0,
      actualHours: dbTask.actual_hours || 0,
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

  private mapProjectAttachment(dbAttachment: any): ProjectAttachment {
    return {
      id: dbAttachment.id,
      project_id: dbAttachment.project_id,
      file_name: dbAttachment.file_name,
      file_url: dbAttachment.file_url,
      file_type: dbAttachment.file_type,
      file_size: dbAttachment.file_size,
      created_at: dbAttachment.created_at,
    };
  }

  // --- Projects ---
  async getProjects(): Promise<Project[]> {
    try {
      // Try with new assignment fields first (if migrations are done)
      let data, error;

      try {
        const result = await supabase
          .from('projects')
          .select(`
            *,
            profiles!projects_created_by_fkey(id, name, avatar),
            project_leader:profiles!projects_project_leader_id_fkey(id, name, avatar, email, role),
            project_assignments(
              id,
              user_id,
              assigned_at,
              assigned_by,
              user:profiles!project_assignments_user_id_fkey(id, name, avatar, email, role)
            ),
            project_attachments(*)
          `)
          .order('created_at', { ascending: false });

        data = result.data;
        error = result.error;
      } catch (joinError) {
        // If JOINs fail (migrations not run), fall back to basic query
        console.warn("Assignment fields not available yet, using basic query:", joinError);
        const result = await supabase
          .from('projects')
          .select(`
            *,
            profiles!projects_created_by_fkey(id, name, avatar),
            project_attachments(*)
          `)
          .order('created_at', { ascending: false });

        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      return (data || []).map((dbProject: any) => {
        const project = this.mapProject(dbProject);
        const creatorProfile = dbProject.profiles;
        const assignments = dbProject.project_assignments || [];

        return {
          ...project,
          createdByName: creatorProfile?.name || 'Unknown User',
          createdByAvatar: creatorProfile?.avatar || 'https://ui-avatars.com/api/?background=random&name=Unknown',
          attachments: (dbProject.project_attachments || []).map(this.mapProjectAttachment.bind(this)),
          // New assignment fields (only if migrations are done)
          projectLeaderId: dbProject.project_leader_id,
          projectLeader: dbProject.project_leader ? {
            id: dbProject.project_leader.id,
            name: dbProject.project_leader.name,
            email: dbProject.project_leader.email,
            avatar: dbProject.project_leader.avatar,
            role: dbProject.project_leader.role,
          } : undefined,
          assignments: assignments.map((a: any) => ({
            id: a.id,
            project_id: dbProject.id,
            user_id: a.user_id,
            assigned_at: a.assigned_at,
            assigned_by: a.assigned_by,
            user: a.user ? {
              id: a.user.id,
              name: a.user.name,
              email: a.user.email,
              avatar: a.user.avatar,
              role: a.user.role,
            } : undefined,
          })),
          assignedUsers: assignments.map((a: any) => a.user).filter(Boolean),
        };
      });
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
        created_by: project.createdById,
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
          created_by: project.createdById,
          project_leader_id: project.projectLeaderId,
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

      // Borrar todos los adjuntos del proyecto (y sus archivos en Storage)
      await this.deleteProjectAttachmentsCascade(id);

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
      // Try with assignment field first (if migration is done)
      let data, error;

      try {
        const result = await supabase
          .from('tasks')
          .select(`
            *,
            assigned_user:profiles!tasks_assigned_to_fkey(id, name, avatar, email, role)
          `)
          .order('created_at', { ascending: false });

        data = result.data;
        error = result.error;
      } catch (joinError) {
        // If JOIN fails (migration not run), fall back to basic query
        console.warn("assigned_to field not available yet, using basic query:", joinError);
        const result = await supabase
          .from('tasks')
          .select('*')
          .order('created_at', { ascending: false });

        data = result.data;
        error = result.error;
      }

      if (error) throw error;

      return (data || []).map((dbTask: any) => {
        const task = this.mapTask(dbTask);
        return {
          ...task,
          assignedTo: dbTask.assigned_to,
          assignedUser: dbTask.assigned_user ? {
            id: dbTask.assigned_user.id,
            name: dbTask.assigned_user.name,
            email: dbTask.assigned_user.email,
            avatar: dbTask.assigned_user.avatar,
            role: dbTask.assigned_user.role,
          } : undefined,
        };
      });
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
        assignee: task.assignee, // Legacy
        assigned_to: task.assignedTo, // NEW
        estimated_hours: task.estimatedHours || 0,
        actual_hours: task.actualHours || 0,
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
          assignee: task.assignee, // Legacy
          assigned_to: task.assignedTo, // NEW
          estimated_hours: task.estimatedHours || 0,
          actual_hours: task.actualHours || 0,
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
      // 1. Get member details to find email and avatar (used as ID in this app)
      const { data: member, error: fetchError } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;

      if (member) {
        // 2. Unassign tasks (Tasks use avatar as assignee identifier)
        const { error: tasksError } = await supabase
          .from('tasks')
          .update({ assignee: null })
          .eq('assignee', member.avatar);

        if (tasksError) console.warn('Error unassigning tasks:', tasksError);

        // 3. Remove from projects (Projects use avatar in members array)
        // Since we can't easily remove from array in one SQL query without complex logic,
        // we will fetch projects containing this member and update them.
        // Or better, use a Postgres function if available. But for now, let's do read-modify-write
        // which matches the existing pattern in this service (though not ideal for concurrency, it works for this scale).

        const { data: projectsWithMember } = await supabase
          .from('projects')
          .select('*')
          .contains('members', [member.avatar]);

        if (projectsWithMember && projectsWithMember.length > 0) {
          for (const project of projectsWithMember) {
            const newMembers = (project.members || []).filter((m: string) => m !== member.avatar);
            await supabase
              .from('projects')
              .update({ members: newMembers })
              .eq('id', project.id);
          }
        }

        // 4. Revoke Access (Delete Profile)
        if (member.email) {
          const { error: profileError } = await supabase
            .from('profiles')
            .delete()
            .eq('email', member.email);

          if (profileError) console.warn('Error deleting profile:', profileError);
        }
      }

      // 5. Delete the team member
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      const team = JSON.parse(localStorage.getItem('gestion_pro_team') || '[]');
      const filtered = team.filter((t: any) => t.id !== id);
      localStorage.setItem('gestion_pro_team', JSON.stringify(filtered));

      // Fallback cleanup for local storage would be complex here, 
      // but assuming Supabase is primary.
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

  // --- Meeting Notes ---
  async getMeetingNotes(projectId: string): Promise<MeetingNote[]> {
    try {
      const { data, error } = await supabase
        .from('meeting_notes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapMeetingNote);
    } catch (e) {
      console.warn("Error fetching notes:", e);
      return [];
    }
  }

  async saveMeetingNote(note: Partial<MeetingNote>) {
    try {
      const { error } = await supabase.from('meeting_notes').insert({
        id: note.id,
        project_id: note.projectId,
        content: note.content,
        // created_by is handled by RLS default or we can send it if needed, but normally auth.uid()
      });

      if (error) throw error;
    } catch (e) {
      console.error("Error saving note:", e);
      throw e;
    }
  }

  async deleteMeetingNote(id: string) {
    try {
      const { error } = await supabase
        .from('meeting_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      console.error("Error deleting note:", e);
      throw e;
    }
  }

  // --- Project Notes ---
  async getProjectNotes(projectId: string): Promise<ProjectNote[]> {
    try {
      const { data, error } = await supabase
        .from('project_notes')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapProjectNote);
    } catch (e) {
      console.warn("Error fetching project notes:", e);
      return [];
    }
  }

  async saveProjectNote(note: Partial<ProjectNote>): Promise<ProjectNote> {
    try {
      const { data, error } = await supabase.from('project_notes').insert({
        id: note.id || uuidv4(),
        project_id: note.projectId,
        title: note.title,
        content: note.content,
      }).select().single();

      if (error) throw error;
      return this.mapProjectNote(data);
    } catch (e) {
      console.error("Error saving project note:", e);
      throw e;
    }
  }

  async updateProjectNote(note: ProjectNote): Promise<ProjectNote> {
    try {
      const { data, error } = await supabase
        .from('project_notes')
        .update({
          title: note.title,
          content: note.content,
          updated_at: new Date().toISOString(),
        })
        .eq('id', note.id)
        .select()
        .single();

      if (error) throw error;
      return this.mapProjectNote(data);
    } catch (e) {
      console.error("Error updating project note:", e);
      throw e;
    }
  }

  async deleteProjectNote(id: string) {
    try {
      const { error } = await supabase
        .from('project_notes')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (e) {
      console.error("Error deleting project note:", e);
      throw e;
    }
  }

  // --- Project Attachments ---
  async uploadProjectAttachment(projectId: string, file: File): Promise<ProjectAttachment> {
    try {
      // Validar tipo MIME permitido
      const allowedMimeTypes = [
        // Images
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/gif',
        'image/webp',
        'image/svg+xml',
        // Documents
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        // Text
        'text/plain',
        'text/csv',
        // Archives
        'application/zip',
        'application/x-zip-compressed',
        'application/x-rar-compressed',
      ];

      if (!allowedMimeTypes.includes(file.type)) {
        throw new Error(`File type not allowed: ${file.type}. Please upload images, PDFs, Office documents, or archives.`);
      }

      // Validar tamaño de archivo (10MB máximo)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        throw new Error(`File size exceeds 10MB limit. File size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
      }

      // Sanitizar nombre de archivo (remover espacios y tildes)
      const sanitizeFileName = (name: string) => {
        const noDiacritics = name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '');
        return noDiacritics
          .replace(/\s+/g, '-')
          .replace(/[^a-zA-Z0-9._-]/g, '-')
          .replace(/-+/g, '-')
          .toLowerCase();
      };

      // Generar nombre único del archivo
      const fileId = uuidv4();
      const fileName = `${fileId}-${sanitizeFileName(file.name)}`;
      const filePath = `projects/${projectId}/${fileName}`;

      // Subir archivo a Storage
      const { data, error: uploadError } = await supabase.storage
        .from('project-attachments')
        .upload(filePath, file, { contentType: file.type });

      if (uploadError) throw uploadError;

      // Generar URL firmada (signed URL) válida por 1 año para usuarios autenticados
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from('project-attachments')
        .createSignedUrl(filePath, 31536000); // 1 año en segundos

      let fileUrl: string;
      if (signedUrlError) {
        console.warn('Error creating signed URL, falling back to public URL:', signedUrlError);
        // Fallback: usar URL pública
        const { data: publicUrlData } = supabase.storage
          .from('project-attachments')
          .getPublicUrl(filePath);
        fileUrl = publicUrlData.publicUrl;
      } else {
        fileUrl = signedUrlData.signedUrl;
      }

      // Obtener usuario autenticado para RLS
      const { data: { user } } = await supabase.auth.getUser();

      // Crear registro en la BD
      const { data: attachment, error: insertError } = await supabase
        .from('project_attachments')
        .insert({
          project_id: projectId,
          file_name: file.name,
          file_url: fileUrl,
          file_type: file.type,
          file_size: file.size,
          created_by: user?.id,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      return this.mapProjectAttachment(attachment);
    } catch (e) {
      console.error('Error uploading attachment:', e);
      throw e;
    }
  }

  async deleteProjectAttachment(attachmentId: string): Promise<void> {
    try {
      // Obtener detalles del attachment
      const { data: attachment, error: fetchError } = await supabase
        .from('project_attachments')
        .select('*')
        .eq('id', attachmentId)
        .single();

      if (fetchError) throw fetchError;

      // Extraer el filepath de la URL del archivo
      const fileUrl = new URL(attachment.file_url);
      let filePath = '';
      const parts = fileUrl.pathname.split('/project-attachments/');
      if (parts.length >= 2) {
        filePath = parts[1];
      }

      // Eliminar archivo de Storage
      if (filePath) {
        const { error: deleteStorageError } = await supabase.storage
          .from('project-attachments')
          .remove([filePath]);

        if (deleteStorageError) console.warn('Error deleting file from storage:', deleteStorageError);
      }

      // Eliminar registro de la BD
      const { error: deleteDbError } = await supabase
        .from('project_attachments')
        .delete()
        .eq('id', attachmentId);

      if (deleteDbError) throw deleteDbError;
    } catch (e) {
      console.error('Error deleting attachment:', e);
      throw e;
    }
  }

  async getProjectAttachments(projectId: string): Promise<ProjectAttachment[]> {
    try {
      const { data, error } = await supabase
        .from('project_attachments')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return (data || []).map(this.mapProjectAttachment.bind(this));
    } catch (e) {
      console.warn('Error fetching attachments:', e);
      return [];
    }
  }

  async deleteProjectAttachmentsCascade(projectId: string): Promise<void> {
    try {
      // Obtener todos los attachments del proyecto
      const { data: attachments, error: fetchError } = await supabase
        .from('project_attachments')
        .select('*')
        .eq('project_id', projectId);

      if (fetchError) throw fetchError;

      // Eliminar archivos de Storage
      if (attachments && attachments.length > 0) {
        const filePaths: string[] = [];

        for (const attachment of attachments) {
          try {
            const fileUrl = new URL(attachment.file_url);
            let filePath = '';
            const parts = fileUrl.pathname.split('/project-attachments/');
            if (parts.length >= 2) {
              filePath = parts[1];
            }
            if (filePath) {
              filePaths.push(filePath);
            }
          } catch (urlError) {
            console.warn('Error parsing file URL:', attachment.file_url);
          }
        }

        if (filePaths.length > 0) {
          const { error: deleteStorageError } = await supabase.storage
            .from('project-attachments')
            .remove(filePaths);

          if (deleteStorageError) console.warn('Error deleting files from storage:', deleteStorageError);
        }
      }

      // Eliminar todos los registros de la BD (la cascade del FK lo haría, pero lo hacemos explícito)
      const { error: deleteDbError } = await supabase
        .from('project_attachments')
        .delete()
        .eq('project_id', projectId);

      if (deleteDbError) throw deleteDbError;
    } catch (e) {
      console.error('Error deleting project attachments cascade:', e);
      throw e;
    }
  }

  // --- User Profiles & Assignments ---

  // Get all user profiles for assignment selectors
  async getProfiles(): Promise<User[]> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, avatar, role')
        .order('name', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (e) {
      console.warn('Error fetching profiles:', e);
      return [];
    }
  }

  // Assign user to project
  async assignUserToProject(projectId: string, userId: string): Promise<void> {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      const { error } = await supabase
        .from('project_assignments')
        .insert({
          project_id: projectId,
          user_id: userId,
          assigned_by: user?.id,
        });

      if (error) throw error;
    } catch (e) {
      console.error('Error assigning user to project:', e);
      throw e;
    }
  }

  // Remove user from project
  async removeUserFromProject(assignmentId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('project_assignments')
        .delete()
        .eq('id', assignmentId);

      if (error) throw error;
    } catch (e) {
      console.error('Error removing user from project:', e);
      throw e;
    }
  }

  // Update project leader
  async updateProjectLeader(projectId: string, leaderId: string | null): Promise<void> {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ project_leader_id: leaderId })
        .eq('id', projectId);

      if (error) throw error;
    } catch (e) {
      console.error('Error updating project leader:', e);
      throw e;
    }
  }
}

export const db = new StorageService();
