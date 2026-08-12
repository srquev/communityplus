import { Component, computed, inject, signal } from '@angular/core';
import { PrayerService } from '../../core/services/prayer.service';
import { UserService } from '../../core/services/user.service';
import { AppButtonComponent } from '../../shared/components/app-button.component';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { SectionHeaderComponent } from '../../shared/components/section-header.component';
import { TabsComponent } from '../../shared/components/tabs.component';
import { IconComponent } from '../../shared/icon/icon.component';

const PRAYER_ICONS: Record<string, string> = {
  Fajr: 'sunrise',
  Zuhr: 'sun',
  Asr: 'sunset',
  Maghrib: 'moon',
  Isha: 'moonfilled',
  Tahajjud: 'moon-stars',
};

@Component({
  selector: 'app-prayer',
  imports: [HeaderBarComponent, TabsComponent, SectionHeaderComponent, AppButtonComponent, IconComponent],
  template: `
    <app-header-bar mode="page" title="Prayer & Islamic" actionIcon="calendar" (actionClick)="toggleCalendarSheet()" />
    <div class="city-picker-card">
      <div class="picker-group">
        <div class="picker-row">
          <app-icon name="pin" [size]="16" />
          <select id="city-select" class="city-picker" aria-label="Location" [value]="user.selectedCityId()" (change)="user.selectCity($any($event.target).value)">
            @for (city of user.cities(); track city.id) {
              <option [value]="city.id">{{ city.name }}</option>
            }
          </select>
        </div>
      </div>
      <div class="picker-group">
        <div class="picker-row">
          <app-icon name="mosque" [size]="16" />
          <select id="masjid-select" class="city-picker" aria-label="Masjid" [value]="user.selectedMasjidId() ?? ''" (change)="user.selectMasjid($any($event.target).value)">
            @for (masjid of prayer.selectedSchedule().masjids; track masjid.id) {
              <option [value]="masjid.id">{{ masjid.name }}</option>
            }
          </select>
        </div>
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
      <div class="calendar-overlay" (click)="closeCalendar()">
        <section class="calendar-dialog" role="dialog" aria-modal="true" aria-labelledby="calendar-title" (click)="$event.stopPropagation()">
          <div class="sheet-head">
            <div>
              <div class="meta">Today in the Islamic calendar</div>
              <div class="title-sm" id="calendar-title">{{ prayer.hijriDate() }}</div>
            </div>
            <button type="button" class="sheet-close" aria-label="Close calendar" (click)="closeCalendar()">×</button>
          </div>
          <div class="calendar-month">
            <button type="button" class="month-nav previous" aria-label="Previous month" (click)="prayer.changeCalendarMonth(-1)"><app-icon name="chevron" [size]="16" /></button>
            <span>{{ currentMonthLabel() }} · {{ hijriMonthLabel() }}</span>
            <button type="button" class="month-nav" aria-label="Next month" (click)="prayer.changeCalendarMonth(1)"><app-icon name="chevron" [size]="16" /></button>
          </div>
          <button type="button" class="calendar-today" (click)="prayer.resetCalendarMonth()">Today</button>
          <div class="weekday-row" aria-hidden="true">
            @for (weekday of weekdays; track weekday) { <span>{{ weekday }}</span> }
          </div>
          <div class="calendar-grid">
            @for (day of calendarCells(); track $index) {
              @if (day) {
                <div class="calendar-day" [class.today]="day.isToday" [attr.aria-label]="day.englishDay + ' ' + day.month + ', Hijri ' + day.day">
                  <span class="day-date">{{ day.englishDay }}</span>
                  <span class="day-hijri">{{ day.day }}</span>
                </div>
              } @else {
                <div class="calendar-empty" aria-hidden="true"></div>
              }
            }
          </div>
          <div class="today-in-calendar">
          <div class="calendar-key"><span></span> Hijri date shown below each English date</div>
          <div style="
    margin-top: 12px;
"><span type="button" class="calendar-today" (click)="prayer.resetCalendarMonth()">Today</span></div>
          </div>
        </section>
      </div>
    }

    <app-tabs [tabs]="['Today', 'Ramadan', 'Calendar']" [(active)]="activeTab" />

    @switch (activeTab()) {
      @case ('Today') {
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

        <app-section-header title="Tahajjud prayer" />
        <div class="tahajjud-card">
          <div class="tahajjud-orb">
            <app-icon [name]="prayerIcons['Tahajjud']" [size]="22" />
          </div>
          <div class="tahajjud-copy">
            <div class="tahajjud-kicker">Night prayer</div>
            <div class="title-sm">Tahajjud</div>
            <p>Suggested time based on your local Fajr timing.</p>
          </div>
          <div class="tahajjud-time">{{ prayer.formatTime(prayer.tahajjud().time) }}</div>
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
        <section class="calendar-tab" aria-labelledby="calendar-tab-title">
          <div class="calendar-tab-head">
            <div class="meta">Today in the Islamic calendar</div>
            <div class="title-sm" id="calendar-tab-title">{{ prayer.hijriDate() }}</div>
          </div>
          <div class="calendar-month">
            <button type="button" class="month-nav previous" aria-label="Previous month" (click)="prayer.changeCalendarMonth(-1)"><app-icon name="chevron" [size]="16" /></button>
            <span>{{ currentMonthLabel() }} · {{ hijriMonthLabel() }}</span>
            <button type="button" class="month-nav" aria-label="Next month" (click)="prayer.changeCalendarMonth(1)"><app-icon name="chevron" [size]="16" /></button>
          </div>
          <div class="weekday-row" aria-hidden="true">
            @for (weekday of weekdays; track weekday) { <span>{{ weekday }}</span> }
          </div>
          <div class="calendar-grid">
            @for (day of calendarCells(); track $index) {
              @if (day) {
                <div class="calendar-day" [class.today]="day.isToday" [attr.aria-label]="day.englishDay + ' ' + day.month + ', Hijri ' + day.day">
                  <span class="day-date">{{ day.englishDay }}</span>
                  <span class="day-hijri">{{ day.day }}</span>
                </div>
              } @else {
                <div class="calendar-empty" aria-hidden="true"></div>
              }
            }
          </div>
          <div class="today-in-calendar">
          <div class="calendar-key"><span></span> Hijri date shown below each English date</div>
          <div style="
    margin-top: 12px;
"><span type="button" class="calendar-today" (click)="prayer.resetCalendarMonth()">Today</span></div>
          </div>
        </section>
      }
    }
  `,
  styles: [`

    .today-in-calendar{
    display: flex;
    justify-content: space-between;
    align-items: self-start;
    margin-top: 12px;}
    .city-picker-card {
      // display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px;
      // margin: 10px 18px 8px; padding: 8px; border: 1px solid var(--line); border-radius: var(--r-md);
      // background: linear-gradient(135deg, var(--card), var(--cloud)); box-shadow: 0 10px 24px rgba(18, 21, 28, 0.04);

      display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin: 0px 18px;
    padding: 0 8px;
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    background: linear-gradient(135deg, var(--card), var(--cloud));
    box-shadow: 0 10px 24px rgba(18, 21, 28, 0.04);
    font-size: 12px;
    }
    .picker-group {
      display: flex; min-width: 0; padding: 10px;
      border-radius: 12px; background: rgba(255,255,255,0.72);
    }
    .picker-row { display: flex; align-items: center; gap: 6px; min-width: 0; color: var(--emerald); }
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
    .calendar-overlay { position: fixed; z-index: 20; inset: 0; display: flex; align-items: center; justify-content: center; padding: 18px; background: rgba(18, 21, 28, .48); }
    .calendar-dialog { width: min(100%, 380px); max-height: calc(100dvh - 36px); overflow: auto; padding: 18px; border-radius: 20px; background: var(--card); box-shadow: 0 24px 60px rgba(18, 21, 28, .26); }
    .sheet-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
    .sheet-close {
      flex: 0 0 auto; width: 32px; height: 32px; border: 0; border-radius: 50%; background: var(--cloud); color: var(--ink-soft);
      font-size: 24px; line-height: 1; cursor: pointer;
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
    .tahajjud-card {
      position: relative; display: flex; align-items: center; gap: 12px;
      margin: 0 18px 12px; padding: 14px; overflow: hidden;
      border: 1px solid rgba(120, 101, 184, .22); border-radius: var(--r-md);
      background: linear-gradient(135deg, #17172f, #263158 58%, #35486a);
      color: #f7f3ff; box-shadow: 0 14px 28px rgba(23, 23, 47, .18);
    }
    .tahajjud-card::after {
      position: absolute; right: -28px; top: -36px; width: 108px; height: 108px;
      border: 18px solid rgba(255, 255, 255, .08); border-radius: 50%; content: '';
    }
    .tahajjud-orb {
      position: relative; z-index: 1; display: flex; align-items: center; justify-content: center;
      width: 46px; height: 46px; flex: 0 0 46px; border-radius: 14px;
      background: rgba(255, 255, 255, .13); color: #ffe9a8;
    }
    .tahajjud-copy { position: relative; z-index: 1; flex: 1; min-width: 0; }
    .tahajjud-kicker {
      margin-bottom: 3px; color: rgba(255, 233, 168, .9);
      font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase;
    }
    .tahajjud-copy .title-sm { color: #fff; }
    .tahajjud-copy p { margin: 4px 0 0; color: rgba(247, 243, 255, .72); font-size: 11px; line-height: 1.35; }
    .tahajjud-time {
      position: relative; z-index: 1; flex: 0 0 auto; padding: 7px 10px; border-radius: 999px;
      background: rgba(255, 255, 255, .14); color: #fff; font-size: 13px; font-weight: 850;
    }
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
    .calendar-tab { margin: 16px 18px 24px;
    padding: 16px 16px 0px 16px;
    border: 1px solid var(--line);
    border-radius: var(--r-md);
    background: var(--card);
    box-shadow: 0 10px 22px rgba(18, 21, 28, 0.04);}
    .calendar-tab-head { margin-bottom: 4px; }
    .calendar-month { display: flex; align-items: center; justify-content: space-between; margin: 18px 0 10px; color: var(--emerald-ink); font-size: 13px; font-weight: 800; text-align: center; }
    .month-nav { display: flex; align-items: center; justify-content: center; width: 30px; height: 30px; padding: 0; border: 1px solid var(--line); border-radius: 9px; background: var(--cloud); color: var(--emerald-ink); cursor: pointer; }
    .month-nav.previous { transform: rotate(180deg); }
    .calendar-today { display: block; margin: -3px auto 10px; padding: 5px 10px; border: 1px solid var(--line); border-radius: 999px; background: var(--card); color: var(--emerald-ink); font: inherit; font-size: 10px; font-weight: 800; cursor: pointer; }
    .weekday-row { display: grid; grid-template-columns: repeat(7, 1fr); margin-bottom: 5px; color: var(--ink-soft); font-size: 10px; font-weight: 700; text-align: center; }
    .calendar-grid {
      display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px;
    }
    .calendar-day {
      aspect-ratio: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2px;
      border: 1px solid var(--line); border-radius: 8px; background: var(--cloud);
    }
    .calendar-day.today { border-color: var(--emerald); background: var(--emerald); color: #fff; box-shadow: 0 4px 10px rgba(19, 112, 87, .22); }
    .day-date { font-size: 13px; font-weight: 800; }
    .day-hijri { font-size: 10px; font-weight: 700; color: var(--emerald-ink); }
    .calendar-day.today .day-hijri { color: rgba(255,255,255,.85); }
    .calendar-key { display: flex; align-items: center; gap: 6px; margin-top: 12px; color: var(--ink-soft); font-size: 10px; }
    .calendar-key span { width: 8px; height: 8px; border-radius: 50%; background: var(--emerald); }
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
  protected readonly weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  protected readonly calendarCells = computed(() => {
    const days = this.prayer.calendar();
    const [firstDay] = days;
    if (!firstDay) return [];

    const [day, month, year] = firstDay.date.split('-').map(Number);
    const leadingDays = new Date(year, month - 1, day).getDay();
    return [...Array.from({ length: leadingDays }, () => null), ...days];
  });
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
    this.showCalendarSheet.update((isOpen) => !isOpen);
  }

  protected closeCalendar(): void {
    this.showCalendarSheet.set(false);
  }

  protected currentMonthLabel(): string {
    return this.prayer.calendarMonth().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  protected hijriMonthLabel(): string {
    const firstDay = this.prayer.calendar()[0];
    if (!firstDay) return 'اسلامی مہینہ';

    const months = ['', 'محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی', 'جمادی الاول', 'جمادی الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذوالقعدہ', 'ذوالحجہ'];
    return `${months[firstDay.monthNumber] ?? firstDay.month} ${firstDay.year}`;
  }
}
