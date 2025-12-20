
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'Admin' | 'Editor' | 'Viewer';
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
