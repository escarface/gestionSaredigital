
import React, { useState, useRef, useEffect } from 'react';
import { Smartphone, Monitor, Megaphone, Plus, MoreHorizontal, Edit, Trash2, Clock, StickyNote, FileIcon, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { Project } from '../types';
import MeetingNotesModal from './MeetingNotesModal';
import ProjectNotesModal from './ProjectNotesModal';

interface ProjectsPageProps {
  onOpenNewProject?: () => void;
  onEditProject?: (project: Project) => void;
}

const ProjectsPage: React.FC<ProjectsPageProps> = () => {
  const { projects, team, deleteProject, openProjectModal, askConfirmation } = useApp();
  const { user } = useAuth();
  const [filter, setFilter] = useState('All');
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Meeting Notes State
  const [isNotesModalOpen, setIsNotesModalOpen] = useState(false);
  const [selectedProjectForNotes, setSelectedProjectForNotes] = useState<Project | null>(null);

  // Project Notes State
  const [isProjectNotesModalOpen, setIsProjectNotesModalOpen] = useState(false);
  const [selectedProjectForProjectNotes, setSelectedProjectForProjectNotes] = useState<Project | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const handleOpenNotes = (project: Project) => {
    setSelectedProjectForNotes(project);
    setIsNotesModalOpen(true);
  };

  const handleOpenProjectNotes = (project: Project) => {
    setSelectedProjectForProjectNotes(project);
    setIsProjectNotesModalOpen(true);
  };

  const canEdit = user?.role !== 'Viewer';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-primary/20 text-text-main';
      case 'Review': return 'bg-orange-100 text-orange-700';
      case 'Planning': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-[#078816]/10 text-[#078816]';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'No Date';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

  const filteredProjects = filter === 'All'
    ? projects
    : projects.filter(p => p.status === filter);

  const filters = ['All', 'In Progress', 'Review', 'Planning', 'Completed'];

  const handleDelete = (project: Project) => {
    askConfirmation(
      "Delete Project",
      `Are you sure you want to delete "${project.name}"? This action cannot be undone.`,
      () => deleteProject(project.id)
    );
    setActiveMenu(null);
  };

  return (
    <div className="flex flex-col gap-3 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Projects</h2>
          <p className="text-text-muted text-sm">Manage your ongoing projects and deadlines</p>
        </div>
        {canEdit && (
          <button
            onClick={() => openProjectModal()}
            className="flex items-center justify-center rounded-full px-6 h-10 bg-primary hover:bg-[#e6e205] transition-colors text-black text-sm font-bold tracking-wide shadow-sm active:scale-95 duration-150"
          >
            <Plus size={18} className="mr-2" />
            New Project
          </button>
        )}
      </div>

      {/* Filters */}
        <div className="flex flex-wrap gap-2">
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${filter === f
              ? 'bg-text-main text-white'
              : 'bg-white border border-border-color text-text-muted hover:border-text-muted'
              }`}
          >
            {f}
          </button>
        ))}
      </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.map((project) => (
          <div key={project.id} className="relative group bg-white border border-border-color rounded-xl p-5 hover:border-primary/50 transition-all shadow-sm hover:shadow-md flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-gray-100">
                <span className="text-text-main">
                  {getIcon(project.icon)}
                </span>
              </div>
              <div className="flex gap-2 items-center relative">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                {(project.attachments && project.attachments.length > 0) && (
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 flex items-center gap-1">
                    <FileIcon size={12} />
                    {project.attachments.length}
                  </span>
                )}
                {canEdit && (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenProjectNotes(project);
                      }}
                      className="p-1.5 rounded-full hover:bg-blue-100 text-text-muted hover:text-blue-600 transition-colors"
                      title="Project Notes"
                    >
                      <FileText size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenNotes(project);
                      }}
                      className="p-1.5 rounded-full hover:bg-primary/10 text-text-muted hover:text-primary transition-colors"
                      title="Meeting Notes"
                    >
                      <StickyNote size={20} />
                    </button>
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
                        className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-border-color z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                      >
                        <button
                          onClick={() => {
                            openProjectModal(project);
                            setActiveMenu(null);
                          }}
                          className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 flex items-center gap-2 text-text-main"
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(project)}
                          className="w-full text-left px-4 py-3 text-sm font-medium hover:bg-red-50 text-red-600 flex items-center gap-2"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <h3 className="text-lg font-bold text-text-main mb-1">{project.name}</h3>
            <p className="text-text-muted text-sm mb-4">Client: {project.client}</p>
            {project.description && (
              <p className="text-text-main/70 text-xs mb-4 line-clamp-2">{project.description}</p>
            )}

            <div className="mb-4 mt-auto">
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

            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
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
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-0.5">Deadline</span>
                <div className="flex items-center gap-1.5 text-sm font-bold text-text-main bg-background-light px-2 py-1 rounded-lg">
                  <Clock size={14} className="text-primary" />
                  {formatDate(project.dueDate)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedProjectForNotes && (
        <MeetingNotesModal
          project={selectedProjectForNotes}
          isOpen={isNotesModalOpen}
          onClose={() => setIsNotesModalOpen(false)}
        />
      )}

      {selectedProjectForProjectNotes && (
        <ProjectNotesModal
          project={selectedProjectForProjectNotes}
          isOpen={isProjectNotesModalOpen}
          onClose={() => setIsProjectNotesModalOpen(false)}
        />
      )}
    </div>
  );
};

export default ProjectsPage;
