import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreHorizontal, Calendar, GripVertical, Filter, Edit, Clock, Trash2, AlertCircle, CheckCircle, Circle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { NewTaskModal, TaskDetailModal } from './Modals';
import { Task } from '../types';

const TasksPage: React.FC = () => {
  const { tasks, projects, addTask, editTask, deleteTask, updateTaskStatus, askConfirmation } = useApp();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState('All');
  
  const [activeMenuTask, setActiveMenuTask] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const canEdit = user?.role !== 'Viewer';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuTask(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const columns = ['Todo', 'In Progress', 'Done'];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-700 bg-red-100 border-red-200';
      case 'Medium': return 'text-orange-700 bg-orange-100 border-orange-200';
      case 'Low': return 'text-blue-700 bg-blue-100 border-blue-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Todo': return 'text-gray-500 bg-gray-100';
      case 'In Progress': return 'text-primary bg-primary/10 border-primary/20';
      case 'Done': return 'text-green-700 bg-green-100 border-green-200';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No Date';
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  const getDaysUntilDue = (dateStr: string): number | null => {
    if (!dateStr) return null;
    try {
      const due = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      due.setHours(0, 0, 0, 0);
      return Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    } catch {
      return null;
    }
  };

  const getDueStatus = (dateStr: string) => {
    const days = getDaysUntilDue(dateStr);
    if (days === null) return 'none';
    if (days < 0) return 'overdue';
    if (days === 0) return 'today';
    if (days <= 2) return 'soon';
    return 'normal';
  };

  const filteredTasks = selectedProject === 'All' 
    ? tasks 
    : tasks.filter(t => t.project === selectedProject);

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
    setActiveMenuTask(null);
  };

  const handleViewTask = (task: Task) => {
    setViewingTask(task);
    setIsDetailModalOpen(true);
  };

  const handleModalSubmit = (data: any) => {
    if (editingTask) {
      editTask({ ...editingTask, ...data });
    } else {
      addTask(data);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    if (!canEdit) {
      e.preventDefault();
      return;
    }
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', taskId);
  };

  const handleDragOver = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (!canEdit) return;
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDrop = (e: React.DragEvent, status: string) => {
    e.preventDefault();
    if (!canEdit) return;
    const taskId = e.dataTransfer.getData('text/plain');
    
    if (taskId) {
      updateTaskStatus(taskId, status);
    }
    
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedTaskId(null);
    setDragOverColumn(null);
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Tasks Board</h2>
          <p className="text-text-muted text-xs mt-0.5">
            {canEdit ? 'Drag and drop tasks to update progress' : 'View only mode enabled'}
          </p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto items-center">
          <div className="relative flex-1 sm:w-56">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
              <Filter size={16} />
            </div>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full h-10 pl-9 pr-8 bg-white border border-border-color rounded-lg text-xs font-bold text-text-main focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <option value="All">All Projects</option>
              {projects.map(p => (
                <option key={p.id} value={p.name}>{p.name}</option>
              ))}
            </select>
          </div>

          {canEdit && (
            <button 
              onClick={handleAddTask}
              className="flex items-center justify-center rounded-lg px-4 h-10 bg-primary hover:bg-[#e6e205] transition-colors text-black text-xs font-bold shadow-sm active:scale-95 duration-150 shrink-0"
            >
              <Plus size={18} className="mr-1.5" />
              Add Task
            </button>
          )}
        </div>
      </div>

      {/* Board Container */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <div className="flex gap-5 min-w-[1200px] h-[calc(100vh-140px)]">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col);
            const isOver = dragOverColumn === col;

            return (
              <div 
                key={col} 
                data-column={col}
                onDragOver={(e) => handleDragOver(e, col)}
                onDrop={(e) => handleDrop(e, col)}
                className={`flex-1 flex flex-col rounded-2xl transition-all duration-200 ${
                  isOver 
                    ? 'bg-primary/5 border-2 border-primary border-dashed' 
                    : 'bg-gray-100/50 border border-border-color/50'
                }`}
              >
                {/* Column Header */}
                <div className="flex justify-between items-center p-4 pb-3 border-b border-border-color/50">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${
                      col === 'Todo' ? 'bg-gray-200 text-gray-600' :
                      col === 'In Progress' ? 'bg-primary/20 text-text-main' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {col === 'Todo' && <Circle size={18} />}
                      {col === 'In Progress' && <AlertCircle size={18} />}
                      {col === 'Done' && <CheckCircle size={18} />}
                    </div>
                    <h3 className="font-bold text-text-main text-lg">{col}</h3>
                    <span className="bg-gray-200 text-gray-600 text-sm font-bold px-3 py-1 rounded-full">{colTasks.length}</span>
                  </div>
                  {canEdit && (
                    <button 
                      onClick={handleAddTask}
                      className="text-text-muted hover:text-text-main hover:bg-white/50 p-2 rounded-lg transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  )}
                </div>

                {/* Tasks Container */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
                  {colTasks.map(task => {
                    const isDragging = draggedTaskId === task.id;
                    const dueStatus = getDueStatus(task.dueDate);
                    
                    return (
                      <div 
                        key={task.id}
                        draggable={canEdit}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleViewTask(task)}
                        className={`bg-white rounded-xl border border-border-color shadow-sm hover:shadow-lg transition-all duration-200 select-none cursor-pointer ${
                          canEdit ? 'active:cursor-grabbing' : ''
                        } ${
                          isDragging ? 'opacity-40 scale-95 rotate-2' : 'opacity-100'
                        } ${
                          dueStatus === 'overdue' ? 'border-red-300 bg-red-50/30' :
                          dueStatus === 'today' ? 'border-orange-300 bg-orange-50/30' :
                          ''
                        }`}
                      >
                        <div className="p-5">
                          {/* Header with priority and menu */}
                          <div className="flex justify-between items-start mb-3">
                            <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                            {canEdit && (
                              <>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveMenuTask(activeMenuTask === task.id ? null : task.id);
                                  }}
                                  className="text-text-muted hover:text-text-main transition-colors cursor-pointer p-1.5 rounded-lg hover:bg-gray-100"
                                >
                                  <MoreHorizontal size={18} />
                                </button>

                                {activeMenuTask === task.id && (
                                  <div 
                                    ref={menuRef}
                                    className="absolute right-4 top-14 w-40 bg-white rounded-xl shadow-2xl border border-border-color z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button 
                                      onClick={() => handleEditTask(task)}
                                      className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-gray-50 flex items-center gap-3 text-text-main"
                                    >
                                      <Edit size={16} /> Edit
                                    </button>
                                    <button 
                                      onClick={() => {
                                        setActiveMenuTask(null);
                                        askConfirmation(
                                          'Delete Task',
                                          `Are you sure you want to delete "${task.title}"?`,
                                          () => deleteTask(task.id)
                                        );
                                      }}
                                      className="w-full text-left px-4 py-3 text-sm font-bold hover:bg-red-50 flex items-center gap-3 text-red-600 border-t border-border-color"
                                    >
                                      <Trash2 size={16} /> Delete
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                          
                          {/* Title */}
                          <h4 className="font-bold text-text-main text-lg leading-snug mb-2">{task.title}</h4>

                          {/* Description preview */}
                          {task.description && (
                            <p className="text-sm text-text-muted mb-4 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {/* Project badge */}
                          <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                            <p className="text-sm font-bold text-text-main opacity-70 uppercase tracking-wide">{task.project}</p>
                          </div>

                          {/* Footer with due date and assignee */}
                          <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                            <div className="flex flex-col gap-1">
                              <span className="text-[10px] uppercase font-bold text-text-muted tracking-wider">Due Date</span>
                              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold ${
                                dueStatus === 'overdue' ? 'bg-red-100 text-red-700' :
                                dueStatus === 'today' ? 'bg-orange-100 text-orange-700' :
                                dueStatus === 'soon' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-text-main'
                              }`}>
                                <Clock size={14} className={
                                  dueStatus === 'overdue' ? 'text-red-600' :
                                  dueStatus === 'today' ? 'text-orange-600' :
                                  'text-primary'
                                } />
                                <span>{formatDate(task.dueDate)}</span>
                                {dueStatus === 'today' && <span className="text-[10px]">(Today!)</span>}
                                {dueStatus === 'soon' && <span className="text-[10px]">(Soon)</span>}
                              </div>
                            </div>
                            {task.assignee ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-text-muted font-bold">Assigned</span>
                                <img src={task.assignee} alt="Assignee" className="w-9 h-9 rounded-full object-cover shadow-md ring-2 ring-white" />
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-text-muted font-bold">Unassigned</span>
                                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 ring-2 ring-white">?</div>
                              </div>
                            )}
                          </div>

                          {/* Time tracking */}
                          {(task.estimatedHours || task.actualHours) && (
                            <div className="flex gap-4 mt-3 pt-3 border-t border-gray-100">
                              {task.estimatedHours && (
                                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                                  <span className="font-bold">Est:</span>
                                  <span>{task.estimatedHours}h</span>
                                </div>
                              )}
                              {task.actualHours && (
                                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                                  <span className="font-bold">Actual:</span>
                                  <span>{task.actualHours}h</span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {canEdit && colTasks.length === 0 && (
                    <div className="h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center text-text-muted text-sm font-medium gap-2">
                      <Plus size={24} className="opacity-50" />
                      <span>Drop items here</span>
                      <button 
                        onClick={handleAddTask}
                        className="text-primary font-bold text-sm hover:underline mt-2"
                      >
                        Or create a task
                      </button>
                    </div>
                  )}

                  {canEdit && (
                    <button 
                      onClick={handleAddTask}
                      className="w-full py-4 text-sm font-bold text-text-muted hover:text-text-main hover:bg-white/60 rounded-xl transition-colors border border-dashed border-border-color flex items-center justify-center gap-2"
                    >
                      <Plus size={18} />
                      Quick Task
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <NewTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        projects={projects}
        initialData={editingTask}
      />

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        task={viewingTask}
        onEdit={handleEditTask}
      />
    </div>
  );
};

export default TasksPage;
