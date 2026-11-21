import React from 'react';
import { DonorWithAvailability } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { BloodGroupBadge } from './BloodGroupBadge';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../lib/availability';
import { Phone, Calendar, Edit3, Trash2, Clock, MessageSquareQuote } from 'lucide-react';

interface DonorCardProps {
  donor: DonorWithAvailability;
  isAdmin?: boolean;
  onEdit?: (donor: DonorWithAvailability) => void;
  onDelete?: (donor: DonorWithAvailability) => void;
}

export const DonorCard: React.FC<DonorCardProps> = ({
  donor,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const { lang, t } = useLanguage();

  return (
    <div className="bg-white rounded-xl border border-charcoal-200 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        {/* Top Header: Name, Blood Group, Availability */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base sm:text-lg text-charcoal-900 truncate">
              {donor.full_name}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <BloodGroupBadge group={donor.blood_group} size="sm" />
              <StatusBadge
                isAvailable={donor.is_available}
                daysRemaining={donor.days_remaining}
                size="sm"
                showDaysText={false}
              />
            </div>
          </div>

          {/* Quick Call Action on top-right for mobile ergonomics */}
          <a
            href={`tel:${donor.phone_number}`}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blood-600 hover:bg-blood-700 text-white font-semibold text-xs shadow-xs active:scale-95 transition-all"
            aria-label={`Call ${donor.full_name} at ${donor.phone_number}`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>{t.btnCall}</span>
          </a>
        </div>

        {/* Status text details if unavailable */}
        {!donor.is_available && (
          <div className="mb-3 px-2.5 py-1.5 rounded-lg bg-rose-50 border border-rose-100 flex items-center gap-2 text-xs font-semibold text-rose-800">
            <Clock className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
            <span>{t.availableInDays.replace('{days}', lang === 'bn' ? String(donor.days_remaining) : String(donor.days_remaining))}</span>
          </div>
        )}

        {/* Metadata Details */}
        <div className="space-y-1.5 py-2 text-xs text-charcoal-600 border-t border-b border-charcoal-100 my-2">
          <div className="flex items-center justify-between">
            <span className="text-charcoal-400">{t.colPhone}:</span>
            <span className="font-mono font-medium text-charcoal-800">{donor.phone_number}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-charcoal-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{t.colLastDonated}:</span>
            </span>
            <span className="font-medium text-charcoal-800">
              {formatDate(donor.last_donation_date, lang)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-charcoal-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{t.colNextEligible}:</span>
            </span>
            <span className="font-medium text-charcoal-800">
              {formatDate(donor.next_eligible_date, lang)}
            </span>
          </div>
        </div>

        {/* Comments / Notes */}
        {donor.comments ? (
          <div className="mt-2.5 flex items-start gap-1.5 text-xs text-charcoal-600 bg-charcoal-50/70 p-2 rounded-lg">
            <MessageSquareQuote className="w-3.5 h-3.5 text-charcoal-400 flex-shrink-0 mt-0.5" />
            <p className="line-clamp-2 italic">{donor.comments}</p>
          </div>
        ) : (
          <div className="mt-2 text-xs text-charcoal-400 italic">
            {t.noComments}
          </div>
        )}
      </div>

      {/* Admin Action Bar (if authenticated) */}
      {isAdmin && (
        <div className="mt-4 pt-3 border-t border-charcoal-100 flex items-center justify-end gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(donor)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-charcoal-300 text-xs font-medium text-charcoal-700 hover:bg-charcoal-50 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5 text-charcoal-600" />
              <span>Edit</span>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(donor)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md border border-rose-200 text-xs font-medium text-rose-700 hover:bg-rose-50 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>Delete</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
