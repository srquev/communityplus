import { inject, Injectable, signal } from '@angular/core';
import { CITIES, CITY_PRAYER_DATA, USER_PROFILE } from '../data/mock-data';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { CityPrayerSchedule, PrayerName, PrayerTiming } from '../models';

interface ApiNamazTime {
  namazTime: string;
  namazName: string;
  masjidName: string;
  masjidId: string;
  key: string;
}

interface ApiMasjid {
  namazTimes: ApiNamazTime[];
  masjidName: string;
  masjidAddress: string;
  key: string;
  cityName: string;
  cityId: string;
}

interface ApiCity {
  masjids: ApiMasjid[];
  key: string;
  cityName: string;
}

interface CommunityApiResponse {
  totalCities: number;
  cities: ApiCity[];
}

interface SavedLocationSelection {
  cityId?: string;
  masjidId?: string | null;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  readonly profile = signal(USER_PROFILE);
  readonly cities = signal(CITIES);
  readonly cityPrayerData = signal<CityPrayerSchedule[]>(CITY_PRAYER_DATA);
  private readonly selectionStorageKey = 'community-plus-location-selection';
  private readonly savedSelection = this.readSavedSelection();
  readonly selectedCityId = signal(this.resolveInitialCityId());
  readonly selectedMasjidId = signal<string | null>(this.resolveInitialMasjidId());
  private http = inject(HttpClient);
  private communityDataRequest?: Observable<CityPrayerSchedule[]>;

  constructor() {
    const city = this.cities().find((item) => item.id === this.selectedCityId());
    if (city) {
      this.profile.update((current) => ({ ...current, city: city.name }));
    }
  }

  selectCity(id: string) {
    this.selectedCityId.set(id);
    const city = this.cities().find((item) => item.id === id);
    if (city) {
      this.profile.update((current) => ({ ...current, city: city.name }));
    }

    const schedule = this.cityPrayerData().find((item) => item.id === id);
    const availableIds = schedule?.masjids.map((item) => item.id) ?? [];
    const currentSelection = this.selectedMasjidId();

    if (!currentSelection || !availableIds.includes(currentSelection)) {
      this.selectedMasjidId.set(availableIds[0] ?? null);
    }

    this.saveSelection();
  }

  selectMasjid(id: string) {
    const cityWithMasjid = this.cityPrayerData().find((schedule) =>
      schedule.masjids.some((masjid) => masjid.id === id)
    );

    if (cityWithMasjid && cityWithMasjid.id !== this.selectedCityId()) {
      this.selectedCityId.set(cityWithMasjid.id);
      this.profile.update((current) => ({ ...current, city: cityWithMasjid.name }));
    }

    this.selectedMasjidId.set(id);
    this.saveSelection();
  }



  private readonly endpoint = 'https://shadabalmamate-dev-ed.my.site.com/Customer/services/apexrest/community-plus'
  private readonly url = 'https://orgfarm-d42615ccbd-dev-ed.develop.my.salesforce-sites.com/services/apexrest/community-plus'

