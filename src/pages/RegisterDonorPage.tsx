import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { DataService } from '../lib/supabase';
import { BloodGroup } from '../types';
import { todayInDhaka, addDays } from '../lib/availability';
import { 
  Heart, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  Sparkles,
  Loader2
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const RegisterDonorPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  const today = todayInDhaka();
  // 90 days ago makes them immediately available
  const ninetyDaysAgo = addDays(today, -90);

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [neverDonatedOrEligible, setNeverDonatedOrEligible] = useState(true);
  const [lastDonationDate, setLastDonationDate] = useState(today);
  const [cityArea, setCityArea] = useState('');
  const [comments, setComments] = useState('');
  const [consent, setConsent] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanName = fullName.trim();
    if (!cleanName) {
      setError(t.valNameRequired);
      return;
    }

    const cleanPhone = phoneNumber.trim().replace(/[- ]/g, '');
    const bdPhoneRegex = /^01[3-9]\d{8}$/;
    if (!bdPhoneRegex.test(cleanPhone)) {
      setError(t.valPhoneInvalid);
      return;
    }

    if (!bloodGroup) {
      setError(t.valGroupRequired);
      return;
    }

    if (!consent) {
      setError(lang === 'bn' 
        ? 'অনুগ্রহ করে নিচে সম্মতি বক্সে টিক চিহ্ন দিন।' 
        : 'Please agree to the consent declaration before proceeding.');
      return;
    }

    // Determine donation date to save
    const finalDate = neverDonatedOrEligible ? ninetyDaysAgo : lastDonationDate;
    if (!neverDonatedOrEligible && finalDate > today) {
      setError(t.valDateFuture);
      return;
    }

    // Combine city/area with comments if provided
    let finalComments = '';
    if (cityArea.trim()) {
      finalComments = cityArea.trim();
    }
    if (comments.trim()) {
      finalComments = finalComments ? `${finalComments} — ${comments.trim()}` : comments.trim();
    }

    try {
      setIsSubmitting(true);
      await DataService.addDonor({
        full_name: cleanName,
        phone_number: cleanPhone,
        blood_group: bloodGroup,
        last_donation_date: finalDate,
        comments: finalComments || null,
        is_public: true,
      }, 'self-registered');

      setIsSuccess(true);
    } catch (err: unknown) {
      const errorObj = err as Error;
      if (errorObj?.message === 'DUPLICATE_PHONE') {
        setError(t.valDuplicatePhone);
      } else {
        setError(errorObj?.message || t.toastError);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blood-100 text-blood-800 text-xs font-bold uppercase tracking-wider shadow-xs">
          <Heart className="w-4 h-4 fill-blood-700 text-blood-700 animate-pulse" />
          <span>{lang === 'bn' ? 'স্বেচ্ছায় রক্তদান' : 'Voluntary Blood Donation'}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-charcoal-900 tracking-tight">
          {t.registerPageTitle}
        </h1>
        <p className="text-sm sm:text-base text-charcoal-600 max-w-xl mx-auto leading-relaxed">
          {t.registerPageSubtitle}
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl border border-charcoal-200 p-6 sm:p-10 shadow-sm transition-all">
        
        {isSuccess ? (
          // Success State
          <div className="text-center py-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-black text-charcoal-900">
                {t.registrationSuccessTitle}
              </h2>
              <p className="text-sm sm:text-base text-charcoal-600 max-w-lg mx-auto leading-relaxed">
                {t.registrationSuccessMsg}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blood-50 border border-blood-100 max-w-md mx-auto text-left flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blood-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-charcoal-700 space-y-1">
                <p><strong>{fullName}</strong> ({bloodGroup})</p>
                <p className="font-mono text-charcoal-600">{phoneNumber}</p>
                <p className="text-emerald-700 font-semibold">
                  Status: {neverDonatedOrEligible ? 'Available Now (Ready to donate)' : 'Registered with 90-day tracking'}
                </p>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => navigate(`/directory?q=${phoneNumber}`)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blood-600 hover:bg-blood-700 text-white font-bold text-sm shadow-md transition-all"
              >
                <span>{t.viewMyListing}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setIsSuccess(false);
                  setFullName('');
                  setPhoneNumber('');
                  setCityArea('');
                  setComments('');
                  setConsent(false);
                  setNeverDonatedOrEligible(true);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-charcoal-300 text-charcoal-700 hover:bg-charcoal-50 font-semibold text-sm transition-colors"
              >
                {lang === 'bn' ? 'আরেকজন ডোনার যুক্ত করুন' : 'Register Another Donor'}
              </button>
            </div>
          </div>
        ) : (
          // Form State
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {error && (
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2.5">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                {t.fullNameLabel}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-charcoal-300 text-sm focus:border-blood-600 focus:ring-1 focus:ring-blood-600 transition-colors shadow-xs"
                />
              </div>
            </div>

            {/* Mobile Number & Blood Group */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  {t.phoneLabel}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-charcoal-300 text-sm font-mono focus:border-blood-600 focus:ring-1 focus:ring-blood-600 transition-colors shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                  {t.bloodGroupLabel}
                </label>
                <select
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
                  className="w-full px-3.5 py-3 rounded-xl border border-charcoal-300 text-sm font-bold text-charcoal-900 bg-white focus:border-blood-600 focus:ring-1 focus:ring-blood-600 shadow-xs"
                >
                  {BLOOD_GROUPS.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* City / Area */}
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                {lang === 'bn' ? 'বর্তমান জেলা বা এলাকা' : 'Current District / Area'}
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={cityArea}
                  onChange={(e) => setCityArea(e.target.value)}
                  placeholder={lang === 'bn' ? 'যেমন: ধানমন্ডি, ঢাকা / চট্টগ্রাম সদর / সিলেট' : 'e.g. Dhanmondi, Dhaka / Chattogram / Sylhet'}
                  className="w-full pl-10 pr-3.5 py-3 rounded-xl border border-charcoal-300 text-sm focus:border-blood-600 focus:ring-1 focus:ring-blood-600 transition-colors shadow-xs"
                />
              </div>
            </div>

            {/* Donation History Section */}
            <div className="p-4 sm:p-5 rounded-2xl bg-charcoal-50 border border-charcoal-200 space-y-3">
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  id="neverDonated"
                  checked={neverDonatedOrEligible}
                  onChange={(e) => setNeverDonatedOrEligible(e.target.checked)}
                  className="w-4 h-4 text-blood-600 rounded border-charcoal-300 focus:ring-blood-500 mt-1 cursor-pointer"
                />
                <label htmlFor="neverDonated" className="text-xs sm:text-sm font-semibold text-charcoal-800 cursor-pointer select-none">
                  {t.neverDonatedCheckbox}
                </label>
              </div>

              {!neverDonatedOrEligible && (
                <div className="pt-2 pl-6 animate-in fade-in duration-150">
                  <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                    {t.lastDonationDateLabel}
                  </label>
                  <div className="relative max-w-xs">
                    <Calendar className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="date"
                      max={today}
                      required={!neverDonatedOrEligible}
                      value={lastDonationDate}
                      onChange={(e) => setLastDonationDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-charcoal-300 text-sm focus:border-blood-600 bg-white"
                    />
                  </div>
                  <p className="mt-1 text-[11px] text-charcoal-500">
                    {lang === 'bn' 
                      ? 'সর্বশেষ রক্তদানের তারিখ থেকে ৯০ দিনের হিসাব স্বয়ংক্রিয়ভাবে শুরু হবে।' 
                      : 'The 90-day countdown will automatically calculate from this date.'}
                  </p>
                </div>
              )}
            </div>

            {/* Additional notes / comments */}
            <div>
              <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1.5">
                {lang === 'bn' ? 'অতিরিক্ত মন্তব্য বা সময়সীমা (ঐচ্ছিক)' : 'Additional Notes / Availability (Optional)'}
              </label>
              <textarea
                rows={2}
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                placeholder={lang === 'bn' ? 'যেমন: বিকেলে বা ছুটির দিনে বেশি সুবিধা হয়...' : 'e.g. Free to donate after 4 PM, emergency calls anytime...'}
                className="w-full px-3.5 py-2.5 rounded-xl border border-charcoal-300 text-sm focus:border-blood-600 focus:ring-1 focus:ring-blood-600"
              />
            </div>

            {/* Consent Declaration */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
              <input
                type="checkbox"
                id="consentCheck"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-4 h-4 text-blood-600 rounded border-amber-400 focus:ring-blood-500 mt-1 cursor-pointer"
              />
              <label htmlFor="consentCheck" className="text-xs text-amber-950 leading-relaxed cursor-pointer select-none">
                <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-amber-700" />
                {t.donorConsent}
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-blood-600 hover:bg-blood-700 text-white font-bold text-sm sm:text-base shadow-md shadow-blood-700/20 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{t.btnSaving}</span>
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 fill-current" />
                  <span>{t.btnSubmitRegistration}</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-charcoal-500">
              {lang === 'bn' 
                ? 'ইতোমধ্যে নিবন্ধিত? ' 
                : 'Already registered? '}
              <Link to="/directory" className="text-blood-700 font-bold hover:underline">
                {t.navDirectory}
              </Link>
            </p>

          </form>
        )}

      </div>
    </div>
  );
};
