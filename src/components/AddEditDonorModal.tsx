import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Donor, DonorWithAvailability, BloodGroup } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { todayInDhaka } from '../lib/availability';
import { AlertCircle } from 'lucide-react';

interface AddEditDonorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (donorData: Omit<Donor, 'id' | 'created_at' | 'updated_at'>, id?: string) => Promise<void>;
  editingDonor?: DonorWithAvailability | null;
}

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const AddEditDonorModal: React.FC<AddEditDonorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editingDonor,
}) => {
  const { t } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('O+');
  const [lastDonationDate, setLastDonationDate] = useState('');
  const [comments, setComments] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = todayInDhaka();

  useEffect(() => {
    if (editingDonor) {
      setFullName(editingDonor.full_name);
      setPhoneNumber(editingDonor.phone_number);
      setBloodGroup(editingDonor.blood_group);
      setLastDonationDate(editingDonor.last_donation_date);
      setComments(editingDonor.comments || '');
      setIsPublic(editingDonor.is_public ?? true);
    } else {
      setFullName('');
      setPhoneNumber('');
      setBloodGroup('O+');
      setLastDonationDate(today);
      setComments('');
      setIsPublic(true);
    }
    setError(null);
  }, [editingDonor, isOpen, today]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
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

    if (!lastDonationDate) {
      setError(t.valDateRequired);
      return;
    }

    if (lastDonationDate > today) {
      setError(t.valDateFuture);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSave(
        {
          full_name: cleanName,
          phone_number: cleanPhone,
          blood_group: bloodGroup,
          last_donation_date: lastDonationDate,
          comments: comments.trim() || null,
          is_public: isPublic,
        },
        editingDonor?.id
      );
      onClose();
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingDonor ? t.modalEditDonorTitle : t.modalAddDonorTitle}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
            {t.fullNameLabel}
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t.fullNamePlaceholder}
            className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal-300 text-sm focus:border-blood-600 focus:ring-1 focus:ring-blood-600 transition-colors"
          />
        </div>

        {/* Mobile Number & Blood Group */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
              {t.phoneLabel}
            </label>
            <input
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder={t.phonePlaceholder}
              className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal-300 text-sm font-mono focus:border-blood-600 focus:ring-1 focus:ring-blood-600 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
              {t.bloodGroupLabel}
            </label>
            <select
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value as BloodGroup)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal-300 text-sm font-semibold focus:border-blood-600 focus:ring-1 focus:ring-blood-600 bg-white transition-colors"
            >
              {BLOOD_GROUPS.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Last Donation Date */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
            {t.lastDonationDateLabel}
          </label>
          <input
            type="date"
            required
            max={today}
            value={lastDonationDate}
            onChange={(e) => setLastDonationDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg border border-charcoal-300 text-sm focus:border-blood-600 focus:ring-1 focus:ring-blood-600 transition-colors"
          />
          <p className="mt-1 text-[11px] text-charcoal-500">
            {t.disclaimerText}
          </p>
        </div>

        {/* Comments / Notes */}
        <div>
          <label className="block text-xs font-semibold text-charcoal-700 uppercase tracking-wider mb-1">
            {t.commentsLabel}
          </label>
          <textarea
            rows={2}
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            placeholder={t.commentsPlaceholder}
            className="w-full px-3.5 py-2 rounded-lg border border-charcoal-300 text-sm focus:border-blood-600 focus:ring-1 focus:ring-blood-600 transition-colors"
          />
        </div>

        {/* Visibility Checkbox */}
        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="is_public"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="w-4 h-4 rounded text-blood-600 focus:ring-blood-500 border-charcoal-300"
          />
          <label htmlFor="is_public" className="text-xs font-medium text-charcoal-700 select-none">
            {t.isPublicLabel}
          </label>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-charcoal-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg border border-charcoal-300 text-sm font-semibold text-charcoal-700 hover:bg-charcoal-50 transition-colors"
          >
            {t.btnCancel}
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2 rounded-lg bg-blood-600 hover:bg-blood-700 text-white font-semibold text-sm shadow-xs transition-colors disabled:opacity-50"
          >
            {isSubmitting ? t.btnSaving : t.btnSaveDonor}
          </button>
        </div>
      </form>
    </Modal>
  );
};
