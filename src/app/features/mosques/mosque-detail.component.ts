import { Component, computed, inject, input } from '@angular/core';
import { MosqueService } from '../../core/services/mosque.service';
import { AppButtonComponent } from '../../shared/components/app-button.component';
import { BadgeComponent } from '../../shared/components/badge.component';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { SectionHeaderComponent } from '../../shared/components/section-header.component';
import { IconComponent } from '../../shared/icon/icon.component';

// `id` is bound automatically from the :id route param via
// withComponentInputBinding() in app.config.ts.
@Component({
  selector: 'app-mosque-detail',
  imports: [HeaderBarComponent, SectionHeaderComponent, BadgeComponent, AppButtonComponent, IconComponent],
  template: `
    @if (mosque(); as m) {
      <app-header-bar mode="page" [title]="m.name" actionIcon="share" />

      <div class="hero"><app-icon name="mosque" [size]="40" /></div>

      <div class="info">
        <h3>{{ m.name }}</h3>
        <div class="meta">{{ m.distanceKm }} km away · {{ m.address }}</div>
        <div class="badges">
          <app-badge>Open now</app-badge>
          <app-badge variant="gold">Jumma {{ m.jummaTime }}</app-badge>
        </div>
      </div>

      <app-section-header title="Today's timings" />
      <div class="card timings-grid">
        <div><div class="meta">Fajr</div><div class="title-sm">{{ m.timings.fajr }}</div></div>
        <div><div class="meta">Zuhr</div><div class="title-sm">{{ m.timings.zuhr }}</div></div>
        <div><div class="meta">Asr</div><div class="title-sm">{{ m.timings.asr }}</div></div>
        <div><div class="meta">Maghrib</div><div class="title-sm">{{ m.timings.maghrib }}</div></div>
        <div><div class="meta">Isha</div><div class="title-sm">{{ m.timings.isha }}</div></div>
        <div><div class="meta">Jumma</div><div class="title-sm">{{ m.timings.jumma }}</div></div>
      </div>

      <app-section-header title="Announcements" />
      @for (a of m.announcements; track a.id) {
        <div class="card" style="margin: 0 18px 10px;">
          <div class="title-sm">{{ a.title }}</div>
          <div class="meta" style="margin-top: 4px;">{{ a.postedAt }}</div>
        </div>
      } @empty {
        <div class="card" style="margin: 0 18px 10px;">
          <div class="meta">No announcements yet.</div>
        </div>
      }

      <app-section-header title="Location" />
      <div class="hero map"><app-icon name="map" [size]="26" /></div>

      <div style="padding: 14px 18px 24px;">
        <app-button variant="outline">
          <app-icon name="direction" [size]="16" />
          Get directions
        </app-button>
      </div>
    }
  `,
  styles: [`
    .hero {
      margin: 0 18px; border-radius: 18px; height: 150px;
      background: linear-gradient(135deg, #dce9e6, #b9d2cb); color: var(--emerald);
      display: flex; align-items: center; justify-content: center;
    }
    .hero.map { height: 110px; background: linear-gradient(135deg, #e7e9ec, #d3d7dd); color: var(--ink-soft); }
    .info { padding: 14px 18px 0; }
    .info h3 { font-size: 19px; font-weight: 700; }
    .meta { font-size: 11.5px; color: var(--ink-soft); margin-top: 4px; }
    .badges { display: flex; gap: 8px; margin-top: 12px; }
    .timings-grid {
      margin: 0 18px 12px; display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 10px; text-align: center;
    }
    .title-sm { font-size: 13.5px; font-weight: 700; }
  `],
})
export class MosqueDetailComponent {
  private readonly mosqueService = inject(MosqueService);

  id = input.required<string>();

  protected readonly mosque = computed(() => this.mosqueService.all().find((m) => m.id === this.id()));
}
