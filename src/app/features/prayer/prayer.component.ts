import { Component, computed, inject, signal } from '@angular/core';
import { PrayerService } from '../../core/services/prayer.service';
import { UserService } from '../../core/services/user.service';
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
    <app-header-bar mode="page" title="Prayer & Islamic" actionIcon="calendar" (actionClick)="toggleCalendarSheet()" />
    <div class="city-picker-card">
      <div class="picker-group">
        <label class="city-picker-label" for="city-select">City</label>
        <select id="city-select" class="city-picker" [value]="user.selectedCityId()" (change)="user.selectCity($any($event.target).value)">
          @for (city of user.cities(); track city.id) {
            <option [value]="city.id">{{ city.name }}</option>
          }
        </select>
      </div>
      <div class="picker-group">
        <label class="city-picker-label" for="masjid-select">Masjid</label>
        <select id="masjid-select" class="city-picker" [value]="user.selectedMasjidId() ?? ''" (change)="user.selectMasjid($any($event.target).value)">
          @for (masjid of prayer.selectedSchedule().masjids; track masjid.id) {
            <option [value]="masjid.id">{{ masjid.name }}</option>
          }
        </select>
      </div>
    </div>
    <div class="live-card">
      <div>
        <div class="meta">Live timing</div>
        <div class="title-sm">{{ now().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', second: '2-digit' }) }}</div>
      </div>
      <div class="live-pill">{{ prayer.activePrayer().name }} · {{ prayer.formatTime(prayer.activePrayer().time) }}</div>
    </div>

    @if (showCalendarSheet()) {
      <div class="calendar-sheet">
        <div class="sheet-head">
          <div>
            <div class="meta">Islamic calendar</div>
            <div class="title-sm">{{ prayer.hijriDate() }}</div>
          </div>
          <button type="button" class="sheet-close" (click)="toggleCalendarSheet()">Close</button>
        </div>
        <div class="calendar-grid compact-grid">
          @for (day of prayer.calendar(); track day.date) {
            <div class="calendar-day compact-day" [class.current-month]="day.isCurrentMonth">
              <div class="day-date">{{ day.date }}</div>
              <div class="day-hijri">{{ day.day }}</div>
              <div class="day-month">{{ day.month }}</div>
            </div>
          }
        </div>
      </div>
    }

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
              <div class="title-sm">{{ prayer.formatTime(t.time) }}</div>
            </div>
          }
        </div>

        <app-section-header title="Selected masjid" />
        <div class="masjid-list">
          @if (selectedMasjid(); as masjid) {
            <div class="masjid-card">
              <div class="masjid-header">
                <div class="title-sm">{{ masjid.name }}</div>
                <div class="meta">{{ masjid.address }}</div>
              </div>
              <button type="button" class="map-btn" (click)="toggleMap(masjid.id)">Show in map</button>
              @if (activeMapMasjid() === masjid.id) {
                <div class="map-shell">
                  <a class="map-link" [href]="prayer.getMapUrl(masjid.address)" target="_blank" rel="noopener noreferrer">Open in Google Maps / OpenStreetMap</a>
                </div>
              }
              <div class="masjid-timings">
                @for (timing of masjid.namazTimes; track timing.name) {
                  <div class="timing-pill">
                    <span class="timing-name">{{ timing.name }}</span>
                    <span class="timing-time">{{ prayer.formatTime(timing.time) }}</span>
                  </div>
                }
              </div>
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
        <div class="calendar-card">
          <div class="title-sm">Islamic calendar</div>
          <div class="meta" style="margin-top: 6px;">Current month: {{ prayer.hijriDate() }}</div>
          <div class="calendar-grid">
            @for (day of prayer.calendar(); track day.date) {
              <div class="calendar-day" [class.current-month]="day.isCurrentMonth">
                <div class="day-date">{{ day.date }}</div>
                <div class="day-hijri">{{ day.day }}</div>
                <div class="day-month">{{ day.month }}</div>
              </div>
            }
          </div>
        </div>
      }
    }
  `,
  styles: [`
    .city-picker-card {
      display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;
      margin: 10px 18px 8px; padding: 8px; border: 1px solid var(--line); border-radius: var(--r-md);
      background: linear-gradient(135deg, var(--card), var(--cloud)); box-shadow: 0 10px 24px rgba(18, 21, 28, 0.04);
    }
    .picker-group {
      display: flex; flex-direction: column; gap: 4px; min-width: 0; padding: 8px 10px;
      border-radius: 12px; background: rgba(255,255,255,0.72);
    }
    .city-picker-label { font-size: 10px; font-weight: 700; color: var(--ink-soft); text-transform: uppercase; letter-spacing: .06em; }
    .city-picker {
      flex: 1; border: 0; background: transparent; color: var(--ink); font: inherit; font-weight: 700; outline: none;
      width: 100%; min-width: 0;
    }
    .live-card {
      display: flex; justify-content: space-between; align-items: center; gap: 12px;
      margin: 10px 18px 8px; padding: 12px 14px; border: 1px solid var(--line); border-radius: var(--r-md);
      background: linear-gradient(135deg, var(--card), var(--cloud)); box-shadow: 0 12px 26px rgba(18, 21, 28, 0.05);
    }
    .live-pill {
      background: var(--emerald-bg); color: var(--emerald-ink); border-radius: 999px;
      padding: 6px 10px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em;
    }
    .calendar-sheet {
      margin: 0 18px 10px; padding: 12px; border: 1px solid var(--line); border-radius: var(--r-md);
      background: var(--card); box-shadow: 0 12px 26px rgba(18, 21, 28, 0.04);
    }
    .sheet-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .sheet-close {
      border: 0; border-radius: 999px; padding: 6px 10px; background: var(--cloud); color: var(--ink-soft);
      font-size: 11px; font-weight: 700; cursor: pointer;
    }
    .timing-list { padding: 0 18px; }
    .timing-row {
      display: flex; align-items: center; justify-content: space-between;
      background: var(--card); border: 1px solid var(--line); border-radius: var(--r-md);
      padding: 10px 12px; margin-bottom: 8px; box-shadow: 0 6px 16px rgba(18, 21, 28, 0.03);
    }
    .timing-row.active { border-color: var(--emerald); }
    .left { display: flex; gap: 12px; align-items: center; }
    .icon-chip {
      width: 38px; height: 38px; border-radius: 12px; background: var(--emerald-bg); color: var(--emerald);
      display: flex; align-items: center; justify-content: center;
    }
    .icon-chip.active { background: var(--emerald); color: #fff; }
    .masjid-list { padding: 0 18px 8px; display: flex; flex-direction: column; gap: 10px; }
    .masjid-card {
      background: var(--card); border: 1px solid var(--line); border-radius: var(--r-md); padding: 12px 14px; box-shadow: 0 8px 18px rgba(18, 21, 28, 0.03);
    }
    .masjid-header { margin-bottom: 8px; }
    .map-btn {
      border: 0; border-radius: 999px; padding: 6px 10px; background: var(--emerald-bg); color: var(--emerald-ink);
      font-size: 11px; font-weight: 700; margin-bottom: 8px; cursor: pointer;
    }
    .map-shell { margin-bottom: 8px; border-radius: var(--r-md); overflow: hidden; border: 1px solid var(--line); padding: 8px; }
    .map-link { font-size: 12px; font-weight: 700; color: var(--emerald); text-decoration: none; }
    .masjid-timings { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
    .timing-pill {
      display: flex; justify-content: space-between; align-items: center; gap: 8px;
      background: var(--emerald-bg); color: var(--emerald-ink); border-radius: 999px; padding: 6px 10px; font-size: 11px; font-weight: 700;
    }
    .timing-name { text-transform: uppercase; letter-spacing: .04em; }
    .calendar-card {
      margin: 16px 18px 24px; padding: 12px; border: 1px solid var(--line); border-radius: var(--r-md); background: var(--card); box-shadow: 0 10px 22px rgba(18, 21, 28, 0.04);
    }
    .calendar-grid {
      display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; margin-top: 10px;
    }
    .compact-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .calendar-day {
      border: 1px solid var(--line); border-radius: 12px; padding: 8px; background: var(--cloud);
    }
    .compact-day { min-height: 74px; }
    .calendar-day.current-month { border-color: var(--emerald); background: var(--emerald-bg); }
    .day-date { font-size: 11px; font-weight: 700; color: var(--ink-soft); }
    .day-hijri { font-size: 15px; font-weight: 800; margin-top: 4px; }
    .day-month { font-size: 10px; color: var(--ink-soft); margin-top: 2px; }
    .sehri-card { display: flex; justify-content: space-around; text-align: center; margin: 0 18px 12px; }
    .col { padding: 4px 0; }
    .rule { width: 1px; background: var(--line); }
  `],
})
export class PrayerComponent {
  protected readonly prayer = inject(PrayerService);
  protected readonly user = inject(UserService);
  protected readonly prayerIcons = PRAYER_ICONS;
  protected readonly activeTab = signal('Today');
  protected readonly activeMapMasjid = signal<string | null>(null);
  protected readonly showCalendarSheet = signal(false);
  protected readonly now = signal(new Date());
  protected readonly selectedMasjid = computed(() => {
    const schedule = this.prayer.selectedSchedule();
    const selectedId = this.user.selectedMasjidId();
    return schedule.masjids.find((masjid) => masjid.id === selectedId) ?? schedule.masjids[0];
  });

  constructor() {
    setInterval(() => this.now.set(new Date()), 1000);
  }

  protected toggleMap(masjidId: string): void {
    this.activeMapMasjid.set(this.activeMapMasjid() === masjidId ? null : masjidId);
  }

  protected toggleCalendarSheet(): void {
    const nextState = !this.showCalendarSheet();
    this.showCalendarSheet.set(nextState);
    if (nextState) {
      this.activeTab.set('Calendar');
    }
  }
}
