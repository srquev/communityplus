import { Injectable, computed, signal } from '@angular/core';
import { BUSINESSES, BUSINESS_CATEGORIES } from '../data/mock-data';
import { Business } from '../models';

@Injectable({ providedIn: 'root' })
export class BusinessService {
  private readonly businesses = signal<Business[]>(BUSINESSES);

  readonly categories = signal(BUSINESS_CATEGORIES);
  readonly all = this.businesses.asReadonly();

  readonly trending = computed(() => this.businesses().filter((b) => b.trending));
  readonly featured = computed(() =>
    [...this.businesses()].sort((a, b) => b.rating - a.rating).slice(0, 3)
  );

  search(term: string, categoryId: string): Business[] {
    const query = term.trim().toLowerCase();
    return this.businesses().filter((b) => {
      const matchesCategory = categoryId === 'all' || b.categoryId === categoryId;
      const matchesQuery = !query || b.name.toLowerCase().includes(query) || b.category.toLowerCase().includes(query);
      return matchesCategory && matchesQuery;
    });
  }

  byId(id: string) {
    return computed(() => this.businesses().find((b) => b.id === id));
  }
}
