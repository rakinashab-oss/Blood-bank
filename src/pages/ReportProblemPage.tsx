import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
  Phone, 
  Mail, 
  User, 
  CheckCircle, 
  HelpCircle, 
  HeartHandshake
} from 'lucide-react';

export const ReportProblemPage: React.FC = () => {
  const { lang, t } = useLanguage();

  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSendForm = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoUrl = `mailto:${t.devEmail}?subject=${encodeURIComponent(
      subject || 'Blood Bank Feedback / Problem Report'
    )}&body=${encodeURIComponent(message)}`;
    window.location.href = mailtoUrl;
    setSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
      
      {/* Title */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blood-100 text-blood-800 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>{t.navReport}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-charcoal-900 tracking-tight">
          {t.reportTitle}
        </h1>
        <p className="text-base text-charcoal-600 max-w-xl mx-auto">
          {t.feedbackPrompt}
        </p>
      </div>

      {/* Main Developer Contact Card */}
      <div className="bg-white rounded-3xl border border-charcoal-200 p-6 sm:p-10 shadow-sm space-y-8">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center sm:text-left">
          
          {/* Developer Name */}
          <div className="p-5 rounded-2xl bg-[#fbfbfc] border border-charcoal-100 flex flex-col items-center sm:items-start space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blood-50 text-blood-700 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
              {t.devNameLabel}
            </span>
            <span className="text-lg font-black text-charcoal-900">
              Rakin Ashab
            </span>
            <span className="text-xs text-charcoal-500">
              Full-Stack Developer
            </span>
          </div>

          {/* Direct Phone */}
          <div className="p-5 rounded-2xl bg-[#fbfbfc] border border-charcoal-100 flex flex-col items-center sm:items-start space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
              {t.devPhoneLabel}
            </span>
            <span className="text-lg font-mono font-bold text-charcoal-900">
              01936106621
            </span>
            <span className="text-xs text-charcoal-500">
              Bangladesh (Direct & WhatsApp)
            </span>
          </div>

          {/* Direct Email */}
          <div className="p-5 rounded-2xl bg-[#fbfbfc] border border-charcoal-100 flex flex-col items-center sm:items-start space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-charcoal-400">
              {t.devEmailLabel}
            </span>
            <span className="text-sm font-semibold text-charcoal-900 break-all">
              mohammadrakinashab@gmail.com
            </span>
            <span className="text-xs text-charcoal-500">
              Official Inquiries & Support
            </span>
          </div>

        </div>

        {/* Functional Buttons as required in prompt */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="tel:01936106621"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-blood-600 hover:bg-blood-700 text-white font-bold text-sm sm:text-base shadow-md shadow-blood-700/20 active:scale-98 transition-all"
          >
            <Phone className="w-5 h-5" />
            <span>{t.callDeveloper} (01936106621)</span>
          </a>

          <a
            href="mailto:mohammadrakinashab@gmail.com"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-charcoal-50 text-charcoal-800 font-bold text-sm sm:text-base border border-charcoal-300 shadow-xs transition-colors"
          >
            <Mail className="w-5 h-5 text-blood-600" />
            <span>{t.emailDeveloper}</span>
          </a>
        </div>

        {/* Direct Email Composition Box */}
        <div className="pt-6 border-t border-charcoal-100">
          <h3 className="text-base font-bold text-charcoal-900 mb-1">
            {lang === 'bn' ? 'বার্তা বা পরামর্শ পাঠান' : 'Submit a Note or Suggestion'}
          </h3>
          <p className="text-xs text-charcoal-500 mb-4">
            {lang === 'bn' 
              ? 'নিচের ফর্মটি পূরণ করে পাঠান বাটনে ক্লিক করলে আপনার ইমেইল ক্লায়েন্ট খুলে যাবে।'
              : 'Fill out this quick form to dispatch a formatted message to the lead developer.'}
          </p>

          {submitted && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>Email client invoked. Thank you for helping improve Blood Bank!</span>
            </div>
          )}

          <form onSubmit={handleSendForm} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                {lang === 'bn' ? 'বিষয়' : 'Subject'}
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={lang === 'bn' ? 'যেমন: নতুন ডোনার তথ্য বা কারিগরি সমস্যা' : 'e.g., Issue with donor availability calculation'}
                className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal-300 text-sm focus:border-blood-600 focus:ring-1 focus:ring-blood-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
                {lang === 'bn' ? 'বিস্তারিত বার্তা' : 'Message / Details'}
              </label>
              <textarea
                required
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={lang === 'bn' ? 'আপনার মতামত বা সমস্যার বিস্তারিত লিখুন...' : 'Describe the problem or suggestion in detail...'}
                className="w-full px-3.5 py-2 rounded-lg border border-charcoal-300 text-sm focus:border-blood-600 focus:ring-1 focus:ring-blood-600"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-white font-semibold text-xs shadow-xs transition-colors"
            >
              <Mail className="w-4 h-4" />
              <span>{t.emailDeveloper}</span>
            </button>
          </form>
        </div>

      </div>

      {/* Emergency Hotline note */}
      <div className="p-4 rounded-2xl bg-charcoal-100/70 border border-charcoal-200 text-xs text-charcoal-600 flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-medium">
          <HeartHandshake className="w-4 h-4 text-blood-700" />
          <span>{t.emergencyNote}</span>
        </span>
        <span className="font-bold text-charcoal-900">Hotline: 999</span>
      </div>

    </div>
  );
};
