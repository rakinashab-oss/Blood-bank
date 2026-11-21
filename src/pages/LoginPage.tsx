import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Lock, 
  User, 
  AlertCircle, 
  Info,
  Loader2 
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { t } = useLanguage();
  const { signIn, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError('Username is required.');
      return;
    }
    if (!password) {
      setError('Password is required.');
      return;
    }

    try {
      setIsLoading(true);
      await signIn(username.trim(), password);
      navigate('/admin/dashboard');
    } catch (err: unknown) {
      const errorObj = err as Error;
      if (errorObj?.message?.includes('Invalid login') || errorObj?.message === 'INVALID_CREDENTIALS') {
        setError(t.loginError);
      } else {
        setError(errorObj?.message || t.loginError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Quick fill helper for testing
  const fillSampleAdmin = (uname: string) => {
    setUsername(uname);
    setPassword('admin1234');
    setError(null);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 sm:py-20">
      <div className="bg-white rounded-3xl border border-charcoal-200 p-6 sm:p-8 shadow-md space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-blood-50 text-blood-700 flex items-center justify-center mx-auto shadow-xs">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-charcoal-900 tracking-tight">
            {t.adminLoginTitle}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500">
            {t.adminLoginSubtitle}
          </p>
        </div>

        {/* Initial Credentials Notice as required by prompt */}
        <div className="p-3.5 rounded-xl bg-charcoal-50 border border-charcoal-200 text-xs text-charcoal-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-blood-700 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold text-charcoal-800">{t.initialPasswordNotice}</p>
            <div className="flex flex-wrap gap-1 pt-1">
              {['admin1', 'admin2', 'admin3', 'admin4'].map((acc) => (
                <button
                  key={acc}
                  type="button"
                  onClick={() => fillSampleAdmin(acc)}
                  className="px-2 py-0.5 rounded bg-white border border-charcoal-300 font-mono text-[11px] hover:border-blood-600 text-charcoal-700"
                >
                  {acc}
                </button>
              ))}
              <span className="text-charcoal-400 text-[11px] self-center">... admin10</span>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Username */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
              {t.usernameLabel}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={t.usernamePlaceholder}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-charcoal-300 text-sm focus:border-blood-600 focus:ring-1 focus:ring-blood-600 transition-colors"
              />
            </div>
          </div>

          {/* Password with Show/Hide Toggle */}
          <div>
            <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
              {t.passwordLabel}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.passwordPlaceholder}
                className="w-full pl-10 pr-12 py-2.5 rounded-xl border border-charcoal-300 text-sm focus:border-blood-600 focus:ring-1 focus:ring-blood-600 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700 text-xs font-semibold focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-blood-600 hover:bg-blood-700 text-white font-bold text-sm shadow-md shadow-blood-700/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{t.signingIn}</span>
              </>
            ) : (
              <span>{t.btnLogin}</span>
            )}
          </button>

        </form>

        <p className="text-center text-[11px] text-charcoal-400">
          Blood Bank Security Architecture — Row Level Security (RLS) Enforced
        </p>

      </div>
    </div>
  );
};
