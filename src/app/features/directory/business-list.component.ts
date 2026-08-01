import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BusinessService } from '../../core/services/business.service';
import { BusinessCardComponent } from '../../shared/components/business-card.component';
import { CategoryChipsComponent } from '../../shared/components/category-chips.component';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { ListCardComponent } from '../../shared/components/list-card.component';
import { SearchBarComponent } from '../../shared/components/search-bar.component';
import { SectionHeaderComponent } from '../../shared/components/section-header.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-business-list',
  imports: [
    RouterLink, HeaderBarComponent, SearchBarComponent, CategoryChipsComponent, SectionHeaderComponent,
    BusinessCardComponent, ListCardComponent, IconComponent,
  ],
  template: `
    <app-header-bar mode="page" title="Directory" actionIcon="filter" />
    <app-search-bar placeholder="Search businesses, services..." [(value)]="query" />
    <app-category-chips [options]="business.categories()" [columns]="4" [(selectedId)]="activeCategory" />

    <app-section-header title="Trending this week" />
    <div class="scroll-row" style="padding: 0 18px 6px;">
      @for (biz of business.trending(); track biz.id) {
        <app-business-card [business]="biz" />
      }
    </div>

    <app-section-header [title]="activeCategory() === 'all' ? 'Nearby' : 'Results'" />
    @for (biz of results(); track biz.id) {
      <a [routerLink]="['/directory', biz.id]" style="text-decoration:none">
        <app-list-card [icon]="biz.categoryIcon" [title]="biz.name" [meta]="biz.category + ' · ' + biz.distanceKm + ' km'">
          <span trailing class="rating"><app-icon name="star" [size]="12" /> {{ biz.rating }}</span>
        </app-list-card>
      </a>
    } @empty {
      <div class="card" style="margin: 0 18px;">
        <div class="meta">No businesses match that search yet.</div>
      </div>
    }
  `,
  styles: [`
    .rating { display: flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; color: var(--gold-ink); flex-shrink: 0; }
  `],
})
export class BusinessListComponent {
  protected readonly business = inject(BusinessService);

  protected readonly query = signal('');
  protected readonly activeCategory = signal('all');

  protected readonly results = computed(() => this.business.search(this.query(), this.activeCategory()));
}
