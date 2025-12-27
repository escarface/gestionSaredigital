export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          avatar: string | null
          role: 'Admin' | 'Editor' | 'Viewer'
          bio: string | null
          phone: string | null
          timezone: string
          language: string
          theme: string
          notifications_enabled: boolean
          email_alerts: boolean
          view_mode: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar?: string | null
          role?: 'Admin' | 'Editor' | 'Viewer'
          bio?: string | null
          phone?: string | null
          timezone?: string
          language?: string
          theme?: string
          notifications_enabled?: boolean
          email_alerts?: boolean
          view_mode?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar?: string | null
          role?: 'Admin' | 'Editor' | 'Viewer'
          bio?: string | null
          phone?: string | null
          timezone?: string
          language?: string
          theme?: string
          notifications_enabled?: boolean
          email_alerts?: boolean
          view_mode?: string
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          client: string
          description: string | null
          progress: number
          status: 'In Progress' | 'Review' | 'Planning' | 'Completed'
          status_color: string
          members: string[]
          extra_members: number
          icon: string
          due_date: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          client: string
          description?: string | null
          progress?: number
          status?: 'In Progress' | 'Review' | 'Planning' | 'Completed'
          status_color?: string
          members?: string[]
          extra_members?: number
          icon?: string
          due_date: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          client?: string
          description?: string | null
          progress?: number
          status?: 'In Progress' | 'Review' | 'Planning' | 'Completed'
          status_color?: string
          members?: string[]
          extra_members?: number
          icon?: string
          due_date?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          project: string
          description: string | null
          due_date: string
          priority: 'High' | 'Medium' | 'Low'
          status: 'Todo' | 'In Progress' | 'Done'
          assignee: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          project: string
          description?: string | null
          due_date: string
          priority?: 'High' | 'Medium' | 'Low'
          status?: 'Todo' | 'In Progress' | 'Done'
          assignee?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          project?: string
          description?: string | null
          due_date?: string
          priority?: 'High' | 'Medium' | 'Low'
          status?: 'Todo' | 'In Progress' | 'Done'
          assignee?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      team_members: {
        Row: {
          id: string
          name: string
          role: string
          avatar: string
          status: 'Online' | 'Offline' | 'Busy'
          email: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          role: string
          avatar: string
          status?: 'Online' | 'Offline' | 'Busy'
          email: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          role?: string
          avatar?: string
          status?: 'Online' | 'Offline' | 'Busy'
          email?: string
          created_at?: string
          updated_at?: string
        }
      }
      calendar_events: {
        Row: {
          id: string
          title: string
          date: string
          type: 'Meeting' | 'Deadline' | 'Review'
          time: string
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          date: string
          type?: 'Meeting' | 'Deadline' | 'Review'
          time: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          date?: string
          type?: 'Meeting' | 'Deadline' | 'Review'
          time?: string
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      project_attachments: {
        Row: {
          id: string
          project_id: string
          file_name: string
          file_url: string
          file_type: string
          file_size: number
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          file_name: string
          file_url: string
          file_type: string
          file_size: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          file_name?: string
          file_url?: string
          file_type?: string
          file_size?: number
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'info' | 'success' | 'warning' | 'error'
          related_type: 'project' | 'task' | 'team' | 'system' | null
          related_id: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id: string
          user_id: string
          title: string
          message: string
          type?: 'info' | 'success' | 'warning' | 'error'
          related_type?: 'project' | 'task' | 'team' | 'system' | null
          related_id?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'info' | 'success' | 'warning' | 'error'
          related_type?: 'project' | 'task' | 'team' | 'system' | null
          related_id?: string | null
          read?: boolean
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
