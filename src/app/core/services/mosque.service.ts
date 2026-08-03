import { Injectable, computed, inject, signal } from '@angular/core';
import { CITY_PRAYER_DATA } from '../data/mock-data';
import { Mosque } from '../models';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class MosqueService {
  private readonly user = inject(UserService);
  private readonly citySchedules = signal(CITY_PRAYER_DATA);

  readonly all = computed<Mosque[]>(() => {
    const selectedCity = this.citySchedules().find((item) => item.id === this.user.selectedCityId()) ?? this.citySchedules()[0];
    return selectedCity.masjids.map((masjid, index) => ({
      id: masjid.id,
      name: masjid.name,
      address: masjid.address,
      distanceKm: Number((0.4 + index * 0.3).toFixed(1)),
      jummaTime: '13:15',
      isLive: index === 0,
      timings: {
        fajr: masjid.namazTimes.find((timing) => timing.name === 'Fajr')?.time ?? '04:00',
        zuhr: masjid.namazTimes.find((timing) => timing.name === 'Zuhr')?.time ?? '12:00',
        asr: masjid.namazTimes.find((timing) => timing.name === 'Asr')?.time ?? '16:00',
        maghrib: masjid.namazTimes.find((timing) => timing.name === 'Maghrib')?.time ?? '18:00',
        isha: masjid.namazTimes.find((timing) => timing.name === 'Isha')?.time ?? '20:00',
        jumma: '13:15',
      },
      announcements: [],
    }));
  });

  readonly nearest = computed(() =>
    [...this.all()].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 2)
  );

  byId(id: string) {
    return computed(() => this.all().find((m) => m.id === id));
  }
}
