
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LOGO_URL, DEFAULT_AVATAR } from '../constants';
import { ArrowRight, Loader2, AlertCircle, Shield, User as UserIcon, Eye } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { signInWithEmail, signUpWithEmail, loginAsGuest } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'Admin' | 'Editor' | 'Viewer'>('Editor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (isLogin) {
        const result = await signInWithEmail(email, password);
        if (result.error) {
          setError(result.error);
        }
      } else {
        if (!name.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        const result = await signUpWithEmail(email, password, name, role);
        if (result.error) {
          setError(result.error);
        } else {
          setSuccess('Account created! Check your email to verify, then sign in.');
          setIsLogin(true);
          setEmail('');
          setPassword('');
          setName('');
        }
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 selection:bg-primary/20 font-display">
      <div className="w-full max-w-[420px] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-10 text-center">
          <div 
            className="mx-auto size-14 bg-center bg-no-repeat bg-cover rounded-2xl shadow-sm mb-6 border border-border-color/50" 
            style={{ backgroundImage: `url("${LOGO_URL}")` }}
          />
          <h1 className="text-2xl font-bold text-text-main tracking-tight">
            {isLogin ? 'Sign in to Gestión Pro' : 'Create your account'}
          </h1>
          <p className="text-text-muted text-sm mt-2">
            {isLogin ? 'Enter your credentials to access the dashboard' : 'Sign up to get started with project management'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-[13px] font-medium p-3.5 rounded-xl flex items-center gap-2.5 border border-red-100">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-700 text-[13px] font-medium p-3.5 rounded-xl flex items-center gap-2.5 border border-green-100">
              <AlertCircle size={18} />
              {success}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-[13px] font-semibold text-text-main ml-0.5">Name</label>
              <input 
                type="text" 
                required={!isLogin}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-text-muted/50"
                placeholder="Your full name"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-text-main ml-0.5">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-text-muted/50"
              placeholder="you@email.com"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center ml-0.5">
              <label className="text-[13px] font-semibold text-text-main">Password</label>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border-color bg-background-light px-4 py-3 text-sm font-medium focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder:text-text-muted/50"
              placeholder="••••••••"
            />
          </div>

          {!isLogin && (
            <div className="space-y-3 pt-2">
              <label className="text-[13px] font-semibold text-text-main ml-0.5">Select Role (Demo Purposes)</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'Admin', icon: Shield, desc: 'Full Access' },
                  { id: 'Editor', icon: UserIcon, desc: 'Can Edit' },
                  { id: 'Viewer', icon: Eye, desc: 'Read Only' }
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRole(r.id as any)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-1.5 ${
                      role === r.id ? 'border-primary bg-primary/5' : 'border-border-color bg-white hover:border-gray-300'
                    }`}
                  >
                    <r.icon size={20} className={role === r.id ? 'text-text-main' : 'text-text-muted'} />
                    <span className="text-[10px] font-bold uppercase">{r.id}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="mt-4 w-full bg-text-main hover:bg-black text-white font-bold py-3 rounded-xl shadow-md active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed h-[48px]"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : (
              <span className="flex items-center gap-2">
                {isLogin ? 'Sign In' : 'Create Account'}
                <ArrowRight size={18} />
              </span>
            )}
          </button>
        </form>
        
        <div className="mt-8 pt-6 border-t border-border-color text-center space-y-4">
          <p className="text-text-muted text-sm font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }}
              className="text-text-main font-bold hover:underline decoration-primary decoration-2 underline-offset-4 transition-all"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-color"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-white text-text-muted font-medium">OR</span>
            </div>
          </div>

          <button
            type="button"
            onClick={loginAsGuest}
            className="w-full py-2.5 px-4 rounded-xl border-2 border-border-color bg-white hover:bg-gray-50 text-text-main font-semibold text-sm transition-all"
          >
            Continue as Guest (Demo Mode)
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
