import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { formatRemainingDays } from '../lib/i18n';
import { CheckCircle2, Clock } from 'lucide-react';

interface StatusBadgeProps {
  isAvailable: boolean;
  daysRemaining: number;
  size?: 'sm' | 'md';
  showDaysText?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  isAvailable,
  daysRemaining,
  size = 'md',
  showDaysText = true,
}) => {
  const { lang, t } = useLanguage();

  if (isAvailable) {
    return (
      <div className="inline-flex flex-col items-start gap-1">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 ${
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>{t.statusAvailable}</span>
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex flex-col items-start gap-0.5">
      <span
        className={`inline-flex items-center gap-1.5 rounded-full font-medium bg-rose-50 text-rose-800 border border-rose-200 ${
          size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
        }`}
      >
        <span className="w-2 h-2 rounded-full bg-rose-500" />
        <Clock className="w-3.5 h-3.5 text-rose-600" />
        <span>{t.statusUnavailable}</span>
      </span>
      {showDaysText && (
        <span className="text-[11px] font-medium text-rose-700 mt-0.5">
          {formatRemainingDays(daysRemaining, lang)}
        </span>
      )}
    </div>
  );
};
