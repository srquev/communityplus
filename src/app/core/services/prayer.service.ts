import { Injectable, computed, signal } from '@angular/core';
import { PRAYER_DAY } from '../data/mock-data';
import { PrayerDay, PrayerTiming } from '../models';

export type SkyBand = 'fajr' | 'zuhr' | 'asr' | 'maghrib' | 'isha';

function toMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

// Injectable, root-provided store. Swap the mock read for an HTTP call to
// move this to a real backend without touching any component.
@Injectable({ providedIn: 'root' })
export class PrayerService {
  private readonly day = signal<PrayerDay>(PRAYER_DAY);
  private readonly nowMinutes = signal<number>(this.currentMinutes());

  readonly timings = computed(() => this.day().timings);
  readonly hijriDate = computed(() => this.day().hijriDate);
  readonly ramadanDay = computed(() => this.day().ramadanDay);
  readonly sehriEnd = computed(() => this.day().sehriEnd);
  readonly iftar = computed(() => this.day().iftar);

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

  // Progress along the Fajr -> Isha arc, used by the signature sky-band widget.
  readonly dayProgressPercent = computed(() => {
    const timings = this.day().timings;
    const start = toMinutes(timings[0].time);
    const end = toMinutes(timings[timings.length - 1].time);
    const now = this.nowMinutes();
    if (now <= start) return 0;
    if (now >= end) return 100;
    return Math.round(((now - start) / (end - start)) * 100);
  });

  private currentMinutes(): number {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  }
}
