import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  Menu, 
  X, 
  Languages, 
  ShieldCheck, 
  LogOut, 
  PhoneCall, 
  BookOpen, 
  Search,
  LayoutDashboard
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { lang, toggleLang, t } = useLanguage();
  const { isAuthenticated, admin, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-charcoal-200 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <Link 
            to="/" 
            onClick={closeMenu}
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-blood-600 rounded-lg p-1"
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blood-600 flex items-center justify-center text-white shadow-md shadow-blood-600/20 group-hover:bg-blood-700 transition-colors">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 fill-current text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl sm:text-2xl text-blood-700 tracking-tight">
                  {t.brandName}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-blood-100 text-blood-800 px-1.5 py-0.5 rounded">
                  BD
                </span>
              </div>
              <p className="text-xs text-charcoal-600 font-medium hidden sm:block">
                {t.tagline}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/') 
                  ? 'text-blood-700 bg-blood-50' 
                  : 'text-charcoal-700 hover:text-blood-700 hover:bg-charcoal-50'
              }`}
            >
              {t.navHome}
            </Link>

            <Link
              to="/directory"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/directory') 
                  ? 'text-blood-700 bg-blood-50' 
                  : 'text-charcoal-700 hover:text-blood-700 hover:bg-charcoal-50'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>{t.navDirectory}</span>
            </Link>

            <a
              href="/#blood-groups"
              className="px-3 py-2 rounded-lg text-sm font-semibold text-charcoal-700 hover:text-blood-700 hover:bg-charcoal-50 transition-colors"
            >
              {t.navBloodGroups}
            </a>

            <Link
              to="/awareness"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/awareness') 
                  ? 'text-blood-700 bg-blood-50' 
                  : 'text-charcoal-700 hover:text-blood-700 hover:bg-charcoal-50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{t.navAwareness}</span>
            </Link>

            <Link
              to="/report"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                isActive('/report') 
                  ? 'text-blood-700 bg-blood-50' 
                  : 'text-charcoal-700 hover:text-blood-700 hover:bg-charcoal-50'
              }`}
            >
              <PhoneCall className="w-4 h-4" />
              <span>{t.navReport}</span>
            </Link>
          </nav>

          {/* Right Action Bar (Language Switcher + Join as Donor + Admin Button) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Join as Donor Button */}
            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blood-600 hover:bg-blood-700 text-white font-bold text-xs shadow-xs active:scale-95 transition-all"
            >
              <Heart className="w-3.5 h-3.5 fill-current" />
              <span>{t.navRegisterDonor}</span>
            </Link>

            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              aria-label="Toggle language between English and Bangla"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-charcoal-300 text-xs font-bold text-charcoal-800 hover:bg-charcoal-50 transition-all shadow-xs"
            >
              <Languages className="w-4 h-4 text-blood-700" />
              <span>{lang === 'en' ? 'বাংলা' : 'English'}</span>
            </button>

            {/* Admin Status / Auth */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/admin/dashboard"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-charcoal-900 text-white hover:bg-charcoal-800 text-xs font-semibold shadow-xs transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>{t.navDashboard} ({admin?.username})</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  title={t.navLogout}
                  className="p-1.5 rounded-lg border border-charcoal-200 text-charcoal-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-blood-200 bg-blood-50 text-blood-800 hover:bg-blood-100 text-xs font-semibold transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-blood-700" />
                <span>{t.navLogin}</span>
              </Link>
            )}
          </div>

          {/* Mobile Right Controls: Language Switcher + Hamburger */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-charcoal-300 text-xs font-bold text-charcoal-800 hover:bg-charcoal-50"
            >
              <Languages className="w-3.5 h-3.5 text-blood-700" />
              <span>{lang === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-charcoal-700 hover:bg-charcoal-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Dropdown Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-charcoal-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <Link
            to="/"
            onClick={closeMenu}
            className={`block px-3 py-2.5 rounded-lg text-base font-semibold ${
              isActive('/') ? 'text-blood-700 bg-blood-50' : 'text-charcoal-800 hover:bg-charcoal-50'
            }`}
          >
            {t.navHome}
          </Link>

          <Link
            to="/directory"
            onClick={closeMenu}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold ${
              isActive('/directory') ? 'text-blood-700 bg-blood-50' : 'text-charcoal-800 hover:bg-charcoal-50'
            }`}
          >
            <Search className="w-4 h-4 text-blood-700" />
            <span>{t.navDirectory}</span>
          </Link>

          <a
            href="/#blood-groups"
            onClick={closeMenu}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-charcoal-800 hover:bg-charcoal-50"
          >
            {t.navBloodGroups}
          </a>

          <Link
            to="/awareness"
            onClick={closeMenu}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold ${
              isActive('/awareness') ? 'text-blood-700 bg-blood-50' : 'text-charcoal-800 hover:bg-charcoal-50'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blood-700" />
            <span>{t.navAwareness}</span>
          </Link>

          <Link
            to="/report"
            onClick={closeMenu}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-semibold ${
              isActive('/report') ? 'text-blood-700 bg-blood-50' : 'text-charcoal-800 hover:bg-charcoal-50'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-blood-700" />
            <span>{t.navReport}</span>
          </Link>

          <Link
            to="/register"
            onClick={closeMenu}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-base font-bold ${
              isActive('/register') ? 'text-white bg-blood-600' : 'text-blood-700 bg-blood-50 hover:bg-blood-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${isActive('/register') ? 'fill-white text-white' : 'fill-blood-700 text-blood-700'}`} />
            <span>{t.navRegisterDonor}</span>
          </Link>

          <div className="pt-3 border-t border-charcoal-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/admin/dashboard"
                  onClick={closeMenu}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-charcoal-900 text-white font-semibold text-sm"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t.navDashboard} ({admin?.username})</span>
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 font-semibold text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.navLogout}</span>
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border border-blood-200 bg-blood-50 text-blood-800 font-semibold text-sm"
              >
                <ShieldCheck className="w-4 h-4 text-blood-700" />
                <span>{t.navLogin}</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
