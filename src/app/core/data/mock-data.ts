// Dummy data standing in for API responses. Every service below reads from
// here, so swapping to a real backend later means changing the service
// implementations only — no template or component changes required.
import {
  Achievement, Business, BusinessCategory, City, CityPrayerSchedule, CommunityNotice, DonationCampaign,
  JanazahNotice, Mosque, NekiItem, PrayerDay, QuizCategory, QuizQuestion, UserProfile,
  VolunteerListing,
} from '../models';

export const CITIES: City[] = [
  { id: 'mau', name: 'Mau' },
  { id: 'lucknow', name: 'Lucknow' },
  { id: 'kanpur', name: 'Kanpur' },
  { id: 'agra', name: 'Agra' },
  { id: 'varanasi', name: 'Varanasi' },
  { id: 'prayagraj', name: 'Prayagraj' },
  { id: 'meerut', name: 'Meerut' },
  { id: 'bareilly', name: 'Bareilly' },
  { id: 'aligarh', name: 'Aligarh' },
  { id: 'moradabad', name: 'Moradabad' },
  { id: 'gorakhpur', name: 'Gorakhpur' },
];

export const CITY_PRAYER_DATA: CityPrayerSchedule[] = [
  {
    id: 'mau',
    name: 'Mau',
    hijriDate: '12 Muharram 1448',
    ramadanDay: 12,
    sehriEnd: '04:30',
    iftar: '18:15',
    timings: [
      { name: 'Fajr', time: '05:30' },
      { name: 'Zuhr', time: '13:15' },
      { name: 'Asr', time: '17:00' },
      { name: 'Maghrib', time: '18:15' },
      { name: 'Isha', time: '20:30' },
    ],
    masjids: [
      {
        id: 'masjid-ammar',
        name: 'Masjid Ammar',
        address: 'Ghasi Pura, Mau',
        namazTimes: [
          { name: 'Fajr', time: '05:30' },
          { name: 'Zuhr', time: '13:15' },
          { name: 'Asr', time: '17:00' },
          { name: 'Maghrib', time: '18:15' },
          { name: 'Isha', time: '20:30' },
        ],
      },
      {
        id: 'jama-masjid-mau',
        name: 'Jama Masjid',
        address: 'House No. 93/1, Pahar Pura, Mau',
        namazTimes: [
          { name: 'Fajr', time: '04:00' },
          { name: 'Zuhr', time: '13:30' },
          { name: 'Asr', time: '16:45' },
          { name: 'Maghrib', time: '18:15' },
          { name: 'Isha', time: '20:30' },
        ],
      },
    ],
  },
  {
    id: 'lucknow',
    name: 'Lucknow',
    hijriDate: '12 Muharram 1448',
    ramadanDay: 12,
    sehriEnd: '04:42',
    iftar: '18:32',
    timings: [
      { name: 'Fajr', time: '04:48' },
      { name: 'Zuhr', time: '12:39' },
      { name: 'Asr', time: '16:35' },
      { name: 'Maghrib', time: '18:47' },
      { name: 'Isha', time: '20:08' },
    ],
    masjids: [
      {
        id: 'madina-masjid-lucknow',
        name: 'Madina Masjid Lucknow',
        address: '12, Masjid Road, Lucknow',
        namazTimes: [
          { name: 'Fajr', time: '04:58' },
          { name: 'Zuhr', time: '12:44' },
          { name: 'Asr', time: '16:34' },
          { name: 'Maghrib', time: '18:34' },
          { name: 'Isha', time: '20:05' },
        ],
      },
      {
        id: 'noor-masjid-lucknow',
        name: 'Noor Masjid Lucknow',
        address: '11, Masjid Road, Lucknow',
        namazTimes: [
          { name: 'Fajr', time: '04:48' },
          { name: 'Zuhr', time: '12:39' },
          { name: 'Asr', time: '16:35' },
          { name: 'Maghrib', time: '18:47' },
          { name: 'Isha', time: '20:08' },
        ],
      },
    ],
  },
  {
    id: 'kanpur',
    name: 'Kanpur',
    hijriDate: '12 Muharram 1448',
    ramadanDay: 12,
    sehriEnd: '04:47',
    iftar: '18:30',
    timings: [
      { name: 'Fajr', time: '04:47' },
      { name: 'Zuhr', time: '12:36' },
      { name: 'Asr', time: '16:43' },
      { name: 'Maghrib', time: '18:30' },
      { name: 'Isha', time: '20:11' },
    ],
    masjids: [
      {
        id: 'madina-masjid-kanpur',
        name: 'Madina Masjid Kanpur',
        address: '12, Masjid Road, Kanpur',
        namazTimes: [
          { name: 'Fajr', time: '04:47' },
          { name: 'Zuhr', time: '12:36' },
          { name: 'Asr', time: '16:43' },
          { name: 'Maghrib', time: '18:30' },
          { name: 'Isha', time: '20:11' },
        ],
      },
      {
        id: 'jama-masjid-kanpur',
        name: 'Jama Masjid Kanpur',
        address: '10, Masjid Road, Kanpur',
        namazTimes: [
          { name: 'Fajr', time: '05:03' },
          { name: 'Zuhr', time: '12:37' },
          { name: 'Asr', time: '16:36' },
          { name: 'Maghrib', time: '18:41' },
          { name: 'Isha', time: '20:08' },
        ],
      },
    ],
  },
  {
    id: 'agra',
    name: 'Agra',
    hijriDate: '12 Muharram 1448',
    ramadanDay: 12,
    sehriEnd: '04:50',
    iftar: '18:37',
    timings: [
      { name: 'Fajr', time: '04:50' },
      { name: 'Zuhr', time: '12:48' },
      { name: 'Asr', time: '16:31' },
      { name: 'Maghrib', time: '18:37' },
      { name: 'Isha', time: '20:06' },
    ],
    masjids: [
      {
        id: 'madina-masjid-agra',
        name: 'Madina Masjid Agra',
        address: '12, Masjid Road, Agra',
        namazTimes: [
          { name: 'Fajr', time: '04:50' },
          { name: 'Zuhr', time: '12:48' },
          { name: 'Asr', time: '16:31' },
          { name: 'Maghrib', time: '18:37' },
          { name: 'Isha', time: '20:06' },
        ],
      },
      {
        id: 'jama-masjid-agra',
        name: 'Jama Masjid Agra',
        address: '10, Masjid Road, Agra',
        namazTimes: [
          { name: 'Fajr', time: '05:01' },
          { name: 'Zuhr', time: '12:43' },
          { name: 'Asr', time: '16:45' },
          { name: 'Maghrib', time: '18:33' },
          { name: 'Isha', time: '20:14' },
        ],
      },
    ],
  },
  {
    id: 'varanasi',
    name: 'Varanasi',
    hijriDate: '12 Muharram 1448',
    ramadanDay: 12,
    sehriEnd: '04:45',
    iftar: '18:39',
    timings: [
      { name: 'Fajr', time: '04:51' },
      { name: 'Zuhr', time: '12:49' },
      { name: 'Asr', time: '16:37' },
      { name: 'Maghrib', time: '18:39' },
      { name: 'Isha', time: '20:00' },
    ],
    masjids: [
      {
        id: 'madina-masjid-varanasi',
        name: 'Madina Masjid Varanasi',
        address: '12, Masjid Road, Varanasi',
        namazTimes: [
          { name: 'Fajr', time: '04:51' },
          { name: 'Zuhr', time: '12:49' },
          { name: 'Asr', time: '16:37' },
          { name: 'Maghrib', time: '18:39' },
          { name: 'Isha', time: '20:00' },
        ],
      },
      {
        id: 'jama-masjid-varanasi',
        name: 'Jama Masjid Varanasi',
        address: '10, Masjid Road, Varanasi',
        namazTimes: [
          { name: 'Fajr', time: '04:45' },
          { name: 'Zuhr', time: '12:44' },
          { name: 'Asr', time: '16:50' },
          { name: 'Maghrib', time: '18:33' },
          { name: 'Isha', time: '20:13' },
        ],
      },
    ],
  },
  {
    id: 'prayagraj',
    name: 'Prayagraj',
    hijriDate: '12 Muharram 1448',
    ramadanDay: 12,
    sehriEnd: '04:47',
    iftar: '18:40',
    timings: [
      { name: 'Fajr', time: '04:47' },
      { name: 'Zuhr', time: '12:48' },
      { name: 'Asr', time: '16:32' },
      { name: 'Maghrib', time: '18:40' },
      { name: 'Isha', time: '20:14' },
    ],
    masjids: [
      {
        id: 'madina-masjid-prayagraj',
        name: 'Madina Masjid Prayagraj',
        address: '12, Masjid Road, Prayagraj',
        namazTimes: [
          { name: 'Fajr', time: '04:47' },
          { name: 'Zuhr', time: '12:48' },
          { name: 'Asr', time: '16:32' },
          { name: 'Maghrib', time: '18:40' },
          { name: 'Isha', time: '20:14' },
        ],
      },
      {
        id: 'jama-masjid-prayagraj',
        name: 'Jama Masjid Prayagraj',
        address: '10, Masjid Road, Prayagraj',
        namazTimes: [
          { name: 'Fajr', time: '04:55' },
          { name: 'Zuhr', time: '12:45' },
          { name: 'Asr', time: '16:50' },
          { name: 'Maghrib', time: '18:46' },
          { name: 'Isha', time: '20:20' },
        ],
      },
    ],
  },
  {
    id: 'meerut',
    name: 'Meerut',
    hijriDate: '12 Muharram 1448',
    ramadanDay: 12,
    sehriEnd: '04:49',
    iftar: '18:30',
    timings: [
      { name: 'Fajr', time: '04:49' },
      { name: 'Zuhr', time: '12:38' },
      { name: 'Asr', time: '16:39' },
      { name: 'Maghrib', time: '18:30' },
      { name: 'Isha', time: '20:16' },
    ],
    masjids: [
      {
        id: 'madina-masjid-meerut',
        name: 'Madina Masjid Meerut',
        address: '12, Masjid Road, Meerut',
        namazTimes: [
          { name: 'Fajr', time: '04:59' },
          { name: 'Zuhr', time: '12:44' },
          { name: 'Asr', time: '16:42' },
          { name: 'Maghrib', time: '18:30' },
          { name: 'Isha', time: '20:18' },
        ],
      },
      {
        id: 'jama-masjid-meerut',
        name: 'Jama Masjid Meerut',
        address: '10, Masjid Road, Meerut',
        namazTimes: [
          { name: 'Fajr', time: '05:02' },
          { name: 'Zuhr', time: '12:37' },
          { name: 'Asr', time: '16:33' },
          { name: 'Maghrib', time: '18:48' },
          { name: 'Isha', time: '20:12' },
        ],
      },
    ],
  },
  {
    id: 'bareilly',
    name: 'Bareilly',
    hijriDate: '12 Muharram 1448',
    ramadanDay: 12,
    sehriEnd: '04:54',
    iftar: '18:32',
    timings: [
      { name: 'Fajr', time: '04:54' },
      { name: 'Zuhr', time: '12:31' },
      { name: 'Asr', time: '16:32' },
      { name: 'Maghrib', time: '18:32' },
      { name: 'Isha', time: '20:00' },
    ],
    masjids: [
      {
        id: 'madina-masjid-bareilly',
        name: 'Madina Masjid Bareilly',
        address: '12, Masjid Road, Bareilly',
        namazTimes: [
          { name: 'Fajr', time: '05:02' },
          { name: 'Zuhr', time: '12:32' },
          { name: 'Asr', time: '16:43' },
          { name: 'Maghrib', time: '18:32' },
          { name: 'Isha', time: '20:00' },
        ],
      },
      {
        id: 'jama-masjid-bareilly',
        name: 'Jama Masjid Bareilly',
        address: '10, Masjid Road, Bareilly',
        namazTimes: [
          { name: 'Fajr', time: '04:55' },
          { name: 'Zuhr', time: '12:34' },
          { name: 'Asr', time: '16:40' },
          { name: 'Maghrib', time: '18:45' },
          { name: 'Isha', time: '20:12' },
        ],
      },
    ],
  },
  {
    id: 'aligarh',
    name: 'Aligarh',
    hijriDate: '12 Muharram 1448',
    ramadanDay: 12,
    sehriEnd: '04:49',
    iftar: '18:40',
    timings: [
      { name: 'Fajr', time: '04:49' },
      { name: 'Zuhr', time: '12:50' },
      { name: 'Asr', time: '16:49' },
      { name: 'Maghrib', time: '18:50' },
      { name: 'Isha', time: '20:01' },
    ],
    masjids: [
      {
        id: 'madina-masjid-aligarh',
        name: 'Madina Masjid Aligarh',
        address: '12, Masjid Road, Aligarh',
        namazTimes: [
          { name: 'Fajr', time: '04:59' },
          { name: 'Zuhr', time: '12:45' },
          { name: 'Asr', time: '16:43' },
          { name: 'Maghrib', time: '18:40' },
          { name: 'Isha', time: '20:07' },
        ],
      },
      {
        id: 'jama-masjid-aligarh',
        name: 'Jama Masjid Aligarh',
        address: '10, Masjid Road, Aligarh',
        namazTimes: [
          { name: 'Fajr', time: '05:04' },
          { name: 'Zuhr', time: '12:31' },
          { name: 'Asr', time: '16:39' },
          { name: 'Maghrib', time: '18:31' },
          { name: 'Isha', time: '20:09' },
        ],
      },
    ],
  },
  {
    id: 'moradabad',
    name: 'Moradabad',
    hijriDate: '12 Muharram 1448',
    ramadanDay: 12,
    sehriEnd: '04:47',
    iftar: '18:36',
    timings: [
      { name: 'Fajr', time: '04:47' },
      { name: 'Zuhr', time: '12:33' },
      { name: 'Asr', time: '16:35' },
      { name: 'Maghrib', time: '18:36' },
      { name: 'Isha', time: '20:04' },
    ],
    masjids: [
      {
        id: 'madina-masjid-moradabad',
        name: 'Madina Masjid Moradabad',
        address: '12, Masjid Road, Moradabad',
        namazTimes: [
          { name: 'Fajr', time: '04:47' },
          { name: 'Zuhr', time: '12:47' },
          { name: 'Asr', time: '16:44' },
          { name: 'Maghrib', time: '18:36' },
          { name: 'Isha', time: '20:14' },
        ],
      },
      {
        id: 'jama-masjid-moradabad',
        name: 'Jama Masjid Moradabad',
        address: '10, Masjid Road, Moradabad',
        namazTimes: [
          { name: 'Fajr', time: '04:58' },
          { name: 'Zuhr', time: '12:39' },
          { name: 'Asr', time: '16:32' },
          { name: 'Maghrib', time: '18:36' },
          { name: 'Isha', time: '20:15' },
        ],
      },
    ],
  },
  {
    id: 'gorakhpur',
    name: 'Gorakhpur',
    hijriDate: '12 Muharram 1448',
    ramadanDay: 12,
    sehriEnd: '04:45',
    iftar: '18:38',
    timings: [
      { name: 'Fajr', time: '04:45' },
      { name: 'Zuhr', time: '12:31' },
      { name: 'Asr', time: '16:38' },
      { name: 'Maghrib', time: '18:38' },
      { name: 'Isha', time: '20:18' },
    ],
    masjids: [
      {
        id: 'madina-masjid-gorakhpur',
        name: 'Madina Masjid Gorakhpur',
        address: '12, Masjid Road, Gorakhpur',
        namazTimes: [
          { name: 'Fajr', time: '04:57' },
          { name: 'Zuhr', time: '12:39' },
          { name: 'Asr', time: '16:44' },
          { name: 'Maghrib', time: '18:41' },
          { name: 'Isha', time: '20:19' },
        ],
      },
      {
        id: 'jama-masjid-gorakhpur',
        name: 'Jama Masjid Gorakhpur',
        address: '10, Masjid Road, Gorakhpur',
        namazTimes: [
          { name: 'Fajr', time: '04:55' },
          { name: 'Zuhr', time: '12:30' },
          { name: 'Asr', time: '16:30' },
          { name: 'Maghrib', time: '18:47' },
          { name: 'Isha', time: '20:15' },
        ],
      },
    ],
  },
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
