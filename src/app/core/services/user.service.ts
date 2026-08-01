import { Injectable, signal } from '@angular/core';
import { CITIES, USER_PROFILE } from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class UserService {
  readonly profile = signal(USER_PROFILE);
  readonly cities = signal(CITIES);
  readonly selectedCityId = signal(this.cities()[0].id);

  selectCity(id: string) {
    this.selectedCityId.set(id);
  }
}
