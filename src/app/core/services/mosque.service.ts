import { Injectable, computed, signal } from '@angular/core';
import { MOSQUES } from '../data/mock-data';
import { Mosque } from '../models';

@Injectable({ providedIn: 'root' })
export class MosqueService {
  private readonly mosques = signal<Mosque[]>(MOSQUES);
  readonly all = this.mosques.asReadonly();

  readonly nearest = computed(() =>
    [...this.mosques()].sort((a, b) => a.distanceKm - b.distanceKm).slice(0, 2)
  );

  byId(id: string) {
    return computed(() => this.mosques().find((m) => m.id === id));
  }
}
