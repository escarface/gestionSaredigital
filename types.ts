
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  bio?: string;
  phone?: string;
  timezone?: string;
  language?: string;
  theme?: string;
  notificationsEnabled?: boolean;
  emailAlerts?: boolean;
  viewMode?: string;
}

export interface ProjectAttachment {
  id: string;
  project_id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  client: string;
  description?: string;
  progress: number;
  status: 'In Progress' | 'Review' | 'Planning' | 'Completed';
  statusColor: string;
  members: string[]; // URLs
  extraMembers?: number;
  icon: string;
  dueDate: string;
  createdById?: string;
  createdByName?: string;
  createdByAvatar?: string;
  attachments?: ProjectAttachment[];
}

export interface Task {
  id: string;
  title: string;
  project: string;
  description?: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Todo' | 'In Progress' | 'Done';
  assignee?: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface KPI {
  label: string;
  value: string;
  change: string;
  changePositive: boolean;
  icon: string;
}

export interface ActivityData {
  day: string;
  tasks: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  status: 'Online' | 'Offline' | 'Busy';
  email: string;
}

export interface MeetingNote {
  id: string;
  projectId: string;
  content: string;
  createdAt: string;
  createdBy?: string; // Optional, usually managed by backend
}

export interface ProjectNote {
  id: string;
  projectId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // ISO Date string YYYY-MM-DD
  type: 'Meeting' | 'Deadline' | 'Review';
  time: string;
}

export interface ConfirmationConfig {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  relatedType?: 'project' | 'task' | 'team' | 'system';
  relatedId?: string;
  read: boolean;
  createdAt: string;
}
