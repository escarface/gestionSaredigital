
import React, { useState, useRef, useEffect } from 'react';
import { Smartphone, Monitor, Megaphone, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Project } from '../types';

const ActiveProjects: React.FC = () => {
  const { projects, team, deleteProject, openProjectModal, askConfirmation } = useApp();
  const { user } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Show only up to 3 active projects on dashboard
  const activeProjects = projects.filter(p => p.status !== 'Completed').slice(0, 3);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'web': return <Monitor size={20} />;
      case 'smartphone': return <Smartphone size={20} />;
      case 'campaign': return <Megaphone size={20} />;
      default: return <Monitor size={20} />;
    }
  };

  const getCreatorInfo = (project: Project) => {
    let name = project.createdByName;
    let avatar = project.createdByAvatar;

    // Fallback for old projects: try to find the first member in the team list
    if (!name && project.members && project.members.length > 0) {
      const member = team.find(m => m.avatar === project.members[0]);
      if (member) {
        name = member.name;
        avatar = member.avatar;
      }
    }

    // Final fallback to current user if still no name (for old projects)
    if (!name) {
      name = user?.name || 'Admin';
    }

    const initial = name.charAt(0).toUpperCase();

    return { name, avatar, initial };
  };

  const handleDelete = (project: Project) => {
    askConfirmation(
      "Delete Project", 
      `Are you sure you want to delete "${project.name}"?`,
      () => deleteProject(project.id)
    );
    setActiveMenu(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-text-main text-xl font-bold">Active Projects</h2>
        {/* Note: In a real app, this link would navigate to the projects view */}
        <span className="text-sm font-bold text-text-muted">Viewing {activeProjects.length}</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeProjects.map((project) => (
          <div key={project.id} className="group bg-white border border-border-color rounded-xl p-5 hover:border-primary/50 transition-all cursor-pointer relative">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-gray-100">
                <span className="text-text-main">
                  {getIcon(project.icon)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${project.statusColor}`}>
                    {project.status}
                </span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveMenu(activeMenu === project.id ? null : project.id);
                  }}
                  className="p-1 rounded-full hover:bg-gray-100 text-text-muted hover:text-text-main transition-colors"
                >
                    <MoreHorizontal size={20} />
                </button>
                 {/* Dropdown Menu */}
                 {activeMenu === project.id && (
                  <div 
                    ref={menuRef}
                    className="absolute right-2 top-14 w-32 bg-white rounded-xl shadow-xl border border-border-color z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                  >
                    <button 
                      onClick={() => {
                        openProjectModal(project);
                        setActiveMenu(null);
                      }}
                      className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-gray-50 flex items-center gap-2 text-text-main"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(project)}
                      className="w-full text-left px-4 py-3 text-xs font-bold hover:bg-red-50 text-red-600 flex items-center gap-2"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            <h3 className="text-lg font-bold text-text-main mb-1">{project.name}</h3>
            <p className="text-text-muted text-sm mb-4">Client: {project.client}</p>
            
            <div className="mb-4">
              <div className="flex justify-between text-xs font-medium mb-2">
                <span className="text-text-muted">Progress</span>
                <span className="text-text-main">{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {(() => {
                const { avatar, initial, name } = getCreatorInfo(project);
                return (
                  <>
                    {avatar ? (
                      <img
                        alt={`Creator: ${name}`}
                        className="size-8 rounded-full border-2 border-white object-cover bg-gray-200"
                        src={avatar}
                      />
                    ) : (
                      <div className="size-8 rounded-full border-2 border-white bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        {initial}
                      </div>
                    )}
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-text-main">{name}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveProjects;
