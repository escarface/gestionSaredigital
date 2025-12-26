import React, { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, LogOut, X, Calendar as CalendarIcon, Clock, AlertCircle } from 'lucide-react';
import Sidebar from './components/Sidebar';
import KPICards from './components/KPICards';
import ChartsSection from './components/ChartsSection';
import ActiveProjects from './components/ActiveProjects';
import PendingTasks from './components/PendingTasks';
import ProjectsPage from './components/ProjectsPage';
import TasksPage from './components/TasksPage';
import CalendarPage from './components/CalendarPage';
import TeamPage from './components/TeamPage';
import AuthPage from './components/AuthPage';
import SettingsPage from './components/SettingsPage';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectModal, ConfirmationModal } from './components/Modals';

const AppLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const {
    isProjectModalOpen,
    closeProjectModal,
    addProject,
    editProject,
    uploadProjectAttachment,
    deleteProjectAttachment,
    editingProject,
    confirmConfig,
    closeConfirmation,
    events,
    projects
  } = useApp();

  // Cerrar notificaciones al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calcular notificaciones inteligentes
  const getSmartNotifications = () => {
    const today = new Date().toISOString().split('T')[0];
    const threeDaysLater = new Date();
    threeDaysLater.setDate(threeDaysLater.getDate() + 3);
    const threeDaysLimit = threeDaysLater.toISOString().split('T')[0];

    const notifs = [];

    // Eventos de hoy
    events.filter(e => e.date === today).forEach(e => {
      notifs.push({
        id: `e-${e.id}`,
        title: `Evento: ${e.title}`,
        desc: `Hoy a las ${e.time}`,
        type: 'event',
        urgent: true
      });
    });

    // Proyectos que vencen pronto
    projects.filter(p => p.status !== 'Completed' && p.dueDate <= threeDaysLimit && p.dueDate >= today).forEach(p => {
      notifs.push({
        id: `p-${p.id}`,
        title: `Plazo: ${p.name}`,
        desc: `Entrega el ${p.dueDate}`,
        type: 'deadline',
        urgent: p.dueDate === today
      });
    });

    return notifs;
  };

  const smartNotifs = getSmartNotifications();

  const handleProjectSubmit = (data: any) => {
    if (editingProject) {
      editProject(data);
    } else {
      addProject(data);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <div className="flex flex-col gap-8 animate-in fade-in duration-300">
            <KPICards />
            <ChartsSection />
            <ActiveProjects />
            <PendingTasks />
          </div>
        );
      case 'projects':
        return <ProjectsPage />;
      case 'tasks':
        return <TasksPage />;
      case 'calendar':
        return <CalendarPage />;
      case 'team':
        return <TeamPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return null;
    }
  };

  const getPageTitle = () => {
    switch (currentView) {
      case 'projects': return 'Projects';
      case 'tasks': return 'Task Management';
      case 'calendar': return 'Calendar';
      case 'team': return 'Team Directory';
      case 'settings': return 'Settings';
      default: return 'Dashboard Overview';
    }
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="bg-background-light text-text-main font-display antialiased h-screen overflow-hidden flex selection:bg-primary/30">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 md:relative md:transform-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar
          currentView={currentView}
          onNavigate={(view) => { setCurrentView(view); setSidebarOpen(false); }}
        />
      </div>

      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <header className="h-20 flex items-center justify-between px-4 md:px-8 py-4 bg-background-light/80 backdrop-blur-md sticky top-0 z-40 border-b border-transparent">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-2 text-text-main hover:bg-black/5 rounded-full"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={24} />
            </button>
            <div className="flex flex-col">
              <h2 className="text-2xl font-bold text-text-main tracking-tight">{getPageTitle()}</h2>
              <div className="flex items-center gap-2">
                <p className="text-text-muted text-sm hidden sm:block">
                  Welcome back, {user.name}!
                </p>
                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${user.role === 'Admin' ? 'bg-primary text-black' :
                    user.role === 'Editor' ? 'bg-blue-100 text-blue-700' : 'bg-gray-200 text-gray-700'
                  }`}>
                  {user.role}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 relative">
            <div className="hidden lg:flex items-center bg-white border border-border-color rounded-full px-4 h-10 w-64 focus-within:ring-2 ring-primary/50 transition-all shadow-sm">
              <Search className="text-text-muted" size={20} />
              <input
                type="text"
                placeholder="Search..."
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-sm w-full text-text-main placeholder-text-muted h-full ml-2"
              />
            </div>

            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className={`size-10 rounded-full bg-white border border-border-color flex items-center justify-center text-text-main hover:bg-gray-50 transition-colors relative shadow-sm hover:shadow-md ${notifOpen ? 'ring-2 ring-primary' : ''}`}
              >
                {smartNotifs.length > 0 && (
                  <span className="absolute -top-1 -right-1 size-5 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {smartNotifs.length}
                  </span>
                )}
                <Bell size={20} />
              </button>

              {/* Smart Notifications Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-border-color overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                  <div className="px-4 py-3 bg-gray-50 border-b border-border-color flex justify-between items-center">
                    <span className="font-bold text-text-main text-sm">Notifications</span>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">{smartNotifs.length} New Alerts</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {smartNotifs.length > 0 ? (
                      smartNotifs.map(n => (
                        <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-background-light transition-colors flex gap-3">
                          <div className={`mt-1 size-8 shrink-0 rounded-full flex items-center justify-center ${n.urgent ? 'bg-red-100 text-red-600' : 'bg-primary/20 text-text-main'}`}>
                            {n.type === 'event' ? <CalendarIcon size={16} /> : <AlertCircle size={16} />}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <h4 className="text-xs font-bold text-text-main">{n.title}</h4>
                            <p className="text-[11px] text-text-muted flex items-center gap-1">
                              <Clock size={10} /> {n.desc}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center flex flex-col items-center">
                        <div className="size-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <Bell size={24} className="text-gray-300" />
                        </div>
                        <p className="text-xs font-medium text-text-muted">No pending alerts</p>
                      </div>
                    )}
                  </div>
                  {smartNotifs.length > 0 && (
                    <button className="w-full py-3 text-xs font-bold text-text-main hover:bg-primary/10 transition-colors border-t border-border-color">
                      Mark all as read
                    </button>
                  )}
                </div>
              )}
            </div>

            <button
              onClick={signOut}
              title="Sign Out"
              className="size-10 rounded-full bg-white border border-border-color flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors shadow-sm"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-10 scrollbar-hide">
          <div className="max-w-[1200px] mx-auto pt-4">
            {renderContent()}
          </div>
        </div>

        <ProjectModal
          isOpen={isProjectModalOpen}
          onClose={closeProjectModal}
          onSubmit={handleProjectSubmit}
          initialData={editingProject}
          onAttachmentUpload={uploadProjectAttachment}
          onAttachmentDelete={deleteProjectAttachment}
        />

        <ConfirmationModal
          isOpen={confirmConfig.isOpen}
          title={confirmConfig.title}
          message={confirmConfig.message}
          onConfirm={confirmConfig.onConfirm}
          onClose={closeConfirmation}
        />
      </main>
    </div>
  );
};

const App: React.FC = () => (
  <AuthProvider>
    <AppProvider>
      <AppLayout />
    </AppProvider>
  </AuthProvider>
);

export default App;