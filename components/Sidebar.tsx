
import React from 'react';
import { Plus } from 'lucide-react';
import { MENU_ITEMS, LOGO_URL } from '../constants';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onNewProject?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const { openProjectModal } = useApp();
  const { user } = useAuth();

  return (
    <aside className="w-64 flex-shrink-0 border-r border-border-color bg-background-light flex flex-col justify-between p-4 h-full">
      <div className="flex flex-col gap-6">
        {/* User/Logo Area */}
        <div className="flex items-center gap-3 px-2">
          <div
            className="bg-center bg-no-repeat bg-cover rounded-full size-12 bg-gray-200 border border-border-color"
            style={{ backgroundImage: `url("${LOGO_URL}")` }}
          />
          <div className="flex flex-col">
            <h1 className="text-text-main text-lg font-bold leading-tight">Gestión Pro</h1>
            <p className="text-text-muted text-xs font-medium uppercase tracking-wide">Workspace</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {MENU_ITEMS.map((item) => {
            const isActive = item.id === currentView;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex w-full items-center gap-3 px-4 py-3 rounded-full transition-colors group ${isActive
                    ? 'bg-primary/20'
                    : 'hover:bg-black/5'
                  }`}
              >
                <item.icon
                  size={20}
                  className={`group-hover:text-text-main ${isActive ? 'text-text-main' : 'text-text-muted'}`}
                />
                <p className={`text-sm font-bold ${isActive ? 'text-text-main' : 'text-text-main font-medium text-opacity-80'}`}>
                  {item.label}
                </p>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        {/* User Mini Profile */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-border-color">
          <img
            alt="User profile"
            className="size-8 rounded-full object-cover"
            src={user?.avatar}
          />
          <div className="flex flex-col overflow-hidden">
            <p className="text-text-main text-sm font-bold truncate">{user?.name}</p>
            <p className="text-text-muted text-xs truncate">{user?.role}</p>
          </div>
        </div>

        {user?.role !== 'Viewer' && (
          <button
            onClick={() => openProjectModal()}
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 bg-primary hover:bg-[#e6e205] transition-colors text-black text-sm font-bold tracking-wide shadow-sm hover:shadow-md active:scale-95 duration-150"
          >
            <Plus className="mr-2" size={20} />
            <span className="truncate">New Project</span>
          </button>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
