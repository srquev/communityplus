export interface City {
  id: string;
  name: string;
}

export type PrayerName = 'Fajr' | 'Zuhr' | 'Asr' | 'Maghrib' | 'Isha';

export interface PrayerTiming {
  name: PrayerName;
  time: string; // 24h "HH:mm"
}

export interface PrayerDay {
  hijriDate: string;
  ramadanDay: number;
  sehriEnd: string;
  iftar: string;
  timings: PrayerTiming[];
}

export interface MosqueAnnouncement {
  id: string;
  title: string;
  postedAt: string;
}

export interface Mosque {
  id: string;
  name: string;
  address: string;
  distanceKm: number;
  jummaTime: string;
  isLive: boolean;
  timings: { fajr: string; zuhr: string; asr: string; maghrib: string; isha: string; jumma: string };
  announcements: MosqueAnnouncement[];
}

export interface BusinessCategory {
  id: string;
  label: string;
  icon: string;
}

export interface BusinessReview {
  id: string;
  author: string;
  initials: string;
  rating: number;
  comment: string;
}

export interface Business {
  id: string;
  name: string;
  categoryId: string;
  category: string;
  categoryIcon: string;
  distanceKm: number;
  rating: number;
  reviewCount: number;
  description: string;
  services: string[];
  isOpen: boolean;
  closesAt: string;
  phone: string;
  trending: boolean;
  reviews: BusinessReview[];
}

export interface CommunityNotice {
  id: string;
  title: string;
  body: string;
  postedAt: string;
}

export interface JanazahNotice {
  id: string;
  name: string;
  detail: string;
}

export interface NekiItem {
  id: string;
  title: string;
  distanceKm: number;
}

export interface VolunteerListing {
  id: string;
  name: string;
  initials: string;
  service: string;
  detail: string;
}

export interface DonationCampaign {
  id: string;
  title: string;
  targetAmount: number;
  raisedAmount: number;
}

export interface QuizCategory {
  id: string;
  label: string;
  icon: string;
}

export interface QuizQuestion {
  id: string;
  categoryId: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface Achievement {
  id: string;
  label: string;
  icon: string;
  earned: boolean;
}

export interface UserProfile {
  name: string;
  initials: string;
  city: string;
  memberSince: number;
  streak: number;
  donatedTotal: number;
  badgeCount: number;
}
