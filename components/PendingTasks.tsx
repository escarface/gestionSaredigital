import React, { useState, useRef, useEffect } from 'react';
import { Check, Filter, MoreHorizontal, Edit, Trash2, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NewTaskModal } from './Modals';
import { Task } from '../types';

const PendingTasks: React.FC = () => {
  const { tasks, updateTaskStatus, deleteTask, askConfirmation, projects, addTask, editTask } = useApp();
  const [activeMenuTask, setActiveMenuTask] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const [filterPriority, setFilterPriority] = useState('All');
  const [activeHeaderDropdown, setActiveHeaderDropdown] = useState<'filter' | 'menu' | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);
  const headerDropdownRef = useRef<HTMLDivElement>(null);

  // Filter for tasks that are NOT done
  const pendingTasks = tasks
    .filter(t => t.status !== 'Done')
    .filter(t => filterPriority === 'All' || t.priority === filterPriority);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Close task menu
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuTask(null);
      }
      // Close header dropdowns
      if (headerDropdownRef.current && !headerDropdownRef.current.contains(event.target as Node)) {
        setActiveHeaderDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-600';
      case 'Medium': return 'bg-primary/20 text-text-main';
      case 'Low': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const handleQuickComplete = (taskId: string) => {
    updateTaskStatus(taskId, 'Done');
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
    setActiveMenuTask(null);
  };

  const handleModalSubmit = (data: any) => {
    if (editingTask) {
      editTask({ ...editingTask, ...data });
    } else {
      addTask(data);
    }
  };

  const handleAddTask = () => {
    setEditingTask(undefined);
    setIsModalOpen(true);
    setActiveHeaderDropdown(null);
  };

  if (tasks.filter(t => t.status !== 'Done').length === 0) {
    return (
      <div className="rounded-xl bg-white border border-border-color p-6 mb-8 text-center">
        <h2 className="text-text-main text-xl font-bold mb-2">Pending Tasks</h2>
        <p className="text-text-muted text-sm">No pending tasks. You're all caught up!</p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-xl bg-white border border-border-color p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-text-main text-xl font-bold">Pending Tasks</h2>
            {filterPriority !== 'All' && (
              <span className="bg-primary/20 text-text-main text-xs font-bold px-2 py-0.5 rounded-full">
                {filterPriority}
              </span>
            )}
          </div>
          <div className="flex gap-2 relative" ref={headerDropdownRef}>
            <div className="relative">
              <button
                onClick={() => setActiveHeaderDropdown(activeHeaderDropdown === 'filter' ? null : 'filter')}
                className={`p-2 rounded-lg transition-colors text-text-muted ${activeHeaderDropdown === 'filter' || filterPriority !== 'All' ? 'bg-primary/20 text-text-main' : 'hover:bg-gray-100'}`}
              >
                <Filter size={20} />
              </button>
              {activeHeaderDropdown === 'filter' && (
                <div className="absolute right-0 top-10 w-32 bg-white rounded-xl shadow-xl border border-border-color z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  {['All', 'High', 'Medium', 'Low'].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => {
                        setFilterPriority(priority);
                        setActiveHeaderDropdown(null);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-bold hover:bg-gray-50 flex items-center justify-between ${filterPriority === priority ? 'text-primary bg-primary/5' : 'text-text-main'}`}
                    >
                      {priority}
                      {filterPriority === priority && <Check size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setActiveHeaderDropdown(activeHeaderDropdown === 'menu' ? null : 'menu')}
                className={`p-2 rounded-lg transition-colors text-text-muted ${activeHeaderDropdown === 'menu' ? 'bg-gray-100 text-text-main' : 'hover:bg-gray-100'}`}
              >
                <MoreHorizontal size={20} />
              </button>
              {activeHeaderDropdown === 'menu' && (
                <div className="absolute right-0 top-10 w-40 bg-white rounded-xl shadow-xl border border-border-color z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  <button
                    onClick={handleAddTask}
                    className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-text-main"
                  >
                    <Plus size={14} /> Add Task
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {pendingTasks.length > 0 ? (
            pendingTasks.slice(0, 5).map((task) => (
              <div key={task.id} className={`flex items-center gap-4 p-3 rounded-lg hover:bg-background-light transition-colors group border border-transparent hover:border-border-color relative ${activeMenuTask === task.id ? 'z-20' : ''}`}>
                <div
                  onClick={() => handleQuickComplete(task.id)}
                  className="flex items-center justify-center size-6 rounded border-2 border-gray-300 text-transparent group-hover:border-primary cursor-pointer group-hover:text-primary transition-all"
                >
                  <Check size={14} strokeWidth={4} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-text-main font-medium truncate">{task.title}</p>
                  <p className="text-text-muted text-xs">{task.project} • Due {task.dueDate}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getPriorityColor(task.priority)}`}>
                  {task.priority}
                </span>

                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveMenuTask(activeMenuTask === task.id ? null : task.id);
                    }}
                    className="p-1 rounded-full text-text-muted hover:text-text-main hover:bg-gray-200 transition-colors"
                  >
                    <MoreHorizontal size={16} />
                  </button>

                  {activeMenuTask === task.id && (
                    <div
                      ref={menuRef}
                      className="absolute right-0 top-8 w-32 bg-white rounded-xl shadow-xl border border-border-color z-30 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
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
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <p className="text-text-muted text-sm font-medium">No tasks match this filter</p>
              <button onClick={() => setFilterPriority('All')} className="text-primary text-xs font-bold mt-2 hover:underline">Clear Filter</button>
            </div>
          )}
        </div>
      </div>

      <NewTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        projects={projects}
        initialData={editingTask}
      />
    </>
  );
};

export default PendingTasks;
