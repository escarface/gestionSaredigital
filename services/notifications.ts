import { Notification } from '../types';
import { supabase } from './supabase';
import { v4 as uuidv4 } from 'uuid';

class NotificationService {
  // Helper para convertir datos de Supabase al formato de la app
  private mapNotification(dbNotification: any): Notification {
    return {
      id: dbNotification.id,
      userId: dbNotification.user_id,
      title: dbNotification.title,
      message: dbNotification.message,
      type: dbNotification.type,
      relatedType: dbNotification.related_type,
      relatedId: dbNotification.related_id,
      read: dbNotification.read,
      createdAt: dbNotification.created_at,
    };
  }

  // Obtener todas las notificaciones del usuario
  async getNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapNotification);
    } catch (e) {
      console.warn('Error fetching notifications:', e);
      return [];
    }
  }

  // Obtener solo notificaciones no leídas
  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(this.mapNotification);
    } catch (e) {
      console.warn('Error fetching unread notifications:', e);
      return [];
    }
  }

  // Contar notificaciones no leídas
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
      return count || 0;
    } catch (e) {
      console.warn('Error counting unread notifications:', e);
      return 0;
    }
  }

  // Crear una nueva notificación
  async createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<void> {
    try {
      // @ts-ignore - TypeScript inference issue with Supabase types
      const { data, error } = await supabase.from('notifications').insert({
        id: uuidv4(),
        user_id: notification.userId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        related_type: notification.relatedType || null,
        related_id: notification.relatedId || null, // Convertir cadena vacía a null
        read: false,
      });

      if (error) {
        console.error('❌ Supabase error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }
      
      // Disparar evento para actualizar el NotificationCenter
      window.dispatchEvent(new Event('notificationCreated'));
      console.log('✅ Notification created successfully:', data);
    } catch (e) {
      console.error('❌ Error creating notification:', e);
      throw e;
    }
  }

  // Marcar una notificación como leída
  async markAsRead(notificationId: string): Promise<void> {
    try {
      // @ts-ignore - TypeScript inference issue with Supabase types
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (e) {
      console.error('Error marking notification as read:', e);
      throw e;
    }
  }

  // Marcar todas las notificaciones como leídas
  async markAllAsRead(userId: string): Promise<void> {
    try {
      // @ts-ignore - TypeScript inference issue with Supabase types
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
    } catch (e) {
      console.error('Error marking all notifications as read:', e);
      throw e;
    }
  }

  // Eliminar una notificación
  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);

      if (error) throw error;
    } catch (e) {
      console.error('Error deleting notification:', e);
      throw e;
    }
  }

  // Eliminar todas las notificaciones leídas
  async deleteAllRead(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)
        .eq('read', true);

      if (error) throw error;
    } catch (e) {
      console.error('Error deleting read notifications:', e);
      throw e;
    }
  }

  // Notificar a un usuario sobre un proyecto
  async notifyProjectUpdate(userId: string, projectName: string, projectId: string, action: string): Promise<void> {
    await this.createNotification({
      userId,
      title: 'Project Update',
      message: `Project "${projectName}" has been ${action}`,
      type: 'info',
      relatedType: 'project',
      relatedId: projectId,
      read: false,
    });
  }

  // Notificar a un usuario sobre una tarea
  async notifyTaskAssigned(userId: string, taskTitle: string, taskId: string, projectName: string): Promise<void> {
    await this.createNotification({
      userId,
      title: 'Task Assigned',
      message: `You have been assigned to "${taskTitle}" in ${projectName}`,
      type: 'info',
      relatedType: 'task',
      relatedId: taskId,
      read: false,
    });
  }

  // Notificar sobre un deadline cercano
  async notifyDeadlineApproaching(userId: string, taskTitle: string, taskId: string, daysRemaining: number): Promise<void> {
    await this.createNotification({
      userId,
      title: 'Deadline Approaching',
      message: `"${taskTitle}" is due in ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`,
      type: 'warning',
      relatedType: 'task',
      relatedId: taskId,
      read: false,
    });
  }
}

export const notificationService = new NotificationService();
export default notificationService;
