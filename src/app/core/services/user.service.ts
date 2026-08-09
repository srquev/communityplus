import { inject, Injectable, signal } from '@angular/core';
import { CITIES, CITY_PRAYER_DATA, USER_PROFILE } from '../data/mock-data';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  readonly profile = signal(USER_PROFILE);
  readonly cities = signal(CITIES);
  readonly selectedCityId = signal(this.cities()[0].id);
  readonly selectedMasjidId = signal<string | null>(CITY_PRAYER_DATA[0]?.masjids[0]?.id ?? null);
  private http = inject(HttpClient);

  selectCity(id: string) {
    this.selectedCityId.set(id);
    const city = this.cities().find((item) => item.id === id);
    if (city) {
      this.profile.update((current) => ({ ...current, city: city.name }));
    }

    const schedule = CITY_PRAYER_DATA.find((item) => item.id === id);
    const availableIds = schedule?.masjids.map((item) => item.id) ?? [];
    const currentSelection = this.selectedMasjidId();

    if (!currentSelection || !availableIds.includes(currentSelection)) {
      this.selectedMasjidId.set(availableIds[0] ?? null);
    }
  }

  selectMasjid(id: string) {
    this.selectedMasjidId.set(id);
  }



  private readonly endpoint = 'https://shadabalmamate-dev-ed.my.site.com/Customer/services/apexrest/community-plus'
  private readonly url = 'https://orgfarm-d42615ccbd-dev-ed.develop.my.salesforce-sites.com/services/apexrest/community-plus'

  createContact(
    payload = {
      name: 'sharique'
    }
  ): Observable<any> {
    return this.http.get<any>(
      this.url
    ) as any;
  }

}