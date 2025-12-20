
import React, { useState, useRef, useEffect } from 'react';
import { Plus, MoreHorizontal, Calendar, GripVertical, Filter, Edit, Clock, Trash2 } from 'lucide-react';
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
      case 'High': return 'text-red-600 bg-red-50';
      case 'Medium': return 'text-orange-600 bg-orange-50';
      case 'Low': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
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
      // @ts-ignore
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
    <div className="flex flex-col gap-6 h-full animate-in fade-in duration-300">
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Tasks Board</h2>
          <p className="text-text-muted text-sm">
            {canEdit ? 'Drag and drop tasks to update progress' : 'View only mode enabled'}
          </p>
        </div>
        
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-text-muted">
              <Filter size={16} />
            </div>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="w-full h-10 pl-9 pr-8 bg-white border border-border-color rounded-full text-sm font-bold text-text-main focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none cursor-pointer hover:bg-gray-50 transition-colors"
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
              className="flex items-center justify-center rounded-full px-4 h-10 bg-primary hover:bg-[#e6e205] transition-colors text-black text-sm font-bold shadow-sm active:scale-95 duration-150 shrink-0"
            >
              <Plus size={18} className="mr-2" />
              Add Task
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-6 min-w-[900px] h-full pb-4">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col);
            const isOver = dragOverColumn === col;

            return (
              <div 
                key={col} 
                data-column={col}
                onDragOver={(e) => handleDragOver(e, col)}
                onDrop={(e) => handleDrop(e, col)}
                className={`flex-1 flex flex-col gap-4 rounded-2xl p-4 border transition-colors duration-200 ${
                  isOver 
                    ? 'bg-primary/10 border-primary border-dashed' 
                    : 'bg-white/50 border-border-color/50'
                }`}
              >
                <div className="flex justify-between items-center px-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-text-main">{col}</h3>
                    <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{colTasks.length}</span>
                  </div>
                  {canEdit && <button onClick={handleAddTask} className="text-text-muted hover:text-text-main"><Plus size={18} /></button>}
                </div>

                <div className="flex flex-col gap-3 min-h-[100px]">
                  {colTasks.map(task => {
                    const isDragging = draggedTaskId === task.id;
                    return (
                      <div 
                        key={task.id}
                        draggable={canEdit}
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onDragEnd={handleDragEnd}
                        onClick={() => handleViewTask(task)}
                        className={`bg-white p-4 rounded-xl border border-border-color shadow-sm hover:shadow-md transition-all group select-none relative cursor-pointer ${
                          canEdit ? 'active:cursor-grabbing' : ''
                        } ${
                          isDragging ? 'opacity-40 scale-95' : 'opacity-100'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                          {canEdit && (
                            <>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveMenuTask(activeMenuTask === task.id ? null : task.id);
                                }}
                                className="text-text-muted hover:text-text-main transition-opacity cursor-pointer p-1 -mr-2 -mt-1 rounded-full hover:bg-gray-100"
                              >
                                <MoreHorizontal size={16} />
                              </button>

                              {activeMenuTask === task.id && (
                                <div 
                                  ref={menuRef}
                                  className="absolute right-2 top-8 w-32 bg-white rounded-xl shadow-xl border border-border-color z-20 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <button 
                                    onClick={() => handleEditTask(task)}
                                    className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-text-main"
                                  >
                                    <Edit size={14} /> Edit
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setActiveMenuTask(null);
                                      askConfirmation(
                                        'Delete Task',
                                        `Are you sure you want to delete "${task.title}"? This action cannot be undone.`,
                                        () => deleteTask(task.id)
                                      );
                                    }}
                                    className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-red-50 flex items-center gap-2 text-red-600 border-t border-border-color"
                                  >
                                    <Trash2 size={14} /> Delete
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                        
                        <div className="flex items-start gap-2 mb-1.5">
                           {canEdit && (
                             <div className="mt-1 text-gray-300">
                               <GripVertical size={14} />
                             </div>
                           )}
                           <h4 className="font-bold text-text-main leading-tight">{task.title}</h4>
                        </div>

                        {task.description && (
                          <p className="text-xs text-text-muted mb-3 ml-5 line-clamp-3 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center gap-1.5 ml-5 mb-3">
                          <div className="size-1.5 rounded-full bg-primary"></div>
                          <p className="text-[11px] font-bold text-text-main opacity-60 uppercase tracking-tight">{task.project}</p>
                        </div>
                        
                        <div className="flex justify-between items-center pt-3 border-t border-gray-100 ml-1">
                          <div className="flex flex-col">
                             <span className="text-[9px] uppercase font-bold text-text-muted tracking-wider mb-0.5">Due Date</span>
                             <div className="flex items-center gap-1 text-text-main text-[11px] font-bold bg-background-light px-2 py-0.5 rounded">
                                <Clock size={12} className="text-primary" />
                                <span>{formatDate(task.dueDate)}</span>
                             </div>
                          </div>
                          {task.assignee ? (
                            <img src={task.assignee} alt="Assignee" className="size-7 rounded-full object-cover shadow-sm ring-1 ring-white" />
                          ) : (
                            <div className="size-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 ring-1 ring-white">?</div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  
                  {canEdit && colTasks.length === 0 && (
                     <div className="h-32 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-text-muted text-xs font-medium">
                        Drop items here
                     </div>
                  )}

                  {canEdit && (
                    <button 
                      onClick={handleAddTask}
                      className="py-3 text-xs font-bold text-text-muted hover:text-text-main hover:bg-black/5 rounded-xl transition-colors border border-dashed border-border-color mt-1"
                    >
                      + Quick Task
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
