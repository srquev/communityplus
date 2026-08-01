// Dummy data standing in for API responses. Every service below reads from
// here, so swapping to a real backend later means changing the service
// implementations only — no template or component changes required.
import {
  Achievement, Business, BusinessCategory, City, CommunityNotice, DonationCampaign,
  JanazahNotice, Mosque, NekiItem, PrayerDay, QuizCategory, QuizQuestion, UserProfile,
  VolunteerListing,
} from '../models';

export const CITIES: City[] = [
  { id: 'lucknow', name: 'Lucknow' },
  { id: 'delhi', name: 'Delhi' },
  { id: 'hyderabad', name: 'Hyderabad' },
];

export const PRAYER_DAY: PrayerDay = {
  hijriDate: '12 Muharram 1448',
  ramadanDay: 12,
  sehriEnd: '04:42',
  iftar: '18:32',
  timings: [
    { name: 'Fajr', time: '04:52' },
    { name: 'Zuhr', time: '13:04' },
    { name: 'Asr', time: '16:29' },
    { name: 'Maghrib', time: '18:32' },
    { name: 'Isha', time: '20:14' },
  ],
};

export const MOSQUES: Mosque[] = [
  {
    id: 'noor', name: 'Masjid-e-Noor', address: 'Aminabad Road', distanceKm: 0.4,
    jummaTime: '13:15', isLive: false,
    timings: { fajr: '04:52', zuhr: '13:04', asr: '16:29', maghrib: '18:32', isha: '20:14', jumma: '13:15' },
    announcements: [
      { id: 'a1', title: 'Taraweeh progress: Para 18 of 30', postedAt: 'Yesterday' },
      { id: 'a2', title: 'Iftar sponsorship open for Friday', postedAt: '2 days ago' },
    ],
  },
  {
    id: 'central', name: 'Central Jama Masjid', address: 'Chowk', distanceKm: 0.9,
    jummaTime: '13:00', isLive: true,
    timings: { fajr: '04:50', zuhr: '13:00', asr: '16:25', maghrib: '18:32', isha: '20:10', jumma: '13:00' },
    announcements: [{ id: 'a3', title: 'Taraweeh streamed live tonight', postedAt: '5h ago' }],
  },
  {
    id: 'rahmania', name: 'Rahmania Masjid', address: 'Hazratganj', distanceKm: 1.3,
    jummaTime: '13:20', isLive: false,
    timings: { fajr: '04:53', zuhr: '13:05', asr: '16:30', maghrib: '18:33', isha: '20:15', jumma: '13:20' },
    announcements: [],
  },
  {
    id: 'ikram', name: 'Baitul Ikram', address: 'Alambagh', distanceKm: 1.8,
    jummaTime: '13:10', isLive: false,
    timings: { fajr: '04:51', zuhr: '13:03', asr: '16:28', maghrib: '18:31', isha: '20:13', jumma: '13:10' },
    announcements: [],
  },
  {
    id: 'askari', name: 'Askari Masjid', address: 'Cantt Road', distanceKm: 2.2,
    jummaTime: '13:15', isLive: false,
    timings: { fajr: '04:52', zuhr: '13:04', asr: '16:29', maghrib: '18:32', isha: '20:14', jumma: '13:15' },
    announcements: [],
  },
];

export const BUSINESS_CATEGORIES: BusinessCategory[] = [
  { id: 'all', label: 'All', icon: 'store' },
  { id: 'medical', label: 'Medical', icon: 'pill' },
  { id: 'grooming', label: 'Grooming', icon: 'scissors' },
  { id: 'cabs', label: 'Cabs', icon: 'car' },
  { id: 'tailors', label: 'Tailors', icon: 'shirt' },
  { id: 'electronics', label: 'Electronics', icon: 'plug' },
  { id: 'travel', label: 'Travel', icon: 'plane' },
  { id: 'parking', label: 'Parking', icon: 'parking' },
];

