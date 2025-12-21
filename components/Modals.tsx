
import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, AlertTriangle, Clock, Briefcase, User as UserIcon, Tag, Edit3, CheckCircle2 } from 'lucide-react';
import { AVATARS } from '../constants';
import { Project, Task } from '../types';
import { useAuth } from '../context/AuthContext';

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const BaseModal: React.FC<BaseModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl border border-border-color overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-color bg-gray-50 flex-shrink-0">
          <h3 className="font-bold text-lg text-text-main">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X size={20} className="text-text-muted" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Componente para el panel lateral de detalles de tarea
interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onEdit: (task: Task) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ isOpen, onClose, task, onEdit }) => {
  const { user } = useAuth();
  if (!task) return null;

  const canEdit = user?.role !== 'Viewer';

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-600 bg-red-50 border-red-100';
      case 'Medium': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'Low': return 'text-blue-600 bg-blue-50 border-blue-100';
      default: return 'text-gray-600 bg-gray-50 border-gray-100';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Done': return 'bg-green-100 text-green-700 border-green-200';
      case 'In Progress': return 'bg-primary/20 text-text-main border-primary/30';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No due date set';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className={`fixed inset-0 z-[60] flex justify-end transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose}></div>

      <div className={`relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-out border-l border-border-color ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header del Panel */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em]">Task Details</span>
            <div className="size-1.5 rounded-full bg-primary animate-pulse"></div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-text-muted transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Contenido del Panel */}
        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-10 custom-scrollbar">
          {/* Título y Badges */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${getPriorityColor(task.priority)}`}>
                {task.priority} Priority
              </span>
              <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase border ${getStatusBadge(task.status)}`}>
                {task.status}
              </span>
            </div>
            <h2 className="text-3xl font-bold text-text-main leading-tight tracking-tight">{task.title}</h2>
          </div>

          {/* Grid de Atributos */}
          <div className="grid grid-cols-2 gap-y-8 gap-x-10 p-6 bg-background-light rounded-2xl border border-border-color/60">
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                <Briefcase size={14} className="text-primary" /> Project
              </span>
              <p className="text-sm font-bold text-text-main">{task.project}</p>
            </div>
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                <Clock size={14} className="text-primary" /> Due Date
              </span>
              <p className="text-sm font-bold text-text-main">{formatDate(task.dueDate)}</p>
            </div>
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                <UserIcon size={14} className="text-primary" /> Assignee
              </span>
              <div className="flex items-center gap-2.5">
                {task.assignee ? (
                  <img src={task.assignee} alt="Assignee" className="size-7 rounded-full object-cover shadow-sm ring-2 ring-white" />
                ) : (
                  <div className="size-7 rounded-full bg-gray-200 border border-gray-300" />
                )}
                <span className="text-sm font-bold text-text-main">{task.assignee ? 'Responsible' : 'Unassigned'}</span>
              </div>
            </div>
            <div className="space-y-2">
              <span className="flex items-center gap-2 text-[10px] font-bold text-text-muted uppercase tracking-wider">
                <Tag size={14} className="text-primary" /> Reference
              </span>
              <p className="text-sm font-mono font-bold text-text-muted">#{task.id.split('-')[0].toUpperCase()}</p>
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-4">
            <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
              Description <div className="h-px flex-1 bg-gray-100"></div>
            </h4>
            <div className="prose prose-sm max-w-none">
              {task.description ? (
                <p className="text-base text-text-main/80 leading-relaxed font-medium whitespace-pre-wrap">
                  {task.description}
                </p>
              ) : (
                <p className="text-sm text-text-muted italic bg-gray-50 p-4 rounded-xl border border-dashed border-gray-200">
                  No additional information has been provided for this task.
                </p>
              )}
            </div>
          </div>

          {/* Actividad Reciente */}
          <div className="space-y-4 pt-4">
            <h4 className="text-[11px] font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
              Activity <div className="h-px flex-1 bg-gray-100"></div>
            </h4>
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 border border-green-100">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <p className="text-xs font-bold text-text-main">Task was moved to {task.status}</p>
                <p className="text-[10px] text-text-muted mt-0.5">Just now</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer del Panel */}
        <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex gap-3">
          {canEdit && (
            <button
              onClick={() => {
                onEdit(task);
                onClose();
              }}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-text-main text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-md active:scale-95"
            >
              <Edit3 size={18} /> Edit Task
            </button>
          )}
          <button
            onClick={onClose}
            className={`px-6 py-3.5 bg-white border border-border-color text-text-main rounded-xl font-bold text-sm hover:bg-gray-100 transition-all active:scale-95 ${!canEdit ? 'w-full' : ''}`}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-md shadow-2xl border border-border-color overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 flex flex-col items-center text-center">
          <div className="size-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-600" size={24} />
          </div>
          <h3 className="text-lg font-bold text-text-main mb-2">{title}</h3>
          <p className="text-text-muted text-sm mb-6">{message}</p>
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border-color font-bold text-text-muted hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Project;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    progress: 0,
    status: 'Planning' as const,
    dueDate: '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        client: initialData.client,
        description: initialData.description || '',
        progress: initialData.progress,
        status: initialData.status as any,
        dueDate: initialData.dueDate,
      });
    } else {
      setFormData({
        name: '',
        client: '',
        description: '',
        progress: 0,
        status: 'Planning',
        dueDate: new Date().toISOString().split('T')[0],
      });
    }
  }, [initialData, isOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-primary/20 text-text-main';
      case 'Review': return 'bg-orange-100 text-orange-700';
      case 'Planning': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-[#078816]/10 text-[#078816]';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...initialData,
      ...formData,
      statusColor: getStatusColor(formData.status),
      members: initialData ? initialData.members : [AVATARS.ana],
      icon: initialData ? initialData.icon : 'campaign',
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Project" : "Create New Project"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase mb-1">Project Name</label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={e => handleChange('name', e.target.value)}
            className="w-full rounded-xl border-border-color bg-background-light px-4 py-2.5 text-sm font-medium focus:border-primary focus:ring-primary"
            placeholder="e.g. Website Redesign"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-text-muted uppercase mb-1">Client</label>
          <input
            required
            type="text"
            value={formData.client}
            onChange={e => handleChange('client', e.target.value)}
            className="w-full rounded-xl border-border-color bg-background-light px-4 py-2.5 text-sm font-medium focus:border-primary focus:ring-primary"
            placeholder="e.g. Acme Corp"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-text-muted uppercase mb-1">Due Date</label>
          <div className="relative">
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={e => handleChange('dueDate', e.target.value)}
              className="w-full rounded-xl border-border-color bg-background-light px-4 py-2.5 text-sm font-medium focus:border-primary focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-text-muted uppercase mb-1">Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={e => handleChange('description', e.target.value)}
            className="w-full rounded-xl border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary resize-none"
            placeholder="Brief project description..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">Status</label>
            <select
              value={formData.status}
              onChange={e => handleChange('status', e.target.value)}
              className="w-full rounded-xl border-border-color bg-background-light px-4 py-2.5 text-sm font-medium focus:border-primary focus:ring-primary"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Review">Review</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">Progress: {formData.progress}%</label>
            <input
              type="range"
              min="0"
              max="100"
              value={formData.progress}
              onChange={e => handleChange('progress', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-3"
            />
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-3 border-t border-gray-100 mt-2">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text-main">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-primary rounded-full text-sm font-bold text-black hover:bg-[#e6e205] transition-colors shadow-sm">
            {initialData ? 'Save Changes' : 'Create Project'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  projects: any[];
  initialData?: Task;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onSubmit, projects, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [project, setProject] = useState('');
  const [priority, setPriority] = useState('Medium' as const);
  const [status, setStatus] = useState('Todo' as const);
  const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description || '');
      setProject(initialData.project);
      setPriority(initialData.priority as any);
      setStatus(initialData.status as any);
      setDueDate(initialData.dueDate);
    } else {
      setTitle('');
      setDescription('');
      setProject('');
      setPriority('Medium');
      setStatus('Todo');
      setDueDate(new Date().toISOString().split('T')[0]);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      project: project || 'General',
      priority,
      status,
      dueDate
    });
    if (!initialData) {
      setTitle('');
      setDescription('');
      setProject('');
    }
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Task" : "Add New Task"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase mb-1">Task Title</label>
          <input
            required
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full rounded-xl border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary"
            placeholder="What needs to be done?"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase mb-1">Description</label>
          <textarea
            rows={10}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full rounded-xl border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary min-h-[150px] resize-y"
            placeholder="Detailed description of the task..."
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">Project</label>
            <select
              value={project}
              onChange={e => setProject(e.target.value)}
              className="w-full rounded-xl border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary"
            >
              <option value="">Select Project</option>
              {projects.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as any)}
              className="w-full rounded-xl border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as any)}
              className="w-full rounded-xl border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary"
            >
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">Due Date</label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="w-full rounded-xl border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary"
            />
          </div>
        </div>
        <div className="pt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text-main">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-primary rounded-full text-sm font-bold text-black hover:bg-[#e6e205] transition-colors">
            {initialData ? 'Save Changes' : 'Add Task'}
          </button>
        </div>
      </form>
    </BaseModal>
  );
};

interface NewEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  defaultDate?: string;
}

export const NewEventModal: React.FC<NewEventModalProps> = ({ isOpen, onClose, onSubmit, defaultDate }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(defaultDate || '');
  const [time, setTime] = useState('12:00');
  const [type, setType] = useState('Meeting' as const);

  useEffect(() => {
    if (defaultDate) setDate(defaultDate);
  }, [defaultDate, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      date,
      time,
      type
    });
    setTitle('');
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Add Event">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase mb-1">Event Title</label>
          <input
            required
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full rounded-xl border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary"
            placeholder="e.g. Sprint Planning"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full rounded-xl border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1">Time</label>
            <input
              type="time"
              value={time}
              onChange={e => setTime(e.target.value)}
              className="w-full rounded-xl border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary"
            />
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase mb-1">Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value as any)}
            className="w-full rounded-xl border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary"
          >
            <option value="Meeting">Meeting</option>
            <option value="Deadline">Deadline</option>
            <option value="Review">Review</option>
          </select>
        </div>
        <div className="pt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text-main">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-primary rounded-full text-sm font-bold text-black hover:bg-[#e6e205] transition-colors">Add Event</button>
        </div>
      </form>
    </BaseModal>
  );
};

interface NewMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const NewMemberModal: React.FC<NewMemberModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Select random avatar for simplicity
    const randomAvatar = Object.values(AVATARS)[Math.floor(Math.random() * Object.values(AVATARS).length)];

    onSubmit({
      name,
      email,
      role,
      status: 'Offline',
      avatar: randomAvatar
    });
    setName('');
    setEmail('');
    setRole('');
    onClose();
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Invite New Member">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase mb-1">Full Name</label>
          <input
            required
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full rounded-xl border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary"
            placeholder="e.g. John Doe"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase mb-1">Email Address</label>
          <input
            required
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-xl border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary"
            placeholder="e.g. john@company.com"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-text-muted uppercase mb-1">Role</label>
          <input
            required
            type="text"
            value={role}
            onChange={e => setRole(e.target.value)}
            className="w-full rounded-xl border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary"
            placeholder="e.g. Frontend Developer"
          />
        </div>
        <div className="pt-2 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text-main">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-primary rounded-full text-sm font-bold text-black hover:bg-[#e6e205] transition-colors">Send Invite</button>
        </div>
      </form>
    </BaseModal>
  );
};
