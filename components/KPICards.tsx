
import React from 'react';
import { FolderOpen, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

const KPICards: React.FC = () => {
  const { projects, tasks } = useApp();

  // Dynamic Calculations
  const totalProjects = projects.length;
  const tasksCompleted = tasks.filter(t => t.status === 'Done').length;
  // Simple heuristic for "Pending Deadlines": Tasks not done that are 'High' priority
  const pendingDeadlines = tasks.filter(t => t.status !== 'Done' && t.priority === 'High').length;
  
  // Placeholder for hours (requires time tracking feature)
  const hoursSpent = 0;

  const kpis = [
    { 
      label: 'Total Projects', 
      value: totalProjects.toString(), 
      change: projects.length > 0 ? 'Active' : 'No Data', 
      changePositive: true, 
      icon: 'folder' 
    },
    { 
      label: 'Hours Spent', 
      value: hoursSpent.toString(), 
      change: '0%', 
      changePositive: true, 
      icon: 'clock' 
    },
    { 
      label: 'Tasks Completed', 
      value: tasksCompleted.toString(), 
      change: `${tasks.length > 0 ? Math.round((tasksCompleted / tasks.length) * 100) : 0}% Rate`, 
      changePositive: true, 
      icon: 'check' 
    },
    { 
      label: 'Critical Tasks', 
      value: pendingDeadlines.toString(), 
      change: 'Priority', 
      changePositive: false, 
      icon: 'alert' 
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'folder': return <FolderOpen size={20} />;
      case 'clock': return <Clock size={20} />;
      case 'check': return <CheckCircle2 size={20} />;
      case 'alert': return <AlertTriangle size={20} />;
      default: return <FolderOpen size={20} />;
    }
  };

  const getIconBg = (type: string) => {
    return type === 'alert' ? 'bg-red-100 text-red-600' : 'bg-primary/20 text-text-main';
  };

  const getChangeColor = (isPositive: boolean) => {
    return isPositive 
      ? 'text-[#078816] bg-[#078816]/10' 
      : 'text-[#e71708] bg-[#e71708]/10';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
      {kpis.map((kpi, idx) => (
        <div key={idx} className="flex flex-col gap-1 rounded-xl p-6 bg-white border border-border-color shadow-sm hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start">
            <p className="text-text-muted text-sm font-medium">{kpi.label}</p>
            <div className={`p-2 rounded-full ${getIconBg(kpi.icon)}`}>
              {getIcon(kpi.icon)}
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <p className="text-text-main text-3xl font-bold">{kpi.value}</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getChangeColor(kpi.changePositive)}`}>
              {kpi.change}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default KPICards;
