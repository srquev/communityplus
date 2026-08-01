import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MosqueService } from '../../core/services/mosque.service';
import { ChipOption, CategoryChipsComponent } from '../../shared/components/category-chips.component';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { SearchBarComponent } from '../../shared/components/search-bar.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-mosque-list',
  imports: [RouterLink, HeaderBarComponent, SearchBarComponent, CategoryChipsComponent, IconComponent],
  template: `
    <app-header-bar mode="page" title="Mosques" actionIcon="map" />
    <app-search-bar placeholder="Search mosques..." [(value)]="query" />
    <app-category-chips [options]="filters" [columns]="3" [(selectedId)]="activeFilter" />

    <div class="list">
      @for (mosque of filteredMosques(); track mosque.id) {
        <a class="row-card" [routerLink]="['/mosques', mosque.id]">
          <div class="thumb"><app-icon name="mosque" [size]="22" /></div>
          <div class="body">
            <div class="title-sm">{{ mosque.name }}</div>
            <div class="meta">{{ mosque.distanceKm }} km · Jumma {{ mosque.jummaTime }}</div>
          </div>
          <span class="badge" [class.live]="mosque.isLive">{{ mosque.isLive ? 'Live now' : 'Open' }}</span>
        </a>
      }
    </div>
  `,
  styles: [`
    .list { padding-top: 6px; }
    .row-card {
      display: flex; gap: 12px; align-items: center;
      background: var(--card); border: 1px solid var(--line); border-radius: var(--r-md);
      padding: 14px; margin: 0 18px 10px;
    }
    .thumb {
      width: 44px; height: 44px; border-radius: 12px; background: var(--emerald-bg); color: var(--emerald);
      display: flex; align-items: center; justify-content: center; flex-shrink: 0;
    }
    .body { flex: 1; min-width: 0; }
    .title-sm { font-size: 13.5px; font-weight: 700; }
    .meta { font-size: 11.5px; color: var(--ink-soft); margin-top: 2px; }
    .badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: var(--r-pill); background: var(--emerald-bg); color: var(--emerald-ink); white-space: nowrap; }
    .badge.live { background: var(--gold-bg); color: var(--gold-ink); }
  `],
})
export class MosqueListComponent {
  private readonly mosqueService = inject(MosqueService);

  protected readonly filters: ChipOption[] = [
    { id: 'nearby', label: 'Nearby', icon: 'pin' },
    { id: 'jumma', label: 'Jumma', icon: 'star' },
    { id: 'taraweeh', label: 'Taraweeh', icon: 'moon' },
  ];

  protected readonly query = signal('');
  protected readonly activeFilter = signal('nearby');

  protected readonly filteredMosques = computed(() => {
    const term = this.query().trim().toLowerCase();
    const all = this.mosqueService.all();
    const matching = term ? all.filter((m) => m.name.toLowerCase().includes(term)) : all;
    return [...matching].sort((a, b) => a.distanceKm - b.distanceKm);
  });
}
