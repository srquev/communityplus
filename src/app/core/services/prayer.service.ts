import { Injectable, computed, inject, signal } from '@angular/core';
import { CITY_PRAYER_DATA } from '../data/mock-data';
import { CityPrayerSchedule, PrayerDay, PrayerTiming } from '../models';
import { UserService } from './user.service';

export type SkyBand = 'fajr' | 'zuhr' | 'asr' | 'maghrib' | 'isha';

interface CalendarDay {
  date: string;
  englishDay: string;
  day: string;
  month: string;
  monthNumber: number;
  year: string;
  isToday: boolean;
}

interface HijriDate {
  day: number;
  month: number;
  year: number;
}

const HIJRI_MONTHS = [
  '',
  'Muharram',
  'Safar',
  'Rabi al-awwal',
  'Rabi al-thani',
  'Jumada al-awwal',
  'Jumada al-thani',
  'Rajab',
  'Shaaban',
  'Ramadan',
  'Shawwal',
  'Dhu al-Qadah',
  'Dhu al-Hijjah',
];

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

@Injectable({ providedIn: 'root' })
export class PrayerService {
  private readonly user = inject(UserService);
  private readonly schedules = signal<CityPrayerSchedule[]>(CITY_PRAYER_DATA);
  private readonly calendarMonthValue = signal(this.startOfMonth(new Date()));
  private readonly now = signal(new Date());

  constructor() {
    setInterval(() => this.now.set(new Date()), 1000);
  }

  readonly day = computed<PrayerDay>(() => {
    const selectedCity = this.user.selectedCityId();
    const schedule = this.schedules().find((item) => item.id === selectedCity) ?? this.schedules()[0];
    return {
      hijriDate: schedule.hijriDate,
      ramadanDay: schedule.ramadanDay,
      sehriEnd: schedule.sehriEnd,
      iftar: schedule.iftar,
      timings: schedule.timings,
    };
  });

  readonly timings = computed(() => this.day().timings);
  readonly hijriDate = computed(() => this.day().hijriDate);
  readonly ramadanDay = computed(() => this.day().ramadanDay);
  readonly sehriEnd = computed(() => this.day().sehriEnd);
  readonly iftar = computed(() => this.day().iftar);
  readonly selectedSchedule = computed(() => this.schedules().find((item) => item.id === this.user.selectedCityId()) ?? this.schedules()[0]);
  readonly calendar = computed(() => this.buildCalendar(this.calendarMonthValue()));
  readonly calendarMonth = computed(() => this.calendarMonthValue());

  changeCalendarMonth(offset: number): void {
    const month = this.calendarMonthValue();
    this.calendarMonthValue.set(new Date(month.getFullYear(), month.getMonth() + offset, 1));
  }

  resetCalendarMonth(): void {
    this.calendarMonthValue.set(this.startOfMonth(new Date()));
  }

  readonly nextPrayer = computed<PrayerTiming>(() => {
    const now = this.currentSeconds();
    const upcoming = this.day().timings.find((t) => toMinutes(t.time) * 60 > now);
    return upcoming ?? this.day().timings[0];
  });

  readonly activePrayer = computed<PrayerTiming>(() => {
    const now = this.currentSeconds();
    const timings = this.day().timings;
    let active = timings[0];
    for (const t of timings) {
      if (toMinutes(t.time) * 60 <= now) active = t;
    }
    return active;
  });

  readonly secondsToNext = computed(() => {
    const diff = toMinutes(this.nextPrayer().time) * 60 - this.currentSeconds();
    return diff >= 0 ? diff : diff + 24 * 60 * 60;
  });

  readonly countdownToNext = computed(() => this.formatCountdown(this.secondsToNext()));

  readonly skyBand = computed<SkyBand>(() => {
    switch (this.activePrayer().name) {
      case 'Fajr': return 'fajr';
      case 'Zuhr': return 'zuhr';
      case 'Asr': return 'asr';
      case 'Maghrib': return 'maghrib';
      default: return 'isha';
    }
  });

  readonly dayProgressPercent = computed(() => {
    const timings = this.day().timings;
    const start = toMinutes(timings[0].time);
    const end = toMinutes(timings[timings.length - 1].time);
    const now = this.currentSeconds() / 60;
    if (now <= start) return 0;
    if (now >= end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  });

  formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  getMapUrl(address: string): string {
    return `https://www.openstreetmap.org/search?query=${encodeURIComponent(address)}`;
  }

  private buildCalendar(monthDate: Date): CalendarDay[] {
    const today = new Date();
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, index) => {
      const englishDay = index + 1;
      const date = new Date(year, month, englishDay);
      const hijri = this.toHijri(date);
      const isToday = englishDay === today.getDate() && month === today.getMonth() && year === today.getFullYear();

      return {
        date: `${String(englishDay).padStart(2, '0')}-${String(month + 1).padStart(2, '0')}-${year}`,
        englishDay: String(englishDay),
        day: String(hijri.day),
        month: HIJRI_MONTHS[hijri.month] ?? 'Islamic month',
        monthNumber: hijri.month,
        year: String(hijri.year),
        isToday,
      };
    });
  }

  private toHijri(date: Date): HijriDate {
    const jd = this.toJulianDay(date);
    let l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    l = l - 10631 * n + 354;
    const j = Math.floor((10985 - l) / 5316) * Math.floor((50 * l) / 17719)
      + Math.floor(l / 5670) * Math.floor((43 * l) / 15238);
    l = l - Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50)
      - Math.floor(j / 16) * Math.floor((15238 * j) / 43) + 29;
    const month = Math.floor((24 * l) / 709);
    const day = l - Math.floor((709 * month) / 24);
    const year = 30 * n + j - 30;

    return { day, month, year };
  }

  private toJulianDay(date: Date): number {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const a = Math.floor((14 - month) / 12);
    const adjustedYear = year + 4800 - a;
    const adjustedMonth = month + 12 * a - 3;

    return day
      + Math.floor((153 * adjustedMonth + 2) / 5)
      + 365 * adjustedYear
      + Math.floor(adjustedYear / 4)
      - Math.floor(adjustedYear / 100)
      + Math.floor(adjustedYear / 400)
      - 32045;
  }

  private currentSeconds(): number {
    const now = this.now();
    return now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds();
  }

  private startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private formatCountdown(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':');
  }
}
