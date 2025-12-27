
import React, { useState, useEffect } from 'react';
import { X, Calendar as CalendarIcon, AlertTriangle, Clock, Briefcase, User as UserIcon, Tag, Edit3, CheckCircle2, Upload, Download, Trash2, Eye, FileText, Image as ImageIcon, File } from 'lucide-react';
import { AVATARS } from '../constants';
import { Project, Task, ProjectAttachment } from '../types';
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
  onAttachmentUpload?: (projectId: string, file: File) => Promise<any>;
  onAttachmentDelete?: (attachmentId: string) => Promise<void>;
  onConfirmDelete?: () => void;
  initialData?: Project;
  isLoading?: boolean;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  onAttachmentUpload,
  onAttachmentDelete,
  initialData,
  isLoading 
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'description' | 'attachments'>('basic');
  const [formData, setFormData] = useState({
    name: '',
    client: '',
    description: '',
    progress: 0,
    status: 'Planning' as const,
    dueDate: '',
  });
  const [attachments, setAttachments] = useState<ProjectAttachment[]>([]);
  const [queuedFiles, setQueuedFiles] = useState<File[]>([]);
  const [uploadingFile, setUploadingFile] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [showAttachmentConfirm, setShowAttachmentConfirm] = useState<string | null>(null);

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
      setAttachments(initialData.attachments || []);
      setQueuedFiles([]);
    } else {
      setFormData({
        name: '',
        client: '',
        description: '',
        progress: 0,
        status: 'Planning',
        dueDate: new Date().toISOString().split('T')[0],
      });
      setAttachments([]);
      setQueuedFiles([]);
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

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...initialData,
      ...formData,
      statusColor: getStatusColor(formData.status),
      members: initialData ? initialData.members : [AVATARS.ana],
      icon: initialData ? initialData.icon : 'campaign',
      attachments,
      __queuedFiles: queuedFiles,
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image')) return <ImageIcon size={16} className="text-blue-500" />;
    if (fileType.includes('pdf')) return <FileText size={16} className="text-red-500" />;
    return <File size={16} className="text-gray-500" />;
  };

  const isImageFile = (fileType: string) => fileType.startsWith('image/');
  const isPdfFile = (fileType: string) => fileType === 'application/pdf';

  const handleFileInput = async (files: FileList | null) => {
    if (!files) return;

    for (const file of Array.from(files)) {
      try {
        // Validación cliente 10MB
        const maxSize = 10 * 1024 * 1024;
        if (file.size > maxSize) {
          console.error('File exceeds 10MB:', file.name);
          continue;
        }

        if (initialData && initialData.id && onAttachmentUpload) {
          // Proyecto existente: subir inmediatamente
          console.log('Modals.handleFileInput uploading to existing project:', { projectId: initialData.id, fileName: file.name });
          setUploadingFile(file.name);
          const newAttachment = await onAttachmentUpload(initialData.id, file);
          console.log('Upload result:', newAttachment);
          if (newAttachment) {
            setAttachments(prev => [...prev, newAttachment]);
          }
        } else {
          // No hay projectId aún: en creación, encolar archivos
          console.log('Modals.handleFileInput queueing file for new project:', file.name);
          setQueuedFiles(prev => [...prev, file]);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        setUploadingFile(null);
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileInput(e.dataTransfer.files);
  };

  const handleAttachmentDelete = async (attachmentId: string) => {
    try {
      if (onAttachmentDelete) {
        await onAttachmentDelete(attachmentId);
        setAttachments(prev => prev.filter(a => a.id !== attachmentId));
      }
    } catch (error) {
      console.error('Error deleting attachment:', error);
    }
    setShowAttachmentConfirm(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-border-color overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-color bg-gray-50 flex-shrink-0">
          <h3 className="font-bold text-lg text-text-main">{initialData ? "Edit Project" : "Create New Project"}</h3>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X size={20} className="text-text-muted" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 px-6 pt-4 border-b border-border-color bg-white flex-shrink-0">
          {(['basic', 'description', 'attachments'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-bold text-sm uppercase tracking-wider border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-text-muted hover:text-text-main'
              }`}
            >
              {tab === 'basic' && 'Basic Info'}
              {tab === 'description' && 'Description'}
              {tab === 'attachments' && `Attachments (${attachments.length + queuedFiles.length})`}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* BASIC INFO TAB */}
            {activeTab === 'basic' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-2">Project Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={e => handleChange('name', e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-background-light px-4 py-2.5 text-sm font-medium focus:border-primary focus:ring-primary focus:ring-1"
                    placeholder="e.g. Website Redesign"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-2">Client</label>
                  <input
                    required
                    type="text"
                    value={formData.client}
                    onChange={e => handleChange('client', e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-background-light px-4 py-2.5 text-sm font-medium focus:border-primary focus:ring-primary focus:ring-1"
                    placeholder="e.g. Acme Corp"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-2">Due Date</label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={e => handleChange('dueDate', e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-background-light px-4 py-2.5 text-sm font-medium focus:border-primary focus:ring-primary focus:ring-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => handleChange('status', e.target.value)}
                      className="w-full rounded-xl border border-border-color bg-background-light px-4 py-2.5 text-sm font-medium focus:border-primary focus:ring-primary focus:ring-1"
                    >
                      <option value="Planning">Planning</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Review">Review</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-text-muted uppercase mb-2">Progress: {formData.progress}%</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={e => handleChange('progress', parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary mt-2"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* DESCRIPTION TAB */}
            {activeTab === 'description' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-text-muted uppercase mb-2">Project Description</label>
                  <textarea
                    value={formData.description}
                    onChange={e => handleChange('description', e.target.value)}
                    className="w-full rounded-xl border border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-primary focus:ring-1 resize-none"
                    rows={10}
                    placeholder="Detailed project description, goals, scope, and any important notes..."
                  />
                  <p className="text-xs text-text-muted mt-2">{formData.description.length} characters</p>
                </div>
              </div>
            )}

            {/* ATTACHMENTS TAB */}
            {activeTab === 'attachments' && (
              <div className="space-y-4">
                {/* Drag & Drop Zone (siempre visible, en creación se encola) */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 transition-colors ${
                    dragOver ? 'border-primary bg-primary/5' : 'border-border-color bg-gray-50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={24} className="text-primary" />
                    <div className="text-center">
                      <p className="text-sm font-bold text-text-main">Drag and drop files here or</p>
                      <label className="text-sm font-bold text-primary cursor-pointer hover:underline">
                        click to browse
                        <input
                          type="file"
                          multiple
                          className="hidden"
                          onChange={(e) => handleFileInput(e.target.files)}
                          disabled={uploadingFile !== null}
                        />
                      </label>
                    </div>
                    <p className="text-xs text-text-muted">Maximum file size: 10MB</p>
                    {!initialData && (
                      <p className="text-xs text-text-muted">Files will upload after creating the project.</p>
                    )}
                  </div>
                </div>

                {/* Attachments List */}
                {attachments.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-text-muted uppercase">Files ({attachments.length})</p>
                    {attachments.map((attachment) => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-border-color hover:bg-gray-100 transition-colors group">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {getFileIcon(attachment.file_type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-text-main truncate">{attachment.file_name}</p>
                            <p className="text-xs text-text-muted">{formatFileSize(attachment.file_size)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                          {isImageFile(attachment.file_type) && (
                            <button
                              type="button"
                              onClick={() => setActiveTab('attachments')} // Just to show preview logic
                              className="p-1.5 hover:bg-blue-100 text-blue-600 rounded transition-colors"
                              title="Preview"
                            >
                              <Eye size={16} />
                            </button>
                          )}
                          <a
                            href={attachment.file_url}
                            download
                            className="p-1.5 hover:bg-green-100 text-green-600 rounded transition-colors"
                            title="Download"
                          >
                            <Download size={16} />
                          </a>
                          <button
                            type="button"
                            onClick={() => setShowAttachmentConfirm(attachment.id)}
                            className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <File size={32} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-sm text-text-muted">No files attached yet</p>
                  </div>
                )}

                {/* Queued Files (creation only) */}
                {queuedFiles.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-text-muted uppercase">Queued Files ({queuedFiles.length})</p>
                    {queuedFiles.map((file, idx) => (
                      <div key={`${file.name}-${idx}`} className="flex items-center justify-between p-3 bg-white rounded-lg border border-dashed border-border-color">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {getFileIcon(file.type)}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-text-main truncate">{file.name}</p>
                            <p className="text-xs text-text-muted">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setQueuedFiles(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1.5 hover:bg-red-100 text-red-600 rounded transition-colors"
                          title="Remove from queue"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Image Preview */}
                {attachments.some(a => isImageFile(a.file_type)) && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-text-muted uppercase">Image Preview</p>
                    <div className="grid grid-cols-3 gap-2">
                      {attachments
                        .filter(a => isImageFile(a.file_type))
                        .map((attachment) => (
                          <img
                            key={attachment.id}
                            src={attachment.file_url}
                            alt={attachment.file_name}
                            className="w-full h-24 object-cover rounded-lg border border-border-color"
                          />
                        ))}
                    </div>
                  </div>
                )}

                {/* PDF Preview */}
                {attachments.some(a => isPdfFile(a.file_type)) && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-text-muted uppercase">PDF Files</p>
                    {attachments
                      .filter(a => isPdfFile(a.file_type))
                      .map((attachment) => (
                        <a
                          key={attachment.id}
                          href={attachment.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100 transition-colors"
                        >
                          <FileText size={16} className="text-red-500 flex-shrink-0" />
                          <span className="text-sm font-bold text-red-700 truncate">{attachment.file_name}</span>
                          <span className="text-xs text-red-600 ml-auto flex-shrink-0">Open PDF</span>
                        </a>
                      ))}
                  </div>
                )}
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border-color bg-gray-50 flex justify-end gap-3 flex-shrink-0">
          <button 
            onClick={onClose} 
            className="px-4 py-2 text-sm font-bold text-text-muted hover:text-text-main transition-colors"
            disabled={isLoading}
          >
            Cancel
          </button>
          {activeTab !== 'attachments' && (
            <button 
              onClick={handleSubmit} 
              className="px-6 py-2 bg-primary rounded-full text-sm font-bold text-black hover:bg-[#e6e205] transition-colors shadow-sm disabled:opacity-50"
              disabled={isLoading}
            >
              {initialData ? 'Save Changes' : 'Create Project'}
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal para borrar attachment */}
      {showAttachmentConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 pointer-events-auto">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAttachmentConfirm(null)}></div>
          <div className="relative bg-white rounded-2xl w-full max-w-sm shadow-2xl border border-border-color p-6">
            <div className="flex flex-col items-center text-center">
              <div className="size-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                <AlertTriangle className="text-red-600" size={24} />
              </div>
              <h3 className="text-lg font-bold text-text-main mb-2">Delete Attachment?</h3>
              <p className="text-text-muted text-sm mb-6">This action cannot be undone</p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowAttachmentConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border-color font-bold text-text-muted hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAttachmentDelete(showAttachmentConfirm)}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
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
