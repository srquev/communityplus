import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { CITY_PRAYER_DATA } from '../data/mock-data';
import { CityPrayerSchedule, PrayerDay, PrayerTiming } from '../models';
import { UserService } from './user.service';

export type SkyBand = 'fajr' | 'zuhr' | 'asr' | 'maghrib' | 'isha';

interface AladhanResponse {
  data?: {
    timings?: Record<string, string>;
    date?: {
      hijri?: {
        day?: number;
        month?: { en?: string };
        year?: number;
      };
    };
  };
}

interface AladhanCalendarResponse {
  code?: number;
  data?: Array<{
    gregorian?: { date?: string };
    hijri?: {
      day?: string;
      month?: { number?: number; en?: string; ar?: string };
      year?: string;
    };
  }>;
}

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

@Injectable({ providedIn: 'root' })
export class PrayerService {
  private readonly http = inject(HttpClient);
  private readonly user = inject(UserService);
  private readonly schedules = signal<CityPrayerSchedule[]>(CITY_PRAYER_DATA);
  private readonly liveMonth = signal<string>('');
  private readonly liveTimings = signal<PrayerTiming[] | null>(null);
  private readonly calendarDays = signal<Array<{ date: string; day: string; month: string; year: string; isCurrentMonth: boolean }>>([]);
  private readonly nowMinutes = signal<number>(this.currentMinutes());

  constructor() {
    effect(() => {
      this.user.selectedCityId();
      this.refreshForSelectedCity();
    });
  }

  readonly day = computed<PrayerDay>(() => {
    const selectedCity = this.user.selectedCityId();
    const schedule = this.schedules().find((item) => item.id === selectedCity) ?? this.schedules()[0];
    return {
      hijriDate: this.liveMonth() || schedule.hijriDate,
      ramadanDay: schedule.ramadanDay,
      sehriEnd: schedule.sehriEnd,
      iftar: schedule.iftar,
      timings: this.liveTimings() ?? schedule.timings,
    };
  });

  readonly timings = computed(() => this.day().timings);
  readonly hijriDate = computed(() => this.day().hijriDate);
  readonly ramadanDay = computed(() => this.day().ramadanDay);
  readonly sehriEnd = computed(() => this.day().sehriEnd);
  readonly iftar = computed(() => this.day().iftar);
  readonly selectedSchedule = computed(() => this.schedules().find((item) => item.id === this.user.selectedCityId()) ?? this.schedules()[0]);
  readonly calendar = computed(() => this.calendarDays());

  readonly nextPrayer = computed<PrayerTiming>(() => {
    const now = this.nowMinutes();
    const upcoming = this.day().timings.find((t) => toMinutes(t.time) > now);
    return upcoming ?? this.day().timings[0];
  });

  readonly activePrayer = computed<PrayerTiming>(() => {
    const now = this.nowMinutes();
    const timings = this.day().timings;
    let active = timings[0];
    for (const t of timings) {
      if (toMinutes(t.time) <= now) active = t;
    }
    return active;
  });

  readonly minutesToNext = computed(() => {
    const diff = toMinutes(this.nextPrayer().time) - this.nowMinutes();
    return diff >= 0 ? diff : diff + 24 * 60;
  });

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
    const now = this.nowMinutes();
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

  private refreshForSelectedCity(): void {
    const selectedCity = this.selectedSchedule();
    const cityName = this.cityApiName(selectedCity.id);
    const url = `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(cityName)}&country=India&method=4`;

    this.http.get<AladhanResponse>(url).pipe(
      map((response) => {
        const timings = response?.data?.timings;
        const hijri = response?.data?.date?.hijri;
        if (!timings || !hijri) return null;

        const mapped = this.mapApiTimings(timings);
        const month = [hijri.day, hijri.month?.en, hijri.year].filter(Boolean).join(' ');
        return { month, timings: mapped };
      }),
      catchError(() => of(null)),
    ).subscribe((result) => {
      if (result) {
        this.liveMonth.set(result.month);
        this.liveTimings.set(result.timings);
      } else {
        this.liveMonth.set('');
        this.liveTimings.set(null);
      }
    });
    const calendarUrl = `https://api.aladhan.com/v1/gToHCalendar/8/2026`;
    this.http.get<AladhanCalendarResponse>(calendarUrl).pipe(
      map((response) => {
        const data = response?.data ?? [];
        return data.map((item) => ({
          date: item.gregorian?.date ?? '',
          day: item.hijri?.day ?? '',
          month: item.hijri?.month?.en ?? 'Islamic month',
          year: item.hijri?.year ?? '',
          isCurrentMonth: (item.hijri?.month?.number ?? 0) === 2,
        }));
      }),
      catchError(() => of([])),
    ).subscribe((days) => this.calendarDays.set(days));  }

  private mapApiTimings(timings: Record<string, string>): PrayerTiming[] {
    return [
      { name: 'Fajr', time: this.normalizeApiTime(timings['Fajr']) },
      { name: 'Zuhr', time: this.normalizeApiTime(timings['Dhuhr']) },
      { name: 'Asr', time: this.normalizeApiTime(timings['Asr']) },
      { name: 'Maghrib', time: this.normalizeApiTime(timings['Maghrib']) },
      { name: 'Isha', time: this.normalizeApiTime(timings['Isha']) },
    ];
  }

  private normalizeApiTime(value?: string): string {
    if (!value) return '00:00';
    return value.replace(/\s/g, '').split('(')[0].split(' ')[0];
  }

  private cityApiName(id: string): string {
    switch (id) {
      case 'mau': return 'Mau';
      case 'lucknow': return 'Lucknow';
      case 'kanpur': return 'Kanpur';
      case 'agra': return 'Agra';
      case 'varanasi': return 'Varanasi';
      case 'prayagraj': return 'Prayagraj';
      case 'meerut': return 'Meerut';
      case 'bareilly': return 'Bareilly';
      case 'aligarh': return 'Aligarh';
      case 'moradabad': return 'Moradabad';
      case 'gorakhpur': return 'Gorakhpur';
      default: return 'Lucknow';
    }
  }

  private currentMinutes(): number {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }
}
