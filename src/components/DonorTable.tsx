import React from 'react';
import { DonorWithAvailability } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { BloodGroupBadge } from './BloodGroupBadge';
import { StatusBadge } from './StatusBadge';
import { formatDate } from '../lib/availability';
import { Phone, Edit3, Trash2 } from 'lucide-react';

interface DonorTableProps {
  donors: DonorWithAvailability[];
  isAdmin?: boolean;
  onEdit?: (donor: DonorWithAvailability) => void;
  onDelete?: (donor: DonorWithAvailability) => void;
}

export const DonorTable: React.FC<DonorTableProps> = ({
  donors,
  isAdmin = false,
  onEdit,
  onDelete,
}) => {
  const { lang, t } = useLanguage();

  return (
    <div className="overflow-x-auto rounded-xl border border-charcoal-200 bg-white shadow-xs">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="bg-charcoal-50/80 border-b border-charcoal-200 text-xs font-bold text-charcoal-600 uppercase tracking-wider">
            <th className="py-3.5 px-4">{t.colName}</th>
            <th className="py-3.5 px-4">{t.colBloodGroup}</th>
            <th className="py-3.5 px-4">{t.colStatus}</th>
            <th className="py-3.5 px-4">{t.colLastDonated}</th>
            <th className="py-3.5 px-4">{t.colNextEligible}</th>
            <th className="py-3.5 px-4">{t.colPhone}</th>
            <th className="py-3.5 px-4">{t.colComments}</th>
            <th className="py-3.5 px-4 text-right">{t.colActions}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-charcoal-100">
          {donors.map((donor) => (
            <tr
              key={donor.id}
              className="hover:bg-charcoal-50/50 transition-colors"
            >
              {/* Full Name */}
              <td className="py-3.5 px-4 font-semibold text-charcoal-900 whitespace-nowrap">
                {donor.full_name}
              </td>

              {/* Blood Group */}
              <td className="py-3.5 px-4 whitespace-nowrap">
                <BloodGroupBadge group={donor.blood_group} size="sm" />
              </td>

              {/* Status */}
              <td className="py-3.5 px-4">
                <StatusBadge
                  isAvailable={donor.is_available}
                  daysRemaining={donor.days_remaining}
                  size="sm"
                  showDaysText={true}
                />
              </td>

              {/* Last Donation Date */}
              <td className="py-3.5 px-4 text-xs text-charcoal-600 whitespace-nowrap">
                {formatDate(donor.last_donation_date, lang)}
              </td>

              {/* Next Eligible Date */}
              <td className="py-3.5 px-4 text-xs font-medium text-charcoal-700 whitespace-nowrap">
                {formatDate(donor.next_eligible_date, lang)}
              </td>

              {/* Phone Number */}
              <td className="py-3.5 px-4 font-mono text-xs text-charcoal-800 whitespace-nowrap">
                {donor.phone_number}
              </td>

              {/* Comments */}
              <td className="py-3.5 px-4 text-xs text-charcoal-500 max-w-xs truncate">
                {donor.comments || '—'}
              </td>

              {/* Actions */}
              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                <div className="flex items-center justify-end gap-1.5">
                  <a
                    href={`tel:${donor.phone_number}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blood-600 hover:bg-blood-700 text-white font-semibold text-xs transition-colors"
                    title={`Call ${donor.phone_number}`}
                  >
                    <Phone className="w-3 h-3" />
                    <span>{t.btnCall}</span>
                  </a>

                  {isAdmin && (
                    <>
                      {onEdit && (
                        <button
                          onClick={() => onEdit(donor)}
                          className="p-1 rounded-md border border-charcoal-200 text-charcoal-600 hover:text-charcoal-900 hover:bg-charcoal-100 transition-colors"
                          title="Edit Donor"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(donor)}
                          className="p-1 rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Donor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
