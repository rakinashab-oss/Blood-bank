import { Language } from '../types';
import { toBengaliNumerals } from './availability';

export const translations = {
  en: {
    // Brand
    brandName: 'Blood Bank',
    tagline: 'Donate Blood, Save Lives.',
    developerCredit: 'Developed by Rakin Ashab',
    devPhone: '01936106621',
    devEmail: 'mohammadrakinashab@gmail.com',

    // Navigation
    navHome: 'Home',
    navDirectory: 'Find Donors',
    navBloodGroups: 'Blood Groups',
    navAwareness: 'Awareness',
    navReport: 'Report a Problem',
    navAdmin: 'Admin Portal',
    navDashboard: 'Dashboard',
    navSettings: 'Settings',
    navLogout: 'Sign Out',
    navLogin: 'Admin Login',

    // Hero Section
    heroHeading: 'Donate Blood, Save Lives.',
    heroDescription: 'Find blood donors, connect with volunteers, and help save lives. Every donation makes a difference across Bangladesh.',
    btnFindDonors: 'Find Blood Donors',
    btnViewDirectory: 'View Donor Directory',
    btnBeDonor: 'Join as a Donor',

    // Live Statistics
    statsTitle: 'Live Donor Statistics',
    statsSubtitle: 'Real-time database records updated across all 8 blood groups',
    totalDonors: 'Total Registered Donors',
    availableDonors: 'Available Donors',
    unavailableDonors: 'Unavailable Donors',
    totalBloodGroups: 'Blood Groups Supported',
    activeDonorsDescription: 'Ready to donate immediately',
    waitingDonorsDescription: 'Within 90-day recovery period',

    // Blood Group Overview
    bloodGroupOverviewTitle: 'Blood Groups Overview',
    bloodGroupOverviewSubtitle: 'Select any blood group to instantly view all matching donors',
    donorsCount: 'donors',
    availableCount: 'available',

    // Call to Action
    ctaHeading: "Be Someone's Lifesaver. Become a Blood Donor Today.",
    ctaDescription: 'Your voluntary donation can give an accident victim, surgery patient, or thalassemia warrior another chance at life.',
    ctaButton: 'Contact Admin to Register',

    // Donor Directory
    directoryTitle: 'Public Donor Directory',
    directorySubtitle: 'Emergency blood donor directory in Bangladesh with live 90-day donation availability',
    searchPlaceholder: 'Search by donor name or phone number...',
    filterAllGroups: 'All Blood Groups',
    filterStatusAll: 'All Statuses',
    filterStatusAvailable: 'Available Now Only',
    filterStatusUnavailable: 'Unavailable Only',
    sortBy: 'Sort by',
    sortRecentlyDonated: 'Most Recently Donated',
    sortAvailability: 'Availability (Immediate First)',
    sortName: 'Donor Name (A-Z)',
    resetFilters: 'Reset Filters',
    resultsFound: 'donor records found',
    noDonorsFound: 'No donors match your search criteria.',
    noDonorsDescription: 'Try adjusting your filters or search terms to find available donors.',
    viewAsCards: 'Cards View',
    viewAsTable: 'Table View',

    // Donor Fields
    colName: 'Full Name',
    colPhone: 'Phone Number',
    colBloodGroup: 'Blood Group',
    colLastDonated: 'Last Donation Date',
    colNextEligible: 'Next Eligible Date',
    colStatus: 'Status',
    colComments: 'Comments / Notes',
    colActions: 'Actions',
    btnCall: 'Call Now',
    noComments: 'No notes provided',
    neverDonated: 'Eligible (No recorded donation)',

    // Availability status
    statusAvailable: 'Available',
    statusUnavailable: 'Unavailable',
    availableNow: 'Available to Donate',
    availableInDays: 'Available in {days} days',
    availableToday: 'Eligible today',

    // Medical Disclaimer
    disclaimerTitle: 'Medical Calculation Disclaimer',
    disclaimerText: 'Availability shown here is based on a 90-day application calculation and does not guarantee medical eligibility. Actual donation eligibility depends on medical screening, donor health, donation type, and applicable medical guidelines.',

    // Awareness Section
    awarenessTitle: 'Blood Donation Awareness',
    awarenessSubtitle: 'Essential medical information, safety guidelines, and the vital impact of voluntary blood donation in Bangladesh.',
    quote1: '“Your blood can give someone another chance at life.”',
    quote2: '“One donation can make a difference.”',
    whyMattersTitle: 'Why Blood Donation Matters',
    whyMattersText: 'Blood cannot be manufactured synthetically; generous voluntary human donors are the sole source for patients requiring surgery, trauma resuscitation, childbirth complications, and chronic illnesses such as Thalassemia and Hemophilia.',
    benefitsTitle: 'Benefits of Voluntary Blood Donation',
    benefitsList: [
      'Stimulates fresh red blood cell production in the donor bone marrow.',
      'Helps maintain healthy iron stores in the body and supports cardiovascular health.',
      'Includes vital baseline health vitals check: blood pressure, pulse, hemoglobin, and temperature.',
      'Provides the immense psychological satisfaction of saving up to three human lives with a single bag of blood.'
    ],
    beforeDonatingTitle: 'Important Things Before Donating',
    beforeDonatingList: [
      'Drink plenty of clean water (at least 500ml) 30-60 minutes prior to donation.',
      'Eat a nutritious, non-fatty meal 2-3 hours before donating. Never donate on an empty stomach.',
      'Get a full night of sound sleep (at least 6-8 hours) before donation day.',
      'Avoid smoking for at least 2 hours and avoid alcohol for at least 24 hours prior.'
    ],
    aftercareTitle: 'After-Donation Care',
    aftercareList: [
      'Rest for 10-15 minutes at the donation center and enjoy fluids/light refreshments provided.',
      'Keep the puncture site bandage dry and secure for at least 4-6 hours.',
      'Drink extra fluids over the next 24-48 hours to quickly replenish blood volume.',
      'Avoid heavy weight lifting, strenuous exercise, and operating heavy machinery for the rest of the day.'
    ],
    basicAwarenessTitle: 'Basic Eligibility Criteria',
    basicAwarenessList: [
      'Age between 18 and 60 years old.',
      'Body weight of at least 48-50 kg (105-110 lbs).',
      'Hemoglobin level of at least 12.5 g/dL.',
      'Minimum of 90 calendar days (3 months) since your last whole blood donation.'
    ],
    consultDoctorTitle: 'Who Should Consult a Medical Professional First?',
    consultDoctorList: [
      'Individuals with a history of heart disease, hypertension, or diabetes on insulin.',
      'Those undergoing treatment for chronic infections, hepatitis, jaundice, or kidney disease.',
      'Individuals taking prescribed blood thinners, antibiotics, or certain regular medications.',
      'Pregnant, lactating, or recently postpartum women.'
    ],

    // Report a Problem
    reportTitle: 'Report a Problem & Contact Developer',
    reportSubtitle: 'Found an issue, have a feature suggestion, or need technical assistance? Reach out directly.',
    devNameLabel: 'Lead Developer',
    devPhoneLabel: 'Direct Phone',
    devEmailLabel: 'Email Address',
    callDeveloper: 'Call Developer',
    emailDeveloper: 'Send Email',
    feedbackPrompt: 'Found a problem or have a suggestion? Contact us and help improve Blood Bank.',
    emergencyNote: 'For emergency donor support, please browse the directory and call available donors directly.',

    // Admin Auth
    adminLoginTitle: 'Administrator Sign In',
    adminLoginSubtitle: 'Secure portal for authorized Blood Bank administrators',
    usernameLabel: 'Admin Username',
    usernamePlaceholder: 'Enter your admin username',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    showPassword: 'Show',
    hidePassword: 'Hide',
    btnLogin: 'Sign In to Dashboard',
    signingIn: 'Authenticating...',
    loginError: 'Invalid username or password. Please verify your credentials.',
    initialPasswordNotice: 'Default initial accounts: admin1 to admin10 with initial password "admin1234". Change upon first login.',
    changePasswordPrompt: 'Security recommendation: Update your initial password below.',

    // Admin Dashboard & Management
    adminDashboardTitle: 'Admin Management Dashboard',
    adminDashboardSubtitle: 'Manage donor records, update last donation dates, and monitor directory availability',
    btnAddDonor: 'Add New Donor',
    btnExportData: 'Export Donors (CSV)',
    settingsTitle: 'Donation Settings',
    donationIntervalLabel: 'Default Donation Interval (Days)',
    intervalHelpText: 'Default standard is 90 calendar days. Recalculates availability dynamically.',
    saveSettings: 'Save Settings',
    settingsSaved: 'Application settings successfully updated.',

    // Add / Edit Donor Modal
    modalAddDonorTitle: 'Add New Blood Donor',
    modalEditDonorTitle: 'Edit Donor Record',
    fullNameLabel: 'Full Name *',
    fullNamePlaceholder: "e.g. Tanvir Ahmed",
    phoneLabel: 'Mobile Number *',
    phonePlaceholder: '01XXXXXXXXX (11-digit BD number)',
    bloodGroupLabel: 'Blood Group *',
    lastDonationDateLabel: 'Last Blood Donation Date *',
    commentsLabel: 'Comments / Notes (Optional)',
    commentsPlaceholder: 'e.g. Willing to donate in Dhaka, emergency calls preferred...',
    isPublicLabel: 'Make visible in public directory',
    btnSaveDonor: 'Save Donor Record',
    btnSaving: 'Saving...',
    btnCancel: 'Cancel',

    // Validation messages
    valNameRequired: 'Full name is required.',
    valPhoneInvalid: 'Please enter a valid 11-digit Bangladeshi mobile number starting with 01 (e.g., 01712345678).',
    valGroupRequired: 'Please select a blood group.',
    valDateRequired: 'Last donation date is required.',
    valDateFuture: 'Last donation date cannot be in the future.',
    valDuplicatePhone: 'A donor with this mobile number already exists in the system.',

    // Delete confirmation
    deleteTitle: 'Confirm Donor Deletion',
    deleteMessage: 'Are you sure you want to delete this donor? This action cannot be undone.',
    btnDeleteConfirm: 'Delete Donor',
    btnDeleteCancel: 'Keep Record',

    // Feedback toasts
    toastDonorAdded: 'Donor record successfully registered!',
    toastDonorUpdated: 'Donor record updated and availability recalculated!',
    toastDonorDeleted: 'Donor record permanently removed.',
    toastPasswordChanged: 'Password successfully updated!',
    toastError: 'An error occurred. Please try again.',

    // Change Password Form
    changePasswordTitle: 'Change Admin Password',
    newPasswordLabel: 'New Password',
    newPasswordPlaceholder: 'Minimum 6 characters',
    confirmPasswordLabel: 'Confirm New Password',
    confirmPasswordPlaceholder: 'Re-enter new password',
    btnChangePassword: 'Update Password',
    passwordMismatch: 'Passwords do not match.',
    passwordTooShort: 'Password must be at least 6 characters.',

    // Footer
    footerTagline: 'Donate Blood, Save Lives. A public humanitarian initiative.',
    footerQuickLinks: 'Quick Links',
    footerContact: 'Developer Contact',
    allRightsReserved: 'All rights reserved.',
    emergencyHelp: 'Emergency Hotline: 999 (Bangladesh)',
  },

  bn: {
    // Brand
    brandName: 'ব্লাড ব্যাংক',
    tagline: 'রক্ত দিন, জীবন বাঁচান।',
    developerCredit: 'ডেভেলপ করেছেন: রাকীন আশহাব',
    devPhone: '০১৯৩৬১০৬৬২১',
    devEmail: 'mohammadrakinashab@gmail.com',

    // Navigation
    navHome: 'হোম',
    navDirectory: 'ডোনার খুঁজুন',
    navBloodGroups: 'রক্তের গ্রুপ',
    navAwareness: 'রক্তদান সচেতনতা',
    navReport: 'সমস্যা জানান',
    navAdmin: 'অ্যাডমিন পোর্টাল',
    navDashboard: 'ড্যাশবোর্ড',
    navSettings: 'সেটিংস',
    navLogout: 'লগআউট',
    navLogin: 'অ্যাডমিন লগইন',

    // Hero Section
    heroHeading: 'রক্ত দিন, জীবন বাঁচান।',
    heroDescription: 'সহজেই রক্তদাতা খুঁজুন, স্বেচ্ছাসেবীদের সাথে যোগাযোগ করুন এবং মানুষের জীবন বাঁচাতে এগিয়ে আসুন। সারাদেশে জরুরি প্রয়োজনে আপনার পাশে।',
    btnFindDonors: 'রক্তদাতা খুঁজুন',
    btnViewDirectory: 'সম্পূর্ণ তালিকা দেখুন',
    btnBeDonor: 'রক্তদাতা হিসেবে যুক্ত হোন',

    // Live Statistics
    statsTitle: 'লাইভ ডোনার পরিসংখ্যান',
    statsSubtitle: '৮টি রক্তের গ্রুপের আসল ডাটাবেজভিত্তিক রিয়েল-টাইম তথ্য',
    totalDonors: 'মোট নিবন্ধিত ডোনার',
    availableDonors: 'রক্তদানে প্রস্তুত ডোনার',
    unavailableDonors: 'অপেক্ষারত ডোনার',
    totalBloodGroups: 'রক্তের গ্রুপের সংখ্যা',
    activeDonorsDescription: 'এখনই রক্ত দিতে প্রস্তুত',
    waitingDonorsDescription: '৯০ দিনের বিরতি পর্যায় চলমান',

    // Blood Group Overview
    bloodGroupOverviewTitle: 'রক্তের গ্রুপ অনুযায়ী ডোনার',
    bloodGroupOverviewSubtitle: 'নির্দিষ্ট গ্রুপের সব ডোনার দেখতে নিচের যেকোনো গ্রুপে ক্লিক করুন',
    donorsCount: 'জন ডোনার',
    availableCount: 'জন প্রস্তুত',

    // Call to Action
    ctaHeading: 'কারও জীবনের আশার আলো হয়ে উঠুন। আজই রক্তদাতা হিসেবে যুক্ত হোন।',
    ctaDescription: 'আপনার এক ব্যাগ রক্ত বাঁচাতে পারে কোনো দুর্ঘটনাগ্রস্ত মানুষ, প্রসূতি মা কিংবা থ্যালাসেমিয়া আক্রান্ত শিশুর জীবন।',
    ctaButton: 'যুক্ত হতে অ্যাডমিনের সাথে যোগাযোগ করুন',

    // Donor Directory
    directoryTitle: 'পাবলিক ডোনার ডিরেক্টরি',
    directorySubtitle: 'জরুরি প্রয়োজনে রক্তদাতা খোঁজার উন্মুক্ত প্ল্যাটফর্ম — স্বয়ংক্রিয় ৯০ দিনের বিরতি হিসাব সহ',
    searchPlaceholder: 'ডোনারের নাম বা ফোন নম্বর দিয়ে খুঁজুন...',
    filterAllGroups: 'সব রক্তের গ্রুপ',
    filterStatusAll: 'সব স্ট্যাটাস',
    filterStatusAvailable: 'শুধুমাত্র রক্তদানে প্রস্তুত',
    filterStatusUnavailable: 'শুধুমাত্র অপেক্ষারত',
    sortBy: 'সাজান',
    sortRecentlyDonated: 'সর্বশেষ রক্তদানের তারিখ',
    sortAvailability: 'প্রস্তুত ডোনার আগে',
    sortName: 'নাম অনুসারে (A-Z)',
    resetFilters: 'ফিল্টার রিসেট',
    resultsFound: 'জন ডোনার পাওয়া গেছে',
    noDonorsFound: 'কোনো ডোনার পাওয়া যায়নি।',
    noDonorsDescription: 'অন্য কোনো রক্তের গ্রুপ নির্বাচন করুন অথবা ফিল্টার পরিবর্তন করে চেষ্টা করুন।',
    viewAsCards: 'কার্ড ভিউ',
    viewAsTable: 'টেবিল ভিউ',

    // Donor Fields
    colName: 'ডোনারের নাম',
    colPhone: 'মোবাইল নম্বর',
    colBloodGroup: 'রক্তের গ্রুপ',
    colLastDonated: 'সর্বশেষ রক্তদানের তারিখ',
    colNextEligible: 'পরবর্তী রক্তদানের সম্ভাব্য তারিখ',
    colStatus: 'বর্তমান স্ট্যাটাস',
    colComments: 'মন্তব্য / ঠিকানা',
    colActions: 'পদক্ষেপ',
    btnCall: 'কল করুন',
    noComments: 'কোনো মন্তব্য নেই',
    neverDonated: 'রক্তদানে প্রস্তুত (পূর্ব রেকর্ড নেই)',

    // Availability status
    statusAvailable: 'রক্তদানে প্রস্তুত',
    statusUnavailable: 'অপেক্ষারত',
    availableNow: 'রক্তদানে প্রস্তুত',
    availableInDays: 'আর {days} দিন পর রক্ত দিতে পারবেন',
    availableToday: 'আজই রক্তদানে প্রস্তুত',

    // Medical Disclaimer
    disclaimerTitle: 'মেডিকেল ও হিসাব সংক্রান্ত সতর্কতা',
    disclaimerText: 'এখানে প্রদর্শিত রক্তদানের সময়সীমা ৯০ দিনের সাধারণ হিসাবের ভিত্তিতে দেখানো হয়। প্রকৃত রক্তদানের উপযুক্ততা ডোনারের শারীরিক অবস্থা ও চিকিৎসকের পরামর্শের ওপর নির্ভরশীল।',

    // Awareness Section
    awarenessTitle: 'রক্তদান সচেতনতা ও নির্দেশিকা',
    awarenessSubtitle: 'স্বেচ্ছায় রক্তদানের স্বাস্থ্যগত উপকারিতা, প্রস্তুতি ও সঠিক নিয়মাবলী জেনে নিন।',
    quote1: '“আপনার রক্ত কারও জীবনে নতুন আশার আলো জ্বালাতে পারে।”',
    quote2: '“রক্তদান একটি মহৎ মানবিক কাজ।”',
    whyMattersTitle: 'রক্তদান কেন এত জরুরি?',
    whyMattersText: 'কৃত্রিমভাবে রক্ত তৈরি করা সম্ভব নয়। দুর্ঘটনা, বড় অপারেশন, প্রসবকালীন জটিলতা এবং থ্যালাসেমিয়া ও ক্যান্সারে আক্রান্ত রোগীদের জীবন বাঁচাতে সুস্থ মানুষের স্বেচ্ছায় রক্তদানই একমাত্র উপায়।',
    benefitsTitle: 'স্বেচ্ছায় রক্তদানের স্বাস্থ্যগত উপকারিতা',
    benefitsList: [
      'অস্থিমজ্জা থেকে নতুন রক্তকণিকা তৈরিতে সাহায্য করে এবং রক্ত সঞ্চালন সচল রাখে।',
      'দেহে অতিরিক্ত আয়রন জমে থাকার ঝুঁকি কমায় এবং হৃদযন্ত্র ভালো রাখে।',
      'রক্তদানের পূর্বে বিনামূল্যে রক্তচাপ, ওজন ও হিমোগ্লোবিন ইত্যাদি পরীক্ষা হয়ে যায়।',
      'একটি মানবিক মহৎ কাজের মাধ্যমে সর্বোচ্চ ৩ জন মানুষের প্রাণ বাঁচানোর আত্মতৃপ্তি পাওয়া যায়।'
    ],
    beforeDonatingTitle: 'রক্তদানের পূর্বে করণীয়',
    benefitsTitleBefore: 'রক্তদানের পূর্বে প্রস্তুতি',
    beforeDonatingList: [
      'রক্তদানের ৩০-৬০ মিনিট আগে পর্যাপ্ত বিশুদ্ধ পানি (কমপক্ষে ৫০০ মিলি) পান করুন।',
      'রক্তদানের ২-৩ ঘণ্টা আগে পুষ্টিকর হালকা খাবার গ্রহণ করুন। খালি পেটে কখনোই রক্ত দেবেন না।',
      'রক্তদানের আগের রাতে কমপক্ষে ৬-৮ ঘণ্টা শান্তভাবে ঘুমান।',
      'রক্তদানের অন্তত ২ ঘণ্টা পূর্বে ধূমপান থেকে সম্পূর্ণ বিরত থাকুন।'
    ],
    aftercareTitle: 'রক্তদানের পরবর্তী যত্ন',
    aftercareList: [
      'রক্ত দেওয়ার পর বিছানায় ১০-১৫ মিনিট বিশ্রাম নিন এবং হালকা নাস্তা ও জুস পান করুন।',
      'সুঁই ফোটানোর জায়গায় লাগানো ব্যান্ডেজ অন্তত ৪-৬ ঘণ্টা শুকনো রাখুন।',
      'পরবর্তী ২৪-৪৮ ঘণ্টায় স্বাভাবিকের চেয়ে বেশি পানি ও তরল জাতীয় খাবার গ্রহণ করুন।',
      'সেদিন ভারী কাজ, জিম বা ভারী ওজন তোলা থেকে বিরত থাকুন।'
    ],
    basicAwarenessTitle: 'রক্তদানের সাধারণ যোগ্যতা',
    basicAwarenessList: [
      'বয়স ১৮ থেকে ৬০ বছরের মধ্যে হতে হবে।',
      'শারীরিক ওজন কমপক্ষে ৫০ কেজি বা তার বেশি হতে হবে।',
      'রক্তে হিমোগ্লোবিনের মাত্রা সঠিক থাকতে হবে (কমপক্ষে ১২.৫ গ্রাম/ডেসিলিটার)।',
      'সর্বশেষ রক্তদানের পর অবশ্যই কমপক্ষে ৯০ দিন (৩ মাস) পূর্ণ হতে হবে।'
    ],
    consultDoctorTitle: 'কাদের চিকিৎসকের পরামর্শ নেওয়া উচিত?',
    consultDoctorList: [
      'যাঁদের হৃদরোগ, অনিয়ন্ত্রিত উচ্চ রক্তচাপ বা ইনসুলিন-নির্ভর ডায়াবেটিস রয়েছে।',
      'দীর্ঘমেয়াদী সংক্রামক ব্যাধি, হেপাটাইটিস কিংবা জন্ডিসের ইতিহাস থাকলে।',
      'যাঁরা অ্যান্টিবায়োটিক বা রক্ত পাতলা করার বিশেষ ওষুধ সেবন করছেন।',
      'গর্ভবতী বা সন্তানকে বুকের দুধ পান করাচ্ছেন এমন মায়েরা।'
    ],

    // Report a Problem
    reportTitle: 'সমস্যা জানান ও যোগাযোগ',
    reportSubtitle: 'কোনো কারিগরি সমস্যা, ভুল তথ্য বা নতুন কোনো পরামর্শ থাকলে সরাসরি যোগাযোগ করুন।',
    devNameLabel: 'সফটওয়্যার ডেভেলপার',
    devPhoneLabel: 'সরাসরি ফোন',
    devEmailLabel: 'ইমেইল ঠিকানা',
    callDeveloper: 'কল করুন',
    emailDeveloper: 'ইমেইল করুন',
    feedbackPrompt: 'কোনো সমস্যা বা পরামর্শ থাকলে আমাদের সাথে যোগাযোগ করুন।',
    emergencyNote: 'জরুরি রক্তের প্রয়োজনে দয়া করে পাবলিক ডিরেক্টরি থেকে সরাসরি উপযুক্ত ডোনারকে কল করুন।',

    // Admin Auth
    adminLoginTitle: 'অ্যাডমিনিস্ট্রেটর লগইন',
    adminLoginSubtitle: 'ব্লাড ব্যাংক পরিচালনার জন্য অনুমোদিত অ্যাডমিন পোর্টাল',
    usernameLabel: 'ইউজারনেম',
    usernamePlaceholder: 'আপনার অ্যাডমিন ইউজারনেম লিখুন',
    passwordLabel: 'পাসওয়ার্ড',
    passwordPlaceholder: 'আপনার পাসওয়ার্ড লিখুন',
    showPassword: 'দেখান',
    hidePassword: 'লুকান',
    btnLogin: 'লগইন করুন',
    signingIn: 'লগইন হচ্ছে...',
    loginError: 'ইউজারনেম বা পাসওয়ার্ড সঠিক নয়। পুনরায় চেষ্টা করুন।',
    initialPasswordNotice: 'প্রাথমিক অ্যাকাউন্ট: admin1 থেকে admin10 পর্যন্ত, প্রাথমিক পাসওয়ার্ড "admin1234"। লগইনের পর পাসওয়ার্ড পরিবর্তন করে নিন।',
    changePasswordPrompt: 'নিরাপত্তার স্বার্থে আপনার প্রাথমিক পাসওয়ার্ড পরিবর্তন করুন।',

    // Admin Dashboard & Management
    adminDashboardTitle: 'অ্যাডমিন ড্যাশবোর্ড ও ব্যবস্থাপনা',
    adminDashboardSubtitle: 'ডোনার তালিকা পরিচালনা, রক্তদানের তারিখ হালনাগাদ ও স্ট্যাটাস পর্যবেক্ষণ',
    btnAddDonor: 'নতুন ডোনার যোগ করুন',
    btnExportData: 'তথ্য ডাউনলোড (CSV)',
    settingsTitle: 'রক্তদানের বিরতি সেটিংস',
    donationIntervalLabel: 'রক্তদানের ব্যবধান (দিন)',
    intervalHelpText: 'প্রাথমিক হিসাব ৯০ দিন। এটি পরিবর্তন করলে স্বয়ংক্রিয়ভাবে সকল স্ট্যাটাস হিসাব হবে।',
    saveSettings: 'সংরক্ষণ করুন',
    settingsSaved: 'সিস্টেম সেটিংস সফলভাবে সংরক্ষিত হয়েছে।',

    // Add / Edit Donor Modal
    modalAddDonorTitle: 'নতুন রক্তদাতার তথ্য যোগ করুন',
    modalEditDonorTitle: 'রক্তদাতার তথ্য সংশোধন করুন',
    fullNameLabel: 'সম্পূর্ণ নাম *',
    fullNamePlaceholder: 'যেমন: তানভীর আহমেদ',
    phoneLabel: 'মোবাইল নম্বর *',
    phonePlaceholder: '০১৭XXXXXXXX (১১ ডিজিটের বাংলাদেশি নম্বর)',
    bloodGroupLabel: 'রক্তের গ্রুপ *',
    lastDonationDateLabel: 'সর্বশেষ রক্তদানের তারিখ *',
    commentsLabel: 'মন্তব্য / এলাকা (ঐচ্ছিক)',
    commentsPlaceholder: 'যেমন: ঢাকা এলাকায় রক্ত দিতে আগ্রহী...',
    isPublicLabel: 'পাবলিক ডিরেক্টরিতে প্রদর্শন করুন',
    btnSaveDonor: 'সংরক্ষণ করুন',
    btnSaving: 'সংরক্ষণ হচ্ছে...',
    btnCancel: 'বাতিল',

    // Validation messages
    valNameRequired: 'নামের ঘর পূরণ করা আবশ্যক।',
    valPhoneInvalid: 'সঠিক ১১ ডিজিটের বাংলাদেশি মোবাইল নম্বর লিখুন (যেমন: 01712345678)।',
    valGroupRequired: 'রক্তের গ্রুপ নির্বাচন করুন।',
    valDateRequired: 'সর্বশেষ রক্তদানের তারিখ প্রদান করুন।',
    valDateFuture: 'ভবিষ্যতের কোনো তারিখ গ্রহণযোগ্য নয়।',
    valDuplicatePhone: 'এই মোবাইল নম্বরটি ইতোমধ্যে একজন ডোনারের জন্য নিবন্ধিত আছে।',

    // Delete confirmation
    deleteTitle: 'ডোনার অপসারণ নিশ্চিতকরণ',
    deleteMessage: 'আপনি কি নিশ্চিতভাবে এই ডোনার রেকর্ডটি মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।',
    btnDeleteConfirm: 'মুছে ফেলুন',
    btnDeleteCancel: 'বাতিল',

    // Feedback toasts
    toastDonorAdded: 'নতুন রক্তদাতার তথ্য সফলভাবে সংরক্ষিত হয়েছে!',
    toastDonorUpdated: 'রক্তদাতার তথ্য ও স্ট্যাটাস সফলভাবে আপডেট করা হয়েছে!',
    toastDonorDeleted: 'ডোনার রেকর্ডটি মুছে ফেলা হয়েছে।',
    toastPasswordChanged: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!',
    toastError: 'একটি ত্রুটি ঘটেছে। দয়া করে পুনরায় চেষ্টা করুন।',

    // Change Password Form
    changePasswordTitle: 'অ্যাডমিন পাসওয়ার্ড পরিবর্তন',
    newPasswordLabel: 'নতুন পাসওয়ার্ড',
    newPasswordPlaceholder: 'কমপক্ষে ৬ ডিজিটের পাসওয়ার্ড দিন',
    confirmPasswordLabel: 'নতুন পাসওয়ার্ড পুনরায় লিখুন',
    confirmPasswordPlaceholder: 'একই পাসওয়ার্ড পুনরায় দিন',
    btnChangePassword: 'পাসওয়ার্ড আপডেট করুন',
    passwordMismatch: 'উভয় পাসওয়ার্ড একই হতে হবে।',
    passwordTooShort: 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।',

    // Footer
    footerTagline: 'রক্ত দিন, জীবন বাঁচান। একটি অলাভজনক মানবিক উদ্যোগ।',
    footerQuickLinks: 'জরুরি লিংক',
    footerContact: 'ডেভেলপারের তথ্য',
    allRightsReserved: 'সর্বস্বত্ব সংরক্ষিত।',
    emergencyHelp: 'জাতীয় জরুরি সেবা: ৯৯৯',
  }
};

export function getTranslation(lang: Language) {
  return translations[lang] || translations.en;
}

export function formatRemainingDays(days: number, lang: Language): string {
  const t = getTranslation(lang);
  if (days <= 0) {
    return t.availableToday;
  }
  const formattedDays = lang === 'bn' ? toBengaliNumerals(days) : String(days);
  return t.availableInDays.replace('{days}', formattedDays);
}
