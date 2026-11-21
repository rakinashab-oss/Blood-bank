import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Heart, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  ShieldCheck, 
  Droplet, 
  Coffee, 
  Stethoscope, 
  Activity 
} from 'lucide-react';

export const AwarenessPage: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blood-100 text-blood-800 text-xs font-bold uppercase tracking-wider">
          <Droplet className="w-3.5 h-3.5 fill-current" />
          <span>{t.navAwareness}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-charcoal-900 tracking-tight">
          {t.awarenessTitle}
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 leading-relaxed">
          {t.awarenessSubtitle}
        </p>
      </div>

      {/* Motivational Quotes Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blood-700 to-blood-800 text-white shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Heart className="w-6 h-6 fill-current text-white" />
          </div>
          <div>
            <p className="text-base sm:text-lg font-bold leading-snug">
              {t.quote1}
            </p>
            <p className="text-xs text-blood-200 mt-1 uppercase tracking-wider font-semibold">
              — Voluntary Blood Donation Campaign
            </p>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-charcoal-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blood-50 text-blood-700 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-base sm:text-lg font-bold text-charcoal-900 leading-snug">
              {t.quote2}
            </p>
            <p className="text-xs text-charcoal-500 mt-1 uppercase tracking-wider font-semibold">
              — Save Lives Bangladesh
            </p>
          </div>
        </div>
      </div>

      {/* TOPIC 1 & 2: Why it matters & Benefits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Why Blood Donation Matters */}
        <div className="bg-white rounded-2xl border border-charcoal-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blood-100 text-blood-700 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-charcoal-900">
              {t.whyMattersTitle}
            </h2>
          </div>
          <p className="text-sm text-charcoal-700 leading-relaxed">
            {t.whyMattersText}
          </p>
          <div className="p-4 rounded-xl bg-charcoal-50 border border-charcoal-100 text-xs text-charcoal-600">
            <strong>Key Fact:</strong> One whole blood donation can be separated into Red Blood Cells, Platelets, and Fresh Frozen Plasma (FFP), effectively treating up to 3 individual patients in critical condition.
          </div>
        </div>

        {/* Benefits of Voluntary Blood Donation */}
        <div className="bg-white rounded-2xl border border-charcoal-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-charcoal-900">
              {t.benefitsTitle}
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-charcoal-700">
            {t.benefitsList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* TOPIC 3 & 4: Before & After Donation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Important Things Before Donating Blood */}
        <div className="bg-white rounded-2xl border border-charcoal-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Coffee className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-charcoal-900">
              {t.beforeDonatingTitle}
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-charcoal-700">
            {t.beforeDonatingList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* After-Donation Care */}
        <div className="bg-white rounded-2xl border border-charcoal-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-charcoal-900">
              {t.aftercareTitle}
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-charcoal-700">
            {t.aftercareList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* TOPIC 5 & 6: Basic Eligibility & Doctor Consultation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        
        {/* Basic Blood Donation Awareness */}
        <div className="bg-white rounded-2xl border border-charcoal-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-charcoal-100 text-charcoal-800 flex items-center justify-center">
              <Droplet className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-charcoal-900">
              {t.basicAwarenessTitle}
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-charcoal-700">
            {t.basicAwarenessList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-blood-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Who Should Consult a Medical Professional Before Donating */}
        <div className="bg-white rounded-2xl border border-charcoal-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
              <Stethoscope className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-charcoal-900">
              {t.consultDoctorTitle}
            </h2>
          </div>
          <ul className="space-y-2.5 text-sm text-charcoal-700">
            {t.consultDoctorList.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Medical Disclaimer Banner */}
      <div className="p-5 rounded-2xl bg-charcoal-100/80 border border-charcoal-200 text-charcoal-700 text-xs sm:text-sm">
        <p className="font-bold text-charcoal-900 mb-1">{t.disclaimerTitle}</p>
        <p className="leading-relaxed">{t.disclaimerText}</p>
      </div>

    </div>
  );
};
