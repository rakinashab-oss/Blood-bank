import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Heart, Phone, Mail, ShieldAlert, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-charcoal-900 text-charcoal-300 border-t border-charcoal-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Brand Info */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-blood-600 flex items-center justify-center text-white shadow-sm">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                {t.brandName}
              </span>
            </div>
            <p className="text-sm text-charcoal-400 leading-relaxed">
              {t.tagline}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-charcoal-800/80 border border-charcoal-700 text-xs text-charcoal-300">
              <Sparkles className="w-3.5 h-3.5 text-blood-400" />
              <span>{t.developerCredit}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
              {t.footerQuickLinks}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-blood-400 transition-colors">
                  {t.navHome}
                </Link>
              </li>
              <li>
                <Link to="/directory" className="hover:text-blood-400 transition-colors">
                  {t.navDirectory}
                </Link>
              </li>
              <li>
                <a href="/#blood-groups" className="hover:text-blood-400 transition-colors">
                  {t.navBloodGroups}
                </a>
              </li>
              <li>
                <Link to="/awareness" className="hover:text-blood-400 transition-colors">
                  {t.navAwareness}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
              {t.navReport}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/report" className="hover:text-blood-400 transition-colors">
                  {t.navReport}
                </Link>
              </li>
              <li>
                <Link to="/admin/login" className="hover:text-blood-400 transition-colors flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-blood-400" />
                  <span>{t.navLogin}</span>
                </Link>
              </li>
              <li className="text-xs text-charcoal-400 pt-2">
                {t.emergencyHelp}
              </li>
            </ul>
          </div>

          {/* Developer Contact Card */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
              {t.footerContact}
            </h4>
            <p className="text-sm font-semibold text-white">
              Rakin Ashab
            </p>
            <div className="space-y-2 text-sm">
              <a
                href="tel:01936106621"
                className="flex items-center gap-2 hover:text-white transition-colors group"
              >
                <div className="w-7 h-7 rounded-md bg-charcoal-800 flex items-center justify-center group-hover:bg-blood-600 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-charcoal-300 group-hover:text-white" />
                </div>
                <span>01936106621</span>
              </a>
              <a
                href="mailto:mohammadrakinashab@gmail.com"
                className="flex items-center gap-2 hover:text-white transition-colors group break-all"
              >
                <div className="w-7 h-7 rounded-md bg-charcoal-800 flex items-center justify-center group-hover:bg-blood-600 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-charcoal-300 group-hover:text-white" />
                </div>
                <span className="text-xs sm:text-sm">mohammadrakinashab@gmail.com</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-charcoal-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-charcoal-400">
          <p>
            © {new Date().getFullYear()} {t.brandName}. {t.allRightsReserved}
          </p>
          <div className="flex items-center gap-1">
            <span className="text-charcoal-400">{t.developerCredit}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
