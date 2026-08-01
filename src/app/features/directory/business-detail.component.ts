import { Component, computed, inject, input, signal } from '@angular/core';
import { BusinessService } from '../../core/services/business.service';
import { AppButtonComponent } from '../../shared/components/app-button.component';
import { BadgeComponent } from '../../shared/components/badge.component';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { TabsComponent } from '../../shared/components/tabs.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-business-detail',
  imports: [HeaderBarComponent, BadgeComponent, AppButtonComponent, TabsComponent, IconComponent],
  template: `
    @if (business(); as b) {
      <app-header-bar mode="page" [title]="b.name" actionIcon="heart" />

      <div class="hero"><app-icon [name]="b.categoryIcon" [size]="34" /></div>

      <div class="info">
        <h3>{{ b.name }}</h3>
        <div class="meta">{{ b.category }} · {{ b.distanceKm }} km</div>
        <div class="row">
          <div class="rating"><app-icon name="star" [size]="14" /> {{ b.rating }} <span class="count">({{ b.reviewCount }})</span></div>
          <app-badge>{{ b.isOpen ? 'Open · closes ' + b.closesAt : 'Closed' }}</app-badge>
        </div>
      </div>

      <div class="actions">
        <app-button variant="primary"><app-icon name="phone" [size]="16" /> Call</app-button>
        <app-button variant="outline"><app-icon name="direction" [size]="16" /> Directions</app-button>
      </div>

      <app-tabs [tabs]="['Overview', 'Reviews', 'Photos']" [(active)]="activeTab" />

      @switch (activeTab()) {
        @case ('Overview') {
          <div class="card" style="margin: 0 18px 12px;">
            <div class="title-sm">About</div>
            <div class="meta about">{{ b.description }}</div>
          </div>
          <div class="card" style="margin: 0 18px 12px;">
            <div class="title-sm">Services</div>
            <div class="chips">
              @for (s of b.services; track s) {
                <app-badge>{{ s }}</app-badge>
              }
            </div>
          </div>
        }
        @case ('Reviews') {
          @for (r of b.reviews; track r.id) {
            <div class="card" style="margin: 0 18px 12px;">
              <div class="reviewer">
                <div class="avatar">{{ r.initials }}</div>
                <div>
                  <div class="title-sm" style="font-size:12.5px">{{ r.author }}</div>
                  <div class="stars">
                    @for (s of stars(r.rating); track $index) {
                      <app-icon name="star" [size]="11" />
                    }
                  </div>
                </div>
              </div>
              <div class="meta about">{{ r.comment }}</div>
            </div>
          } @empty {
            <div class="card" style="margin: 0 18px 12px;">
              <div class="meta">No reviews yet — be the first to leave one.</div>
            </div>
          }
        }
        @case ('Photos') {
          <div class="card" style="margin: 0 18px 12px;">
            <div class="meta">Photos coming soon.</div>
          </div>
        }
      }
    }
  `,
  styles: [`
    .hero {
      margin: 0 18px; border-radius: 18px; height: 150px;
      background: linear-gradient(135deg, #ede6d6, #dcd2b8); color: #b8a876;
      display: flex; align-items: center; justify-content: center;
    }
    .info { padding: 14px 18px 0; }
    .info h3 { font-size: 19px; font-weight: 700; }
    .meta { font-size: 11.5px; color: var(--ink-soft); margin-top: 4px; }
    .meta.about { line-height: 1.6; margin-top: 6px; }
    .row { display: flex; align-items: center; gap: 10px; margin-top: 10px; }
    .rating { display: flex; align-items: center; gap: 4px; color: var(--gold-ink); font-weight: 700; font-size: 13px; }
    .count { color: var(--ink-soft); font-weight: 500; }
    .actions { display: flex; gap: 10px; padding: 14px 18px 4px; }
    .chips { display: flex; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
    .reviewer { display: flex; gap: 10px; align-items: center; }
    .avatar {
      width: 36px; height: 36px; border-radius: 50%; background: var(--emerald); color: #fff;
      display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 12px;
    }
    .stars { display: flex; gap: 2px; color: var(--gold-ink); margin-top: 2px; }
    .title-sm { font-size: 13.5px; font-weight: 700; }
  `],
})
export class BusinessDetailComponent {
  private readonly businessService = inject(BusinessService);

  id = input.required<string>();

  protected readonly business = computed(() => this.businessService.all().find((b) => b.id === this.id()));
  protected readonly activeTab = signal('Overview');

  protected stars(rating: number): number[] {
    return Array.from({ length: rating });
  }
}
