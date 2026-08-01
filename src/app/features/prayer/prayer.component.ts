import { Component, inject, signal } from '@angular/core';
import { PrayerService } from '../../core/services/prayer.service';
import { AppButtonComponent } from '../../shared/components/app-button.component';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { SectionHeaderComponent } from '../../shared/components/section-header.component';
import { SkyBandComponent } from '../../shared/components/sky-band.component';
import { TabsComponent } from '../../shared/components/tabs.component';
import { IconComponent } from '../../shared/icon/icon.component';

const PRAYER_ICONS: Record<string, string> = {
  Fajr: 'moon', Zuhr: 'sun', Asr: 'sun', Maghrib: 'sunset', Isha: 'star',
};

@Component({
  selector: 'app-prayer',
  imports: [HeaderBarComponent, TabsComponent, SkyBandComponent, SectionHeaderComponent, AppButtonComponent, IconComponent],
  template: `
    <app-header-bar mode="page" title="Prayer & Islamic" actionIcon="calendar" />
    <app-tabs [tabs]="['Today', 'Ramadan', 'Calendar']" [(active)]="activeTab" />

    @switch (activeTab()) {
      @case ('Today') {
        <app-sky-band
          [band]="prayer.skyBand()"
          [tag]="prayer.hijriDate() + ' · ' + prayer.activePrayer().name + ' active'"
          [time]="prayer.activePrayer().time"
          [sub]="'Next: ' + prayer.nextPrayer().name + ' at ' + prayer.nextPrayer().time"
          [progress]="prayer.dayProgressPercent()"
        />

        <app-section-header title="Today's timings" />
        <div class="timing-list">
          @for (t of prayer.timings(); track t.name) {
            <div class="timing-row" [class.active]="t.name === prayer.activePrayer().name">
              <div class="left">
                <div class="icon-chip" [class.active]="t.name === prayer.activePrayer().name">
                  <app-icon [name]="prayerIcons[t.name]" [size]="18" />
                </div>
                <div class="title-sm">{{ t.name }}</div>
              </div>
              <div class="title-sm">{{ t.time }}</div>
            </div>
          }
        </div>

        <app-section-header title="Sehri & Iftar" />
        <div class="card sehri-card">
          <div class="col">
            <div class="meta">Sehri ends</div>
            <div class="title-sm" style="font-size:16px">{{ prayer.sehriEnd() }}</div>
          </div>
          <div class="rule"></div>
          <div class="col">
            <div class="meta">Iftar</div>
            <div class="title-sm" style="font-size:16px">{{ prayer.iftar() }}</div>
          </div>
        </div>

        <div style="padding: 8px 18px 20px;">
          <app-button variant="primary">
            <app-icon name="bell" [size]="16" />
            Enable prayer notifications
          </app-button>
        </div>
      }
      @case ('Ramadan') {
        <div class="card" style="margin: 16px 18px;">
          <div class="title-sm">Ramadan Day {{ prayer.ramadanDay() }}</div>
          <div class="meta" style="margin-top: 6px;">
            Sehri ends {{ prayer.sehriEnd() }} · Iftar {{ prayer.iftar() }}. Taraweeh timings are listed on each mosque's page.
          </div>
        </div>
      }
      @case ('Calendar') {
        <div class="card" style="margin: 16px 18px;">
          <div class="title-sm">Islamic calendar</div>
          <div class="meta" style="margin-top: 6px;">
            Today is {{ prayer.hijriDate() }}. Important Islamic dates for the year will appear here.
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .timing-list { padding: 0 18px; }
    .timing-row {
      display: flex; align-items: center; justify-content: space-between;
      background: var(--card); border: 1px solid var(--line); border-radius: var(--r-md);
      padding: 12px 14px; margin-bottom: 8px;
    }
    .timing-row.active { border-color: var(--emerald); }
    .left { display: flex; gap: 12px; align-items: center; }
    .icon-chip {
      width: 40px; height: 40px; border-radius: 12px; background: var(--emerald-bg); color: var(--emerald);
      display: flex; align-items: center; justify-content: center;
    }
    .icon-chip.active { background: var(--emerald); color: #fff; }
    .sehri-card { display: flex; justify-content: space-around; text-align: center; margin: 0 18px 12px; }
    .col { padding: 4px 0; }
    .rule { width: 1px; background: var(--line); }
  `],
})
export class PrayerComponent {
  protected readonly prayer = inject(PrayerService);
  protected readonly prayerIcons = PRAYER_ICONS;
  protected readonly activeTab = signal('Today');
}
