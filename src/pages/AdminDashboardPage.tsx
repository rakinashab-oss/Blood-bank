import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { DataService } from '../lib/supabase';
import { BloodGroup, Donor, DonorWithAvailability, AppSettings } from '../types';
import { DonorCard } from '../components/DonorCard';
import { DonorTable } from '../components/DonorTable';
import { AddEditDonorModal } from '../components/AddEditDonorModal';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { toBengaliNumerals } from '../lib/availability';
import { 
  Users, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search, 
  Sliders, 
  KeyRound, 
  Download, 
  Check, 
  AlertCircle, 
  Loader2,
  ShieldAlert,
  Save,
  RotateCcw
} from 'lucide-react';

const ALL_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const AdminDashboardPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const { admin, isAuthenticated, changePassword } = useAuth();
  const navigate = useNavigate();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const [donors, setDonors] = useState<DonorWithAvailability[]>([]);
  const [settings, setSettings] = useState<AppSettings>({ id: 1, donation_interval_days: 90 });
  const [loading, setLoading] = useState(true);

  // Search & Filter within Admin
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('ALL');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingDonor, setEditingDonor] = useState<DonorWithAvailability | null>(null);
  const [deletingDonor, setDeletingDonor] = useState<DonorWithAvailability | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Settings drawer / modal state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempInterval, setTempInterval] = useState(90);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // Change Password state
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Toast message
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [sett, donorList] = await Promise.all([
        DataService.getSettings(),
        DataService.getDonors(),
      ]);
      setSettings(sett);
      setTempInterval(sett.donation_interval_days);
      setDonors(donorList);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  // Handle Add or Edit donor
  const handleSaveDonor = async (
    donorData: Omit<Donor, 'id' | 'created_at' | 'updated_at'>,
    donorId?: string
  ) => {
    if (donorId) {
      // Edit
      await DataService.updateDonor(donorId, donorData);
      showToast(t.toastDonorUpdated);
    } else {
      // Add
      await DataService.addDonor(donorData, admin?.auth_user_id);
      showToast(t.toastDonorAdded);
    }
    await loadAllData();
  };

  // Handle Delete donor
  const handleDeleteDonor = async () => {
    if (!deletingDonor) return;
    try {
      setIsDeleting(true);
      await DataService.deleteDonor(deletingDonor.id);
      showToast(t.toastDonorDeleted);
      setDeletingDonor(null);
      await loadAllData();
    } catch (err) {
      console.error('Error deleting donor:', err);
      showToast(t.toastError);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle Update Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSavingSettings(true);
      const updated = await DataService.updateSettings(Number(tempInterval));
      setSettings(updated);
      showToast(t.settingsSaved);
      setIsSettingsOpen(false);
      await loadAllData();
    } catch (err) {
      console.error('Error saving settings:', err);
      showToast(t.toastError);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);

    if (newPassword.length < 6) {
      setPasswordError(t.passwordTooShort);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError(t.passwordMismatch);
      return;
    }

    try {
      const ok = await changePassword(newPassword);
      if (ok) {
        setPasswordSuccess(true);
        showToast(t.toastPasswordChanged);
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setPasswordSuccess(false);
          setNewPassword('');
          setConfirmPassword('');
        }, 1500);
      } else {
        setPasswordError(t.toastError);
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      setPasswordError(errorObj?.message || t.toastError);
    }
  };

  // Export Donors to CSV
  const handleExportCSV = () => {
    const headers = ['Full Name', 'Phone Number', 'Blood Group', 'Last Donation Date', 'Next Eligible Date', 'Availability', 'Days Remaining', 'Comments'];
    const rows = donors.map((d) => [
      `"${d.full_name}"`,
      `"${d.phone_number}"`,
      `"${d.blood_group}"`,
      `"${d.last_donation_date}"`,
      `"${d.next_eligible_date}"`,
      `"${d.is_available ? 'AVAILABLE' : 'UNAVAILABLE'}"`,
      d.days_remaining,
      `"${(d.comments || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bloodbank_donors_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filtered Donors list for admin
  const filteredDonors = useMemo(() => {
    return donors.filter((d) => {
      if (selectedGroup !== 'ALL' && d.blood_group !== selectedGroup) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return d.full_name.toLowerCase().includes(q) || d.phone_number.includes(q);
      }
      return true;
    });
  }, [donors, selectedGroup, searchQuery]);

  // Statistics calculation
  const totalDonors = donors.length;
  const availableDonors = donors.filter((d) => d.is_available).length;
  const unavailableDonors = totalDonors - availableDonors;

  const groupCounts = ALL_GROUPS.reduce((acc, bg) => {
    acc[bg] = donors.filter((d) => d.blood_group === bg).length;
    return acc;
  }, {} as Record<BloodGroup, number>);

  const formatNum = (n: number) => (lang === 'bn' ? toBengaliNumerals(n) : String(n));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-charcoal-900 text-white text-xs sm:text-sm font-semibold shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Must Change Password Warning Banner */}
      {admin?.must_change_password && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <span>
              {lang === 'bn' 
                ? 'আপনি ডিফল্ট পাসওয়ার্ড দিয়ে লগইন করেছেন। অনুগ্রহ করে নতুন পাসওয়ার্ড নির্ধারণ করুন।'
                : 'You are using an initial default password (admin1234). Please update your password.'}
            </span>
          </div>
          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-amber-800 text-white font-bold text-xs hover:bg-amber-900 transition-colors"
          >
            {t.btnChangePassword}
          </button>
        </div>
      )}

      {/* DASHBOARD TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-blood-100 text-blood-800 px-2.5 py-1 rounded-md">
              Admin: {admin?.username}
            </span>
            <span className="text-xs font-mono text-charcoal-400">
              Role: {admin?.role || 'admin'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-charcoal-900 tracking-tight mt-1">
            {t.adminDashboardTitle}
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500">
            {t.adminDashboardSubtitle} (Interval: {settings.donation_interval_days} days)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={() => {
              setEditingDonor(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blood-600 hover:bg-blood-700 text-white font-bold text-xs sm:text-sm shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t.btnAddDonor}</span>
          </button>

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-charcoal-300 text-charcoal-700 hover:bg-charcoal-50 font-semibold text-xs sm:text-sm transition-colors"
            title="Configure donation interval"
          >
            <Sliders className="w-4 h-4 text-charcoal-500" />
            <span>{t.navSettings}</span>
          </button>

          <button
            onClick={() => setIsPasswordModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white border border-charcoal-300 text-charcoal-700 hover:bg-charcoal-50 font-semibold text-xs sm:text-sm transition-colors"
            title="Change password"
          >
            <KeyRound className="w-4 h-4 text-charcoal-500" />
            <span>{t.changePasswordTitle}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200 font-semibold text-xs transition-colors"
            title="Export CSV"
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">CSV</span>
          </button>
        </div>
      </div>

      {/* DASHBOARD STATISTICS OVERVIEW */}
      <div className="space-y-4">
        {/* Top 3 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-xs">
            <div className="flex items-center justify-between text-charcoal-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">{t.totalDonors}</span>
              <Users className="w-4 h-4 text-blood-600" />
            </div>
            <div className="text-3xl font-black text-charcoal-900 tracking-tight">
              {loading ? '...' : formatNum(totalDonors)}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-emerald-200 p-5 shadow-xs bg-emerald-50/20">
            <div className="flex items-center justify-between text-emerald-800 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">{t.availableDonors}</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-emerald-700 tracking-tight">
              {loading ? '...' : formatNum(availableDonors)}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-rose-200 p-5 shadow-xs bg-rose-50/20">
            <div className="flex items-center justify-between text-rose-800 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">{t.unavailableDonors}</span>
              <Clock className="w-4 h-4 text-rose-600" />
            </div>
            <div className="text-3xl font-black text-rose-700 tracking-tight">
              {loading ? '...' : formatNum(unavailableDonors)}
            </div>
          </div>
        </div>

        {/* 8 Blood Groups Distribution Breakdown */}
        <div className="bg-white rounded-2xl border border-charcoal-200 p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-charcoal-500 mb-3">
            {lang === 'bn' ? 'সকল ৮টি রক্তের গ্রুপে ডোনার সংখ্যা' : 'Donors Across All 8 Blood Groups'}
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
            {ALL_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => setSelectedGroup(selectedGroup === bg ? 'ALL' : bg)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedGroup === bg
                    ? 'border-blood-700 bg-blood-50 shadow-xs'
                    : 'border-charcoal-200 bg-[#fbfbfc] hover:border-charcoal-300'
                }`}
              >
                <div className="font-mono font-bold text-xs text-blood-700">{bg}</div>
                <div className="text-lg font-black text-charcoal-900 mt-0.5">
                  {formatNum(groupCounts[bg] || 0)}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* DONOR MANAGEMENT CONTROLS */}
      <div className="bg-white rounded-2xl border border-charcoal-200 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-charcoal-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-charcoal-300 text-xs sm:text-sm focus:border-blood-600 focus:ring-1 focus:ring-blood-600"
            />
          </div>

          {/* Group Filter */}
          <div className="flex items-center gap-2">
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
              className="px-3 py-2 rounded-xl border border-charcoal-300 text-xs font-semibold bg-white text-charcoal-800 focus:border-blood-600"
            >
              <option value="ALL">{t.filterAllGroups}</option>
              {ALL_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>

            {(searchQuery || selectedGroup !== 'ALL') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedGroup('ALL');
                }}
                className="p-2 rounded-xl border border-charcoal-200 text-charcoal-500 hover:text-rose-600 hover:bg-rose-50"
                title="Reset filters"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>

        </div>

        <div className="text-xs text-charcoal-500 font-medium">
          Showing {formatNum(filteredDonors.length)} of {formatNum(totalDonors)} donors
        </div>
      </div>

      {/* DONOR RECORDS (Cards on Mobile, Table on Desktop) */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center gap-2 text-charcoal-500">
          <Loader2 className="w-6 h-6 animate-spin text-blood-600" />
          <span className="text-xs font-medium">Loading records...</span>
        </div>
      ) : filteredDonors.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-2xl border border-charcoal-200 space-y-3">
          <p className="text-sm font-semibold text-charcoal-800">{t.noDonorsFound}</p>
          <button
            onClick={() => {
              setEditingDonor(null);
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blood-600 text-white text-xs font-semibold"
          >
            <Plus className="w-4 h-4" />
            <span>{t.btnAddDonor}</span>
          </button>
        </div>
      ) : (
        <>
          <div className="block lg:hidden space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredDonors.map((donor) => (
                <DonorCard
                  key={donor.id}
                  donor={donor}
                  isAdmin={true}
                  onEdit={(d) => {
                    setEditingDonor(d);
                    setIsAddModalOpen(true);
                  }}
                  onDelete={(d) => setDeletingDonor(d)}
                />
              ))}
            </div>
          </div>

          <div className="hidden lg:block">
            <DonorTable
              donors={filteredDonors}
              isAdmin={true}
              onEdit={(d) => {
                setEditingDonor(d);
                setIsAddModalOpen(true);
              }}
              onDelete={(d) => setDeletingDonor(d)}
            />
          </div>
        </>
      )}

      {/* ADD / EDIT DONOR MODAL */}
      <AddEditDonorModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingDonor(null);
        }}
        onSave={handleSaveDonor}
        editingDonor={editingDonor}
      />

      {/* CONFIRM DELETE DIALOG */}
      <ConfirmDialog
        isOpen={Boolean(deletingDonor)}
        title={t.deleteTitle}
        message={`${t.deleteMessage} (${deletingDonor?.full_name} — ${deletingDonor?.blood_group})`}
        confirmLabel={t.btnDeleteConfirm}
        cancelLabel={t.btnDeleteCancel}
        onConfirm={handleDeleteDonor}
        onCancel={() => setDeletingDonor(null)}
        isLoading={isDeleting}
      />

      {/* APPLICATION SETTINGS MODAL (Configurable 90-day interval) */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-charcoal-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-charcoal-100 pb-3">
              <h3 className="font-bold text-base text-charcoal-900">{t.settingsTitle}</h3>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-charcoal-400 hover:text-charcoal-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  {t.donationIntervalLabel}
                </label>
                <input
                  type="number"
                  min="30"
                  max="180"
                  required
                  value={tempInterval}
                  onChange={(e) => setTempInterval(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal-300 text-sm focus:border-blood-600"
                />
                <p className="mt-1 text-xs text-charcoal-500">
                  {t.intervalHelpText}
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-charcoal-100">
                <button
                  type="button"
                  onClick={() => setIsSettingsOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-charcoal-300 text-xs font-semibold text-charcoal-700 hover:bg-charcoal-50"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  disabled={isSavingSettings}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blood-600 hover:bg-blood-700 text-white text-xs font-semibold disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSavingSettings ? 'Saving...' : t.saveSettings}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CHANGE PASSWORD MODAL */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-charcoal-200 overflow-hidden p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-charcoal-100 pb-3">
              <h3 className="font-bold text-base text-charcoal-900">{t.changePasswordTitle}</h3>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-charcoal-400 hover:text-charcoal-700 text-xs font-bold"
              >
                ✕
              </button>
            </div>

            {passwordError && (
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            {passwordSuccess && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>{t.toastPasswordChanged}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  {t.newPasswordLabel}
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder={t.newPasswordPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal-300 text-sm focus:border-blood-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-700 uppercase tracking-wider mb-1">
                  {t.confirmPasswordLabel}
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={t.confirmPasswordPlaceholder}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal-300 text-sm focus:border-blood-600"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-charcoal-100">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-3.5 py-2 rounded-lg border border-charcoal-300 text-xs font-semibold text-charcoal-700 hover:bg-charcoal-50"
                >
                  {t.btnCancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-charcoal-900 hover:bg-charcoal-800 text-white text-xs font-semibold"
                >
                  {t.btnChangePassword}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
