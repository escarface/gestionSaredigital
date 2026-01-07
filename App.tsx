import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Menu, Search, LogOut } from 'lucide-react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProjectsPage from './components/ProjectsPage';
import TasksPage from './components/TasksPage';
import CalendarPage from './components/CalendarPage';
import TeamPage from './components/TeamPage';
import AuthPage from './components/AuthPage';
import SettingsPage from './components/SettingsPage';
import NotificationCenter from './components/NotificationCenter';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectModal, ConfirmationModal } from './components/Modals';

const AppLayout: React.FC = () => {
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

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
  } = useApp();

  const handleProjectSubmit = (data: Project) => {
    if (editingProject) {
      editProject(data);
    } else {
      addProject(data);
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    switch (path) {
      case '/projects': return 'Projects';
      case '/tasks': return 'Task Management';
      case '/calendar': return 'Calendar';
      case '/team': return 'Team Directory';
      case '/settings': return 'Settings';
      default: return 'Dashboard Overview';
    }
  };

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
        <Sidebar onClose={() => setSidebarOpen(false)} />
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

            <NotificationCenter />

            <button
              onClick={signOut}
              title="Sign Out"
              className="size-10 rounded-full bg-white border border-border-color flex items-center justify-center text-red-600 hover:bg-red-50 transition-colors shadow-sm"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-3 md:px-6 pb-6 scrollbar-hide">
          <div className="max-w-[1200px] mx-auto pt-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<ProjectsPage />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/team" element={<TeamPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
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
  <BrowserRouter>
    <AuthProvider>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default App;