export const BUSINESSES: Business[] = [
  {
    id: 'al-amin-tailors', name: 'Al-Amin Tailors', categoryId: 'tailors', category: 'Tailoring',
    categoryIcon: 'shirt', distanceKm: 0.4, rating: 4.8, reviewCount: 126,
    description: 'Custom stitching, alterations and embroidery. Serving the neighbourhood for 15 years. Same-day alterations available.',
    services: ['Stitching', 'Alterations', 'Embroidery', 'Uniforms'], isOpen: true, closesAt: '21:00',
    phone: '+91 98765 43210', trending: true,
    reviews: [
      { id: 'r1', author: 'Rukhsar K.', initials: 'RK', rating: 5, comment: 'Fast turnaround and great finishing on my kurta alterations.' },
      { id: 'r2', author: 'Imran H.', initials: 'IH', rating: 5, comment: 'Best tailor in the area, very reasonable pricing.' },
    ],
  },
  {
    id: 'sultans-barber', name: "Sultan's Barber", categoryId: 'grooming', category: 'Grooming',
    categoryIcon: 'scissors', distanceKm: 0.7, rating: 4.6, reviewCount: 84,
    description: 'Walk-in friendly barber shop, known for classic fades and beard grooming.',
    services: ['Haircut', 'Beard trim', 'Kids cuts'], isOpen: true, closesAt: '22:00',
    phone: '+91 98765 11122', trending: false,
    reviews: [{ id: 'r3', author: 'Yusuf S.', initials: 'YS', rating: 4, comment: 'Good service, a bit of a wait on weekends.' }],
  },
  {
    id: 'city-care-pharmacy', name: 'City Care Pharmacy', categoryId: 'medical', category: 'Medical store',
    categoryIcon: 'pill', distanceKm: 1.1, rating: 4.9, reviewCount: 203,
    description: '24-hour pharmacy stocking prescription and OTC medicines, with home delivery.',
    services: ['Prescriptions', 'Home delivery', '24-hour'], isOpen: true, closesAt: '23:59',
    phone: '+91 98765 33445', trending: false,
    reviews: [{ id: 'r4', author: 'Fatima N.', initials: 'FN', rating: 5, comment: 'Delivered medicine within 20 minutes, very reliable.' }],
  },
  {
    id: 'quickride-cabs', name: 'QuickRide Cabs', categoryId: 'cabs', category: 'Transport',
    categoryIcon: 'car', distanceKm: 0.9, rating: 4.5, reviewCount: 61,
    description: 'Local cab service for airport runs and city travel, fixed fares.',
    services: ['Airport transfer', 'City rides', 'Outstation'], isOpen: true, closesAt: '23:00',
    phone: '+91 98765 55667', trending: false,
    reviews: [],
  },
  {
    id: 'station-road-parking', name: 'Station Road Parking', categoryId: 'parking', category: 'Parking',
    categoryIcon: 'parking', distanceKm: 1.4, rating: 4.3, reviewCount: 39,
    description: 'Covered parking near the railway station, hourly and monthly passes.',
    services: ['Hourly parking', 'Monthly pass', 'CCTV monitored'], isOpen: true, closesAt: '23:59',
    phone: '+91 98765 77889', trending: false,
    reviews: [],
  },
  {
    id: 'noor-travels', name: 'Noor Travels', categoryId: 'travel', category: 'Travel agency',
    categoryIcon: 'plane', distanceKm: 1.6, rating: 4.7, reviewCount: 58,
    description: 'Umrah and Hajj packages, domestic and international ticketing.',
    services: ['Umrah packages', 'Visa assistance', 'Ticketing'], isOpen: false, closesAt: '19:00',
    phone: '+91 98765 99001', trending: true,
    reviews: [],
  },
];

export const COMMUNITY_NEWS: CommunityNotice[] = [
  { id: 'n1', title: 'Jumma khutbah shifted to 1:15 PM', body: 'Masjid-e-Noor has adjusted this week\u2019s khutbah timing.', postedAt: '2h ago' },
  { id: 'n2', title: 'Taraweeh streamed live tonight', body: 'Central Jama Masjid is livestreaming tonight\u2019s Taraweeh.', postedAt: '5h ago' },
];

export const JANAZAH_NOTICES: JanazahNotice[] = [
  { id: 'j1', name: 'Abdul Rahman S.', detail: 'Namaz-e-Janazah after Asr, Masjid-e-Noor' },
];

export const NEKI_ITEMS: NekiItem[] = [
  { id: 'k1', title: 'Winter jackets (4)', distanceKm: 0.5 },
  { id: 'k2', title: 'School books', distanceKm: 0.8 },
  { id: 'k3', title: 'Study table', distanceKm: 1.2 },
];

export const VOLUNTEERS: VolunteerListing[] = [
  { id: 'v1', name: 'Yusuf S.', initials: 'YS', service: 'Free tutoring', detail: 'Maths & Science, evenings' },
  { id: 'v2', name: 'Fatima N.', initials: 'FN', service: 'Janazah help', detail: 'Ghusl assistance, on call' },
];

export const DONATION_CAMPAIGNS: DonationCampaign[] = [
  { id: 'd1', title: 'Hafiz teacher stipend fund', targetAmount: 100000, raisedAmount: 68000 },
  { id: 'd2', title: 'Ramadan Iftar sponsorship', targetAmount: 50000, raisedAmount: 21000 },
];

export const QUIZ_CATEGORIES: QuizCategory[] = [
  { id: 'seerah', label: 'Seerah', icon: 'moon' },
  { id: 'quran', label: 'Quran', icon: 'book' },
  { id: 'fiqh', label: 'Fiqh', icon: 'star' },
  { id: 'history', label: 'History', icon: 'calendar' },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1', categoryId: 'seerah',
    question: 'In which year did the migration (Hijrah) to Madinah take place?',
    options: ['620 CE', '622 CE', '610 CE'], correctIndex: 1,
  },
  {
    id: 'q2', categoryId: 'quran',
    question: 'How many chapters (Surahs) are in the Quran?',
    options: ['100', '114', '120'], correctIndex: 1,
  },
];

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'ach1', label: '7-day streak', icon: 'trophy', earned: true },
  { id: 'ach2', label: '50 correct', icon: 'star', earned: true },
  { id: 'ach3', label: 'Quran pro', icon: 'book', earned: false },
  { id: 'ach4', label: 'Top 10', icon: 'trophy', earned: false },
];

export const USER_PROFILE: UserProfile = {
  name: 'Ahmed Khan', initials: 'AK', city: 'Lucknow', memberSince: 2024,
  streak: 7, donatedTotal: 2400, badgeCount: 3,
};
