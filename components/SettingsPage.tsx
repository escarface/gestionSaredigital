import React, { useState, useRef } from 'react';
// Added Mail to the imports from lucide-react to fix the 'Cannot find name Mail' error on line 144.
import { User, Bell, Shield, Eye, Globe, Smartphone, Save, Mail, Upload, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const SettingsPage: React.FC = () => {
  const { user, updateProfile, updatePassword, uploadAvatar } = useAuth();
  const { notify } = useApp();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
    timezone: user?.timezone || 'Europe/Madrid',
    language: user?.language || 'Spanish',
    theme: user?.theme || 'light',
    notificationsEnabled: user?.notificationsEnabled ?? true,
    emailAlerts: user?.emailAlerts ?? false,
    viewMode: user?.viewMode || 'standard',
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(settings);
      notify("Configuración guardada correctamente");
    } catch (error) {
      notify("Error al guardar la configuración", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      notify("La imagen debe ser menor a 2MB", "error");
      return;
    }

    setLoading(true);
    try {
      await uploadAvatar(file);
      notify("Avatar actualizado correctamente");
    } catch (error) {
      notify("Error al subir el avatar", "error");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Eye },
  ];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-text-main">Settings</h2>
          <p className="text-text-muted text-sm">Manage your account and app preferences</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 bg-text-main text-white rounded-full font-bold text-sm hover:bg-black transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 mt-4">
        {/* Navigation Sidebar */}
        <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 bg-white p-2 rounded-2xl border border-border-color shrink-0 h-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-1 lg:flex-none items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${
                activeTab === tab.id 
                  ? 'bg-primary/20 text-text-main' 
                  : 'text-text-muted hover:bg-gray-50'
              }`}
            >
              <tab.icon size={18} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          {activeTab === 'profile' && (
            <div className="bg-white p-8 rounded-2xl border border-border-color space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                <img src={user?.avatar} alt="Profile" className="size-20 rounded-full object-cover border-4 border-background-light shadow-sm" />
                <div>
                  <h3 className="text-lg font-bold text-text-main">Profile Photo</h3>
                  <p className="text-text-muted text-xs mb-3">JPG, GIF or PNG. Max size 2MB</p>
                  <input 
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={loading}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-background-light border border-border-color rounded-lg text-xs font-bold hover:bg-gray-100 disabled:opacity-50"
                    >
                      <Upload size={14} /> Upload New
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase">Display Name</label>
                  <input 
                    type="text" 
                    value={settings.name}
                    onChange={(e) => setSettings({...settings, name: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-background-light text-sm font-medium focus:ring-2 ring-primary/50" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase">Email Address</label>
                  <input 
                    type="email" 
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-background-light text-sm font-medium focus:ring-2 ring-primary/50" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase">Phone Number</label>
                  <input 
                    type="tel" 
                    value={settings.phone}
                    onChange={(e) => setSettings({...settings, phone: e.target.value})}
                    placeholder="+34 600 000 000"
                    className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-background-light text-sm font-medium focus:ring-2 ring-primary/50" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-text-muted uppercase">Timezone</label>
                  <select 
                    value={settings.timezone}
                    onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                    className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-background-light text-sm font-medium focus:ring-2 ring-primary/50"
                  >
                    <option value="Europe/Madrid">Europe/Madrid (GMT+1)</option>
                    <option value="Europe/London">Europe/London (GMT+0)</option>
                    <option value="America/New_York">America/New York (GMT-5)</option>
                    <option value="America/Los_Angeles">America/Los Angeles (GMT-8)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase">Bio / Description</label>
                <textarea 
                  rows={3}
                  value={settings.bio}
                  onChange={(e) => setSettings({...settings, bio: e.target.value})}
                  placeholder="Tell us about yourself..."
                  className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-background-light text-sm font-medium focus:ring-2 ring-primary/50 resize-none" 
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white p-8 rounded-2xl border border-border-color space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-lg font-bold text-text-main mb-4">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-background-light rounded-xl border border-border-color">
                  <div className="flex gap-4">
                    <div className="size-10 rounded-full bg-white flex items-center justify-center border border-border-color text-text-main"><Globe size={18} /></div>
                    <div>
                      <p className="text-sm font-bold text-text-main">Web Notifications</p>
                      <p className="text-xs text-text-muted">Stay notified in your browser</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, notificationsEnabled: !settings.notificationsEnabled})}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.notificationsEnabled ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${settings.notificationsEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-background-light rounded-xl border border-border-color">
                  <div className="flex gap-4">
                    <div className="size-10 rounded-full bg-white flex items-center justify-center border border-border-color text-text-main"><Mail size={18} /></div>
                    <div>
                      <p className="text-sm font-bold text-text-main">Email Alerts</p>
                      <p className="text-xs text-text-muted">Get weekly project summaries</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSettings({...settings, emailAlerts: !settings.emailAlerts})}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.emailAlerts ? 'bg-primary' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-1 size-4 bg-white rounded-full transition-all ${settings.emailAlerts ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="bg-white p-8 rounded-2xl border border-border-color space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-lg font-bold text-text-main">App Customization</h3>
              
              <div className="space-y-1.5 mb-6">
                <label className="text-xs font-bold text-text-muted uppercase">Theme</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setSettings({...settings, theme: 'light'})}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${settings.theme === 'light' ? 'border-primary bg-primary/5' : 'border-border-color bg-white'}`}
                  >
                    <p className="font-bold text-sm text-text-main">Light Mode</p>
                    <p className="text-xs text-text-muted">Bright and clean interface</p>
                  </button>
                  <button 
                    onClick={() => setSettings({...settings, theme: 'dark'})}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${settings.theme === 'dark' ? 'border-primary bg-primary/5' : 'border-border-color bg-white'}`}
                  >
                    <p className="font-bold text-sm text-text-main">Dark Mode</p>
                    <p className="text-xs text-text-muted">Easy on the eyes (Coming soon)</p>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 mb-6">
                <label className="text-xs font-bold text-text-muted uppercase">View Density</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setSettings({...settings, viewMode: 'standard'})}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${settings.viewMode === 'standard' ? 'border-primary bg-primary/5' : 'border-border-color bg-white'}`}
                  >
                    <p className="font-bold text-sm text-text-main">Standard View</p>
                    <p className="text-xs text-text-muted">Default spacing and layout</p>
                  </button>
                  <button 
                    onClick={() => setSettings({...settings, viewMode: 'compact'})}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${settings.viewMode === 'compact' ? 'border-primary bg-primary/5' : 'border-border-color bg-white'}`}
                  >
                    <p className="font-bold text-sm text-text-main">Compact View</p>
                    <p className="text-xs text-text-muted">Denser information display</p>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text-muted uppercase">Language</label>
                <select 
                  value={settings.language}
                  onChange={(e) => setSettings({...settings, language: e.target.value})}
                  className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-background-light text-sm font-medium focus:ring-2 ring-primary/50"
                >
                  <option>Spanish</option>
                  <option>English</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white p-8 rounded-2xl border border-border-color space-y-6 animate-in slide-in-from-bottom-2 duration-300">
              <h3 className="text-lg font-bold text-text-main">Password & Security</h3>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setShowPasswordModal(true)}
                  className="w-full p-4 rounded-xl border border-border-color bg-background-light hover:bg-gray-100 transition-colors text-left flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-bold text-text-main">Change Password</p>
                    <p className="text-xs text-text-muted">Update your password</p>
                  </div>
                  <Shield size={18} className="text-text-muted" />
                </button>
                
                <button className="w-full p-4 rounded-xl border border-border-color bg-background-light hover:bg-gray-100 transition-colors text-left flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-text-main">Two-Factor Authentication</p>
                    <p className="text-xs text-red-600 font-bold">Currently disabled</p>
                  </div>
                  <Smartphone size={18} className="text-text-muted" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && <PasswordModal onClose={() => setShowPasswordModal(false)} />}
    </div>
  );
};

const PasswordModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { updatePassword } = useAuth();
  const { notify } = useApp();
  const [loading, setLoading] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación robusta de contraseña
    if (passwords.newPassword.length < 12) {
      notify("La contraseña debe tener al menos 12 caracteres", "error");
      return;
    }

    const hasUppercase = /[A-Z]/.test(passwords.newPassword);
    const hasLowercase = /[a-z]/.test(passwords.newPassword);
    const hasNumber = /[0-9]/.test(passwords.newPassword);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(passwords.newPassword);

    if (!hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      notify("La contraseña debe incluir mayúsculas, minúsculas, números y caracteres especiales", "error");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      notify("Las contraseñas no coinciden", "error");
      return;
    }

    setLoading(true);
    try {
      await updatePassword(passwords.newPassword);
      notify("Contraseña actualizada correctamente");
      onClose();
    } catch (error) {
      notify("Error al actualizar la contraseña", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-text-main">Change Password</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-main transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted uppercase">New Password</label>
            <input 
              type="password"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
              placeholder="Enter new password"
              className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-background-light text-sm font-medium focus:ring-2 ring-primary/50"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-muted uppercase">Confirm Password</label>
            <input 
              type="password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
              placeholder="Confirm new password"
              className="w-full px-4 py-2.5 rounded-xl border border-border-color bg-background-light text-sm font-medium focus:ring-2 ring-primary/50"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-border-color rounded-xl font-bold text-sm hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-text-main text-white rounded-xl font-bold text-sm hover:bg-black transition-all disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;