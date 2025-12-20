
import React from 'react';
import { BarChart, Bar, ResponsiveContainer, Cell } from 'recharts';
import { useApp } from '../context/AppContext';

const ChartsSection: React.FC = () => {
  const { tasks, projects } = useApp();

  // Calculate Overall Project Progress
  const calculateOverallProgress = () => {
    if (projects.length === 0) return 0;
    const totalProgress = projects.reduce((acc, curr) => acc + curr.progress, 0);
    return Math.round(totalProgress / projects.length);
  };
  
  const overallProgress = calculateOverallProgress();

  // Generate simple distribution data based on Tasks
  // (In a real DB app, you'd aggregate by 'completed_at' timestamp)
  const todoCount = tasks.filter(t => t.status === 'Todo').length;
  const inProgressCount = tasks.filter(t => t.status === 'In Progress').length;
  const doneCount = tasks.filter(t => t.status === 'Done').length;

  const chartData = [
    { day: 'Todo', tasks: todoCount },
    { day: 'In Prog', tasks: inProgressCount },
    { day: 'Done', tasks: doneCount },
  ];

  const hasData = tasks.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Progress Bars */}
      <div className="lg:col-span-2 rounded-xl p-6 bg-white border border-border-color">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-text-main text-lg font-bold">Project Progress</h3>
            <p className="text-text-muted text-sm">Average completion rate across {projects.length} projects</p>
          </div>
          <div className="text-right">
            <p className="text-text-main text-3xl font-bold">{overallProgress}%</p>
          </div>
        </div>
        <div className="flex flex-col gap-6 max-h-[200px] overflow-y-auto scrollbar-hide">
          {projects.length > 0 ? (
             projects.slice(0, 3).map(project => (
              <div key={project.id} className="space-y-2">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-text-main">{project.name}</span>
                  <span className="text-text-main">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-primary h-3 rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                </div>
              </div>
             ))
          ) : (
            <div className="text-center py-8 text-text-muted text-sm">
                No active projects to display.
            </div>
          )}
        </div>
      </div>

      {/* Task Status Bar Chart */}
      <div className="rounded-xl p-6 bg-white border border-border-color flex flex-col h-full">
        <div className="mb-6">
          <h3 className="text-text-main text-lg font-bold">Task Distribution</h3>
          <div className="flex items-center gap-2 mt-1">
            <p className="text-text-main text-2xl font-bold">{tasks.length}</p>
            <span className="text-text-muted text-sm">total tasks</span>
          </div>
        </div>
        <div className="flex-1 min-h-[150px]">
          {hasData ? (
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                 <Bar dataKey="tasks" radius={[8, 8, 0, 0]}>
                   {chartData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill="#f9f506" />
                   ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-text-muted text-xs">
                 No task data available
             </div>
          )}
        </div>
        {hasData && (
            <div className="flex justify-between px-2 mt-2">
                {chartData.map(d => (
                    <span key={d.day} className="text-xs font-bold text-text-muted uppercase w-full text-center">{d.day}</span>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default ChartsSection;
