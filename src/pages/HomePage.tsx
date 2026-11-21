import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { DataService, isSupabaseConfigured } from '../lib/supabase';
import { BloodGroup, DonorWithAvailability } from '../types';
import { toBengaliNumerals } from '../lib/availability';
import { 
  Heart, 
  Search, 
  Users, 
  CheckCircle, 
  Clock, 
  Layers, 
  ArrowRight, 
  ShieldAlert, 
  Activity, 
  HeartHandshake
} from 'lucide-react';

const ALL_BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const HomePage: React.FC = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const [donors, setDonors] = useState<DonorWithAvailability[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await DataService.getDonors();
        setDonors(data);
      } catch (err) {
        console.error('Failed to load donors:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Compute live statistics dynamically from database records
  const totalDonors = donors.length;
  const availableDonors = donors.filter((d) => d.is_available).length;
  const unavailableDonors = totalDonors - availableDonors;

  // Group breakdown
  const groupStats = ALL_BLOOD_GROUPS.reduce((acc, bg) => {
    const list = donors.filter((d) => d.blood_group === bg);
    acc[bg] = {
      total: list.length,
      available: list.filter((d) => d.is_available).length,
    };
    return acc;
  }, {} as Record<BloodGroup, { total: number; available: number }>);

  const formatNum = (num: number) => (lang === 'bn' ? toBengaliNumerals(num) : String(num));

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      
      {/* Supabase status indicator banner for transparency */}
      {!isSupabaseConfigured && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Offline / Local Storage Mode Active. Ready for Supabase connection via .env</span>
            </span>
            <Link to="/report" className="underline font-semibold hover:text-amber-950">
              Setup Docs
            </Link>
          </div>
        </div>
      )}

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blood-50/70 via-white to-[#fbfbfc] pt-8 sm:pt-16 pb-12 sm:pb-20 border-b border-charcoal-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blood-100 text-blood-800 text-xs sm:text-sm font-bold tracking-wide shadow-xs">
              <Heart className="w-4 h-4 fill-blood-700 text-blood-700 animate-bounce" />
              <span>{t.tagline}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-charcoal-900 tracking-tight leading-tight sm:leading-none">
              {t.heroHeading}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-charcoal-600 leading-relaxed font-normal max-w-2xl mx-auto">
              {t.heroDescription}
            </p>

            {/* Hero CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <Link
                to="/directory"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blood-600 hover:bg-blood-700 text-white font-bold text-sm sm:text-base shadow-md shadow-blood-700/20 active:scale-98 transition-all"
              >
                <Search className="w-5 h-5" />
                <span>{t.btnFindDonors}</span>
              </Link>

              <Link
                to="/directory"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-charcoal-50 text-charcoal-800 font-bold text-sm sm:text-base border border-charcoal-300 shadow-xs transition-colors"
              >
                <span>{t.btnViewDirectory}</span>
                <ArrowRight className="w-4 h-4 text-charcoal-500" />
              </Link>
            </div>

            {/* Medical Disclaimer pill */}
            <div className="pt-4 flex items-center justify-center gap-1.5 text-xs text-charcoal-500 max-w-xl mx-auto">
              <ShieldAlert className="w-4 h-4 text-charcoal-400 flex-shrink-0" />
              <span>{t.disclaimerText}</span>
            </div>

          </div>
        </div>
      </section>

      {/* LIVE STATISTICS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-blood-700 bg-blood-50 px-2.5 py-1 rounded-md mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>{t.statsTitle}</span>
          </div>
          <p className="text-sm text-charcoal-600">
            {t.statsSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Donors */}
          <div className="bg-white rounded-2xl border border-charcoal-200 p-5 sm:p-6 shadow-xs hover:border-blood-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                {t.totalDonors}
              </span>
              <div className="w-9 h-9 rounded-xl bg-blood-50 text-blood-700 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-charcoal-900 tracking-tight">
              {loading ? '...' : formatNum(totalDonors)}
            </div>
            <p className="text-xs text-charcoal-500 mt-1">
              {lang === 'bn' ? 'সারাদেশে নিবন্ধিত' : 'Registered in database'}
            </p>
          </div>

          {/* Card 2: Available Donors */}
          <div className="bg-white rounded-2xl border border-emerald-200 p-5 sm:p-6 shadow-xs bg-gradient-to-br from-emerald-50/40 to-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                {t.availableDonors}
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-emerald-700 tracking-tight">
              {loading ? '...' : formatNum(availableDonors)}
            </div>
            <p className="text-xs text-emerald-700 font-medium mt-1">
              {t.activeDonorsDescription}
            </p>
          </div>

          {/* Card 3: Unavailable Donors */}
          <div className="bg-white rounded-2xl border border-rose-200 p-5 sm:p-6 shadow-xs bg-gradient-to-br from-rose-50/40 to-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-800">
                {t.unavailableDonors}
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-rose-700 tracking-tight">
              {loading ? '...' : formatNum(unavailableDonors)}
            </div>
            <p className="text-xs text-rose-700 font-medium mt-1">
              {t.waitingDonorsDescription}
            </p>
          </div>

          {/* Card 4: Blood Groups */}
          <div className="bg-white rounded-2xl border border-charcoal-200 p-5 sm:p-6 shadow-xs hover:border-blood-200 transition-colors">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-charcoal-500">
                {t.totalBloodGroups}
              </span>
              <div className="w-9 h-9 rounded-xl bg-blood-50 text-blood-700 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl sm:text-4xl font-black text-charcoal-900 tracking-tight">
              {formatNum(8)}
            </div>
            <p className="text-xs text-charcoal-500 mt-1">
              A+, A-, B+, B-, AB+, AB-, O+, O-
            </p>
          </div>
        </div>
      </section>

      {/* BLOOD GROUP OVERVIEW */}
      <section id="blood-groups" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="bg-white rounded-3xl border border-charcoal-200 p-6 sm:p-10 shadow-xs">
          
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
              {t.bloodGroupOverviewTitle}
            </h2>
            <p className="text-sm text-charcoal-600 mt-2">
              {t.bloodGroupOverviewSubtitle}
            </p>
          </div>

          {/* Grid of 8 Blood Groups */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {ALL_BLOOD_GROUPS.map((bg) => {
              const stat = groupStats[bg] || { total: 0, available: 0 };
              return (
                <button
                  key={bg}
                  onClick={() => navigate(`/directory?group=${encodeURIComponent(bg)}`)}
                  className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border border-charcoal-200 hover:border-blood-600 bg-[#fbfbfc] hover:bg-white transition-all shadow-xs hover:shadow-md hover:-translate-y-1 text-center"
                >
                  <div className="w-14 h-14 rounded-2xl bg-blood-100 group-hover:bg-blood-600 text-blood-800 group-hover:text-white flex items-center justify-center font-mono font-black text-xl shadow-xs transition-colors mb-3">
                    {bg}
                  </div>
                  
                  <div className="text-lg font-bold text-charcoal-900">
                    {formatNum(stat.total)} {t.donorsCount}
                  </div>

                  <div className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>{formatNum(stat.available)} {t.availableCount}</span>
                  </div>

                  <div className="mt-3 text-xs font-bold text-blood-700 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>{t.btnFindDonors}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-blood-700 text-white p-8 sm:p-12 shadow-lg">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs">
              <HeartHandshake className="w-4 h-4" />
              <span>{lang === 'bn' ? 'জীবন বাঁচাতে এগিয়ে আসুন' : 'Save Lives'}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {t.ctaHeading}
            </h2>
            <p className="text-blood-100 text-sm sm:text-base leading-relaxed">
              {t.ctaDescription}
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                to="/report"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-blood-50 text-blood-800 font-bold text-sm shadow-md transition-colors"
              >
                <span>{t.ctaButton}</span>
                <ArrowRight className="w-4 h-4 text-blood-800" />
              </Link>
              <Link
                to="/awareness"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blood-800/80 hover:bg-blood-800 text-white font-semibold text-sm border border-blood-600 transition-colors"
              >
                <span>{t.navAwareness}</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