  loadCommunityData(): Observable<CityPrayerSchedule[]> {
    this.communityDataRequest ??= this.http.get<CommunityApiResponse>(this.url).pipe(
      map((response) => this.mapCommunityResponse(response)),
      tap((schedules) => {
        if (!schedules.length) return;

        this.cityPrayerData.set(schedules);
        this.cities.set(schedules.map((schedule) => ({ id: schedule.id, name: schedule.name })));

        this.reconcileSelection(schedules);
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    return this.communityDataRequest;
  }

  loadCommunityPrayerData(): Observable<CityPrayerSchedule[]> {
    return this.loadCommunityData();
  }

  private mapCommunityResponse(response: CommunityApiResponse): CityPrayerSchedule[] {
    return (response.cities ?? []).map((city) => {
      const masjids = (city.masjids ?? []).map((masjid) => ({
        id: masjid.key,
        name: masjid.masjidName,
        address: this.formatSalesforceAddress(masjid.masjidAddress),
        namazTimes: this.normalizeTimings(masjid.namazTimes),
      }));

      const defaultTimings = masjids[0]?.namazTimes ?? [];

      return {
        id: city.key,
        name: city.cityName,
        hijriDate: '12 Muharram 1448',
        ramadanDay: 12,
        sehriEnd: defaultTimings.find((timing) => timing.name === 'Fajr')?.time ?? '04:30',
        iftar: defaultTimings.find((timing) => timing.name === 'Maghrif')?.time ?? '18:15',
        timings: defaultTimings,
        masjids,
      };
    });
  }

  private normalizeTimings(times: ApiNamazTime[]): PrayerTiming[] {
    const order: PrayerName[] = ['Fajr', 'Zuhr', 'Asr', 'Maghrif', 'Isha'];
    return (times ?? [])
      .map((timing) => ({
        name: this.normalizePrayerName(timing.namazName),
        time: this.toLocalTime(timing.namazTime),
      }))
      .filter((timing): timing is PrayerTiming => timing.name !== null)
      .sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));
  }

  private normalizePrayerName(name: string): PrayerName | null {
    const normalized = name.trim().toLowerCase();
    if (normalized === 'fajr') return 'Fajr';
    if (normalized === 'dhuhr' || normalized === 'zuhr') return 'Zuhr';
    if (normalized === 'asr') return 'Asr';
    if (normalized === 'maghrib' || normalized === 'maghrif') return 'Maghrif';
    if (normalized === 'isha') return 'Isha';
    return null;
  }

  private toLocalTime(value: string): string {
    const match = value.match(/^(\d{2}):(\d{2})/);
    if (!match) return value;
    return `${match[1]}:${match[2]}`;
  }

  private formatSalesforceAddress(value: string): string {
    const street = value.match(/getStreet=([^;]+);/)?.[1];
    const city = value.match(/getCity=([^;]+);/)?.[1];
    const state = value.match(/getState=([^;]+);/)?.[1];
    const postalCode = value.match(/getPostalCode=([^;]+);/)?.[1];
    return [street, city, state, postalCode].filter(Boolean).join(', ') || value;
  }

  private reconcileSelection(schedules: CityPrayerSchedule[]): void {
    const currentCityId = this.selectedCityId();
    const currentMasjidId = this.selectedMasjidId();
    const cityWithSelectedMasjid = currentMasjidId
      ? schedules.find((schedule) => schedule.masjids.some((masjid) => masjid.id === currentMasjidId))
      : null;
    const selectedCity = cityWithSelectedMasjid
      ?? schedules.find((schedule) => schedule.id === currentCityId)
      ?? schedules[0];

    if (!selectedCity) return;

    this.selectedCityId.set(selectedCity.id);
    this.profile.update((current) => ({ ...current, city: selectedCity.name }));

    const selectedMasjidExists = selectedCity.masjids.some((masjid) => masjid.id === currentMasjidId);
    this.selectedMasjidId.set(selectedMasjidExists ? currentMasjidId : selectedCity.masjids[0]?.id ?? null);
    this.saveSelection();
  }

  private resolveInitialCityId(): string {
    const savedCityExists = this.savedSelection?.cityId && this.cities().some((city) => city.id === this.savedSelection?.cityId);
    if (savedCityExists) return this.savedSelection?.cityId ?? this.cities()[0].id;

    const savedMasjidCity = this.savedSelection?.masjidId
      ? this.cityPrayerData().find((schedule) => schedule.masjids.some((masjid) => masjid.id === this.savedSelection?.masjidId))
      : null;
    return savedMasjidCity?.id ?? this.cities()[0].id;
  }

  private resolveInitialMasjidId(): string | null {
    const initialCityId = this.resolveInitialCityId();
    const initialCity = this.cityPrayerData().find((schedule) => schedule.id === initialCityId) ?? this.cityPrayerData()[0];
    const savedMasjidExists = initialCity?.masjids.some((masjid) => masjid.id === this.savedSelection?.masjidId);
    return savedMasjidExists ? this.savedSelection?.masjidId ?? null : initialCity?.masjids[0]?.id ?? null;
  }

  private saveSelection(): void {
    try {
      globalThis.localStorage?.setItem(this.selectionStorageKey, JSON.stringify({
        cityId: this.selectedCityId(),
        masjidId: this.selectedMasjidId(),
      }));
    } catch {
      // Storage can be unavailable in private browsing or non-browser contexts.
    }
  }

  private readSavedSelection(): SavedLocationSelection | null {
    try {
      const raw = globalThis.localStorage?.getItem(this.selectionStorageKey);
      return raw ? JSON.parse(raw) as SavedLocationSelection : null;
    } catch {
      return null;
    }
  }

}
