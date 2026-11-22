import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { DataService } from '../lib/supabase';
import { BloodGroup, DonorWithAvailability } from '../types';
import { DonorCard } from '../components/DonorCard';
import { DonorTable } from '../components/DonorTable';
import { toBengaliNumerals } from '../lib/availability';
import { 
  Search, 
  RotateCcw, 
  LayoutGrid, 
  Table as TableIcon, 
  CheckCircle2, 
  Clock, 
  Info,
  Loader2,
  Heart
} from 'lucide-react';

const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const DirectoryPage: React.FC = () => {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();

  const [donors, setDonors] = useState<DonorWithAvailability[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedGroup, setSelectedGroup] = useState<string>(searchParams.get('group') || 'ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'AVAILABLE' | 'UNAVAILABLE'>(
    (searchParams.get('status') as 'ALL' | 'AVAILABLE' | 'UNAVAILABLE') || 'ALL'
  );
  const [sortBy, setSortBy] = useState<'availability' | 'recentlyDonated' | 'name'>('availability');

  useEffect(() => {
    async function fetchDonors() {
      try {
        setLoading(true);
        const data = await DataService.getDonors();
        setDonors(data);
      } catch (err) {
        console.error('Error fetching donors:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDonors();
  }, []);

  // Update query params when group parameter changes externally (e.g. from homepage click)
  useEffect(() => {
    const groupFromUrl = searchParams.get('group');
    if (groupFromUrl && BLOOD_GROUPS.includes(groupFromUrl as BloodGroup)) {
      setSelectedGroup(groupFromUrl);
    }
  }, [searchParams]);

  // Filter and sort donor records
  const filteredDonors = useMemo(() => {
    return donors.filter((donor) => {
      // Search by name or phone
      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const matchName = donor.full_name.toLowerCase().includes(query);
        const matchPhone = donor.phone_number.includes(query);
        if (!matchName && !matchPhone) return false;
      }

      // Filter by blood group
      if (selectedGroup !== 'ALL' && donor.blood_group !== selectedGroup) {
        return false;
      }

      // Filter by status
      if (statusFilter === 'AVAILABLE' && !donor.is_available) {
        return false;
      }
      if (statusFilter === 'UNAVAILABLE' && donor.is_available) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'availability') {
        // Available donors first (days_remaining = 0), then ascending by days_remaining
        if (a.is_available && !b.is_available) return -1;
        if (!a.is_available && b.is_available) return 1;
        return a.days_remaining - b.days_remaining;
      }
      if (sortBy === 'recentlyDonated') {
        // Most recent donation date first
        return new Date(b.last_donation_date).getTime() - new Date(a.last_donation_date).getTime();
      }
      if (sortBy === 'name') {
        return a.full_name.localeCompare(b.full_name);
      }
      return 0;
    });
  }, [donors, searchQuery, selectedGroup, statusFilter, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGroup('ALL');
    setStatusFilter('ALL');
    setSortBy('availability');
    setSearchParams({});
  };

  const formatCount = (n: number) => (lang === 'bn' ? toBengaliNumerals(n) : String(n));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Directory Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-black text-charcoal-900 tracking-tight">
            {t.directoryTitle}
          </h1>
          <p className="text-sm sm:text-base text-charcoal-600 max-w-2xl">
            {t.directorySubtitle}
          </p>
        </div>

        <Link
          to="/register"
          className="self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blood-600 hover:bg-blood-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blood-700/20 active:scale-95 transition-all"
        >
          <Heart className="w-4 h-4 fill-current text-white" />
          <span>{t.btnBeDonor}</span>
        </Link>
      </div>

      {/* Medical Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-2.5">
        <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-amber-900">{t.disclaimerTitle}</p>
          <p className="text-amber-800 leading-relaxed">{t.disclaimerText}</p>
        </div>
      </div>

      {/* FILTER & SEARCH CONTROL PANEL */}
      <div className="bg-white rounded-2xl border border-charcoal-200 p-4 sm:p-6 shadow-xs space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-charcoal-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-charcoal-300 text-sm sm:text-base placeholder:text-charcoal-400 focus:border-blood-600 focus:ring-1 focus:ring-blood-600 transition-colors shadow-xs"
          />
        </div>

        {/* Blood Group Quick Filter Buttons */}
        <div>
          <label className="block text-xs font-bold text-charcoal-600 uppercase tracking-wider mb-2">
            {t.colBloodGroup}
          </label>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setSelectedGroup('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedGroup === 'ALL'
                  ? 'bg-blood-700 text-white shadow-xs'
                  : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
              }`}
            >
              {t.filterAllGroups}
            </button>
            {BLOOD_GROUPS.map((bg) => (
              <button
                key={bg}
                onClick={() => setSelectedGroup(bg)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  selectedGroup === bg
                    ? 'bg-blood-700 text-white shadow-xs'
                    : 'bg-blood-50 text-blood-800 border border-blood-200 hover:bg-blood-100'
                }`}
              >
                {bg}
              </button>
            ))}
          </div>
        </div>

        {/* Secondary Filters (Status, Sort, Reset, View Mode) */}
        <div className="pt-2 border-t border-charcoal-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-charcoal-500 mr-1">{t.colStatus}:</span>
            
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-colors ${
                statusFilter === 'ALL'
                  ? 'bg-charcoal-900 text-white'
                  : 'bg-charcoal-100 text-charcoal-700 hover:bg-charcoal-200'
              }`}
            >
              {t.filterStatusAll}
            </button>

            <button
              onClick={() => setStatusFilter('AVAILABLE')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-colors ${
                statusFilter === 'AVAILABLE'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>{t.filterStatusAvailable}</span>
            </button>

            <button
              onClick={() => setStatusFilter('UNAVAILABLE')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md font-semibold transition-colors ${
                statusFilter === 'UNAVAILABLE'
                  ? 'bg-rose-600 text-white'
                  : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>{t.filterStatusUnavailable}</span>
            </button>
          </div>

          {/* Right Controls: Sort & Layout */}
          <div className="flex items-center gap-3">
            {/* Sort Selector */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-charcoal-500">{t.sortBy}:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1 rounded-md border border-charcoal-300 bg-white font-medium text-charcoal-800 focus:border-blood-600 text-xs"
              >
                <option value="availability">{t.sortAvailability}</option>
                <option value="recentlyDonated">{t.sortRecentlyDonated}</option>
                <option value="name">{t.sortName}</option>
              </select>
            </div>

            {/* Reset Button */}
            {(searchQuery || selectedGroup !== 'ALL' || statusFilter !== 'ALL' || sortBy !== 'availability') && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2 py-1 text-charcoal-600 hover:text-rose-600 font-semibold"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{t.resetFilters}</span>
              </button>
            )}

            {/* View Mode Toggle (Desktop only) */}
            <div className="hidden md:flex items-center border border-charcoal-300 rounded-lg p-0.5 bg-charcoal-50">
              <button
                onClick={() => setViewMode('cards')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'cards' ? 'bg-white shadow-xs text-blood-700' : 'text-charcoal-500 hover:text-charcoal-900'
                }`}
                title={t.viewAsCards}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-md ${
                  viewMode === 'table' ? 'bg-white shadow-xs text-blood-700' : 'text-charcoal-500 hover:text-charcoal-900'
                }`}
                title={t.viewAsTable}
              >
                <TableIcon className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* RESULTS COUNT & STATUS */}
      <div className="flex items-center justify-between text-xs font-semibold text-charcoal-500 px-1">
        <span>
          {formatCount(filteredDonors.length)} {t.resultsFound}
        </span>
        <span className="text-charcoal-400">
          {lang === 'bn' ? 'স্বয়ংক্রিয় ৯০ দিনের ব্যবধান সক্রিয়' : 'Default 90-day calculation active'}
        </span>
      </div>

      {/* DONOR LISTINGS */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-charcoal-500">
          <Loader2 className="w-8 h-8 animate-spin text-blood-600" />
          <p className="text-sm font-medium">{lang === 'bn' ? 'ডোনার তথ্য লোড হচ্ছে...' : 'Loading donor directory...'}</p>
        </div>
      ) : filteredDonors.length === 0 ? (
        <div className="py-16 px-4 text-center bg-white rounded-2xl border border-charcoal-200 space-y-4">
          <div className="w-12 h-12 rounded-full bg-charcoal-100 text-charcoal-500 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-charcoal-900">
              {t.noDonorsFound}
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-500 mt-1 max-w-md mx-auto">
              {t.noDonorsDescription}
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-charcoal-900 text-white font-semibold text-xs shadow-xs hover:bg-charcoal-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetFilters}</span>
          </button>
        </div>
      ) : (
        <>
          {/* Card View (Always on Mobile, selectable on Desktop) */}
          <div className={viewMode === 'cards' ? 'block' : 'block md:hidden'}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredDonors.map((donor) => (
                <DonorCard key={donor.id} donor={donor} />
              ))}
            </div>
          </div>

          {/* Table View (Desktop option) */}
          <div className={viewMode === 'table' ? 'hidden md:block' : 'hidden'}>
            <DonorTable donors={filteredDonors} />
          </div>
        </>
      )}

    </div>
  );
};
