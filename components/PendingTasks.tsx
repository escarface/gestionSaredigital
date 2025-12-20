
import React from 'react';
import { Check, Filter, MoreHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';

const PendingTasks: React.FC = () => {
  const { tasks, updateTaskStatus } = useApp();

  // Filter for tasks that are NOT done
  const pendingTasks = tasks.filter(t => t.status !== 'Done');

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

  if (pendingTasks.length === 0) {
      return (
        <div className="rounded-xl bg-white border border-border-color p-6 mb-8 text-center">
            <h2 className="text-text-main text-xl font-bold mb-2">Pending Tasks</h2>
            <p className="text-text-muted text-sm">No pending tasks. You're all caught up!</p>
        </div>
      );
  }

  return (
    <div className="rounded-xl bg-white border border-border-color p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-text-main text-xl font-bold">Pending Tasks</h2>
        <div className="flex gap-2">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-muted">
            <Filter size={20} />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-text-muted">
            <MoreHorizontal size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col gap-4">
        {pendingTasks.slice(0, 5).map((task) => (
          <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-background-light transition-colors group border border-transparent hover:border-border-color">
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
            {task.assignee ? (
              <img
                alt="Assignee"
                className="size-8 rounded-full hidden sm:block object-cover"
                src={task.assignee}
              />
            ) : (
              <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-text-muted hidden sm:flex">
                ?
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PendingTasks;
