import { Component, computed, inject, signal } from '@angular/core';
import { CommunityService } from '../../core/services/community.service';
import { HadithService } from '../../core/services/hadith.service';
import { PrayerService } from '../../core/services/prayer.service';
import { UserService } from '../../core/services/user.service';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { QuickAction, QuickActionsComponent } from '../../shared/components/quick-actions.component';
import { SkyBandComponent } from '../../shared/components/sky-band.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-home',
  imports: [
    HeaderBarComponent, SkyBandComponent, QuickActionsComponent,
    IconComponent,
  ],
  template: `
    <main class="home-screen">
      <app-header-bar mode="home" [city]="user.profile().city" />

      <app-sky-band
        [band]="prayer.skyBand()"
        [tag]="prayer.displayPrayerName(prayer.nextPrayer().name)"
        [time]="prayer.formatTime(prayer.nextPrayer().time)"
        [countdown]="prayer.countdownToNext()"
        [dateLabel]="prayer.currentDateTimeLabel()"
        [hijriDate]="prayer.currentHijriDateDisplay()"
        [countdownTone]="prayer.countdownTone()"
        [milestones]="prayer.prayerMilestones()"
        [hadithText]="hadith.selectedHadith().text"
      />

      <section class="notice-section" aria-labelledby="janazah-title">
        <div class="home-section-head">
          <h3 id="janazah-title">Janazah Notices</h3>
          @if (extraJanazahCount() > 0) {
            <button type="button" class="count-pill" (click)="toggleJanazahExpanded()" [attr.aria-expanded]="janazahExpanded()">
              {{ janazahExpanded() ? 'Top 2' : '+' + extraJanazahCount() }}
              <app-icon name="chevron" [size]="14" />
            </button>
          }
        </div>

        <div class="banner-stack">
          @for (notice of visibleJanazah(); track notice.id) {
            <button type="button" class="notice-card janazah-banner" [class.open]="isJanazahOpen(notice.id)" (click)="toggleJanazahNotice(notice.id)" [attr.aria-expanded]="isJanazahOpen(notice.id)">
              <div class="banner-icon"><app-icon name="leaf" [size]="20" /></div>
              <div class="banner-body">
                <div class="banner-kicker">{{ notice.prayerName }} · {{ notice.prayerTime }}</div>
                <div class="banner-title">{{ notice.name }}</div>
                <div class="banner-meta">{{ notice.masjidName }} · {{ notice.qabristanName }}</div>
                @if (isJanazahOpen(notice.id)) {
                  <div class="notice-details">
                    <div class="detail-row">
                      <span>Masjid</span>
                      <strong>{{ notice.masjidName }}</strong>
                      <small>{{ notice.masjidAddress }}</small>
                    </div>
                    <div class="detail-row">
                      <span>Qabristan</span>
                      <strong>{{ notice.qabristanName }}</strong>
                      <small>{{ notice.qabristanAddress }}</small>
                    </div>
                    @if (notice.notes) {
                      <p>{{ notice.notes }}</p>
                    }
                  </div>
                }
              </div>
              <app-icon class="chevron" name="chevron" [size]="16" />
            </button>
          }
        </div>
      </section>

      <section class="notice-section updates-section" aria-labelledby="updates-title">
        <div class="home-section-head">
          <h3 id="updates-title">Updates</h3>
          @if (extraUpdatesCount() > 0) {
            <button type="button" class="count-pill emerald" (click)="toggleUpdatesExpanded()" [attr.aria-expanded]="updatesExpanded()">
              {{ updatesExpanded() ? 'Top 2' : '+' + extraUpdatesCount() }}
              <app-icon name="chevron" [size]="14" />
            </button>
          }
        </div>

        <div class="banner-stack">
          @for (post of visibleUpdates(); track post.id) {
            <button type="button" class="notice-card update-banner" [class.open]="isUpdateOpen(post.id)" (click)="toggleUpdate(post.id)" [attr.aria-expanded]="isUpdateOpen(post.id)">
              <div class="banner-icon"><app-icon name="megaphone" [size]="20" /></div>
              <div class="banner-body">
                <div class="banner-kicker">{{ post.postedAt }}</div>
                <div class="banner-title">{{ post.title }}</div>
                @if (isUpdateOpen(post.id)) {
                  <p>{{ post.body }}</p>
                }
              </div>
              <app-icon class="chevron" name="chevron" [size]="16" />
            </button>
          }
        </div>
      </section>

      <section class="shortcut-section" aria-labelledby="shortcuts-title">
        <div class="compact-section-head">
          <span>Explore</span>
          <h3 id="shortcuts-title">Quick shortcuts</h3>
        </div>
        <app-quick-actions [actions]="quickActions" (actionSelected)="onQuickAction($event)" />
      </section>

      @if (showCalendarSheet()) {
        <div class="calendar-overlay" (click)="closeCalendar()">
          <section class="calendar-dialog" role="dialog" aria-modal="true" aria-labelledby="home-calendar-title" (click)="$event.stopPropagation()">
            <div class="sheet-head">
              <div>
                <div class="calendar-meta">Today in the Islamic calendar</div>
                <div class="calendar-title" id="home-calendar-title">{{ prayer.hijriDate() }}</div>
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
          </section>
        </div>
      }

      <!-- <a class="neki-card" [routerLink]="['/community']">
        <div class="banner-icon"><app-icon name="wall" [size]="20" /></div>
        <div>
          <div class="banner-title">Neki Ki Deewar</div>
          <div class="banner-meta">14 items donated this week</div>
        </div>
      </a> -->
    </main>

  `,
  styles: [`
    .home-screen {
      padding-bottom: 22px;
    }

    .notice-section {
      margin-top: 8px;
    }

    .shortcut-section {
      margin-top: 20px;
    }

    .compact-section-head {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 12px;
      padding: 0 18px 8px;
    }

    .compact-section-head span {
      color: var(--ink-soft);
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: .05em;
      text-transform: uppercase;
    }

    .compact-section-head h3 {
      margin-top: 2px;
      font-size: 15px;
      font-weight: 850;
    }

    .updates-section {
      margin-top: 4px;
    }

    .banner-stack {
      display: flex;
      flex-direction: column;
      gap: 8px;
      padding: 0 18px;
    }

    .home-section-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 18px 18px 8px;
    }

    .home-section-head h3 {
      font-size: 17px;
      font-weight: 850;
      letter-spacing: 0;
    }

    .count-pill {
      display: inline-flex;
      align-items: center;
      gap: 2px;
      min-height: 28px;
      border: 1px solid rgba(184, 90, 69, .22);
      border-radius: var(--r-pill);
      background: var(--brick-bg);
      color: var(--brick);
      padding: 0 9px 0 11px;
      font-size: 11.5px;
      font-weight: 850;
    }

    .count-pill.emerald {
      border-color: rgba(27, 75, 67, .22);
      background: var(--emerald-bg);
      color: var(--emerald);
    }

    .count-pill app-icon {
      transform: rotate(90deg);
      transition: transform .18s ease;
    }

    .count-pill[aria-expanded="true"] app-icon {
      transform: rotate(-90deg);
    }

    .notice-card,
    .neki-card {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: var(--card);
      color: var(--ink);
      padding: 13px 12px;
      text-align: left;
      box-shadow: 0 8px 18px rgba(18, 21, 28, 0.035);
      transition: border-color .18s ease, background .18s ease, box-shadow .18s ease;
    }

    .janazah-banner {
      border-color: rgba(184, 90, 69, .24);
      background: linear-gradient(135deg, var(--brick-bg), #fff);
    }

    .notice-card.open {
      align-items: flex-start;
      box-shadow: 0 12px 24px rgba(18, 21, 28, .06);
    }

    .banner-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      flex: 0 0 40px;
      border-radius: 12px;
      background: var(--emerald-bg);
      color: var(--emerald);
    }

    .janazah-banner .banner-icon {
      background: rgba(184, 90, 69, .12);
      color: var(--brick);
    }

    .update-banner.open {
      border-color: rgba(27, 75, 67, .28);
      background: linear-gradient(135deg, var(--card), var(--emerald-bg));
    }

    .banner-body {
      flex: 1;
      min-width: 0;
    }

    .banner-kicker {
      color: var(--ink-soft);
      font-size: 10.5px;
      font-weight: 800;
      letter-spacing: .04em;
      text-transform: uppercase;
    }

    .banner-title {
      margin-top: 2px;
      font-size: 14px;
      font-weight: 800;
    }

    .banner-meta,
    .update-banner p,
    .notice-details p {
      margin-top: 3px;
      color: var(--ink-soft);
      font-size: 11.5px;
      line-height: 1.35;
    }

    .chevron {
      color: var(--ink-faint);
      transition: transform .18s ease, color .18s ease;
    }

    .notice-card.open .chevron {
      color: var(--ink-soft);
      transform: rotate(90deg);
    }

    .notice-details {
      display: grid;
      gap: 8px;
      margin-top: 10px;
      padding-top: 10px;
      border-top: 1px solid rgba(184, 90, 69, .18);
    }

    .detail-row {
      display: grid;
      gap: 2px;
      padding: 8px;
      border-radius: 10px;
      background: rgba(255, 255, 255, .55);
    }

    .notice-details span {
      color: var(--brick);
      font-size: 10px;
      font-weight: 850;
      letter-spacing: .04em;
      text-transform: uppercase;
    }

    .notice-details strong {
      color: var(--ink);
      font-size: 12.5px;
    }

    .notice-details small {
      color: var(--ink-soft);
      font-size: 11px;
      line-height: 1.35;
    }

    .neki-card {
      margin: 14px 18px 18px;
    }

    .calendar-overlay {
      position: fixed;
      z-index: 40;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px;
      background: rgba(18, 21, 28, .48);
    }

    .calendar-dialog {
      width: min(100%, 380px);
      max-height: calc(100dvh - 36px);
      overflow: auto;
      padding: 18px;
      border-radius: 20px;
      background: var(--card);
      box-shadow: 0 24px 60px rgba(18, 21, 28, .26);
    }

    .sheet-head,
    .calendar-month {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }

    .sheet-close {
      flex: 0 0 auto;
      width: 32px;
      height: 32px;
      border: 0;
      border-radius: 50%;
      background: var(--cloud);
      color: var(--ink-soft);
      font-size: 24px;
      line-height: 1;
    }

    .calendar-meta {
      color: var(--ink-soft);
      font-size: 10px;
      font-weight: 850;
      letter-spacing: .055em;
      text-transform: uppercase;
    }

    .calendar-title {
      margin-top: 2px;
      color: var(--ink);
      font-size: 15px;
      font-weight: 850;
    }

    .calendar-month {
      align-items: center;
      margin: 18px 0 10px;
      color: var(--emerald-ink);
      font-size: 13px;
      font-weight: 800;
      text-align: center;
    }

    .month-nav {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30px;
      height: 30px;
      padding: 0;
      border: 1px solid var(--line);
      border-radius: 9px;
      background: var(--cloud);
      color: var(--emerald-ink);
    }

    .month-nav.previous {
      transform: rotate(180deg);
    }

    .calendar-today {
      display: block;
      margin: -3px auto 10px;
      padding: 5px 10px;
      border: 1px solid var(--line);
      border-radius: 999px;
      background: var(--card);
      color: var(--emerald-ink);
      font: inherit;
      font-size: 10px;
      font-weight: 800;
    }

    .weekday-row,
    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, minmax(0, 1fr));
    }

    .weekday-row {
      margin-bottom: 5px;
      color: var(--ink-soft);
      font-size: 10px;
      font-weight: 700;
      text-align: center;
    }

    .calendar-grid {
      gap: 4px;
    }

    .calendar-day {
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      border: 1px solid var(--line);
      border-radius: 8px;
      background: var(--cloud);
    }

    .calendar-day.today {
      border-color: var(--emerald);
      background: var(--emerald);
      color: #fff;
      box-shadow: 0 4px 10px rgba(19, 112, 87, .22);
    }

    .day-date {
      font-size: 13px;
      font-weight: 800;
    }

    .day-hijri {
      color: var(--emerald-ink);
      font-size: 10px;
      font-weight: 700;
    }

    .calendar-day.today .day-hijri {
      color: rgba(255,255,255,.85);
    }
  `],
})
export class HomeComponent {
  protected readonly prayer = inject(PrayerService);
  protected readonly community = inject(CommunityService);
  protected readonly hadith = inject(HadithService);
  protected readonly user = inject(UserService);
  protected readonly todayLabel = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  protected readonly weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  protected readonly showCalendarSheet = signal(false);
  protected readonly janazahExpanded = signal(false);
  protected readonly updatesExpanded = signal(false);
  private readonly openJanazahNotices = signal<Set<string>>(new Set());
  private readonly openUpdates = signal<Set<string>>(new Set());
  protected readonly calendarCells = computed(() => {
    const days = this.prayer.calendar();
    const [firstDay] = days;
    if (!firstDay) return [];

    const [day, month, year] = firstDay.date.split('-').map(Number);
    const leadingDays = new Date(year, month - 1, day).getDay();
    return [...Array.from({ length: leadingDays }, () => null), ...days];
  });

  protected readonly visibleJanazah = computed(() => {
    const notices = this.community.janazahNotices();
    return this.janazahExpanded() ? notices : notices.slice(0, 2);
  });

  protected readonly extraJanazahCount = computed(() => Math.max(this.community.janazahNotices().length - 2, 0));

  protected readonly visibleUpdates = computed(() => {
    const updates = this.community.news();
    return this.updatesExpanded() ? updates : updates.slice(0, 2);
  });

  protected readonly extraUpdatesCount = computed(() => Math.max(this.community.news().length - 2, 0));

  protected readonly quickActions: QuickAction[] = [
    { icon: 'mosque', label: 'Mosques', route: '/mosques', description: 'Nearby masjids' },
    { icon: 'quiz', label: 'Quiz', route: '/quiz', description: 'Daily learning' },
    { icon: 'calendar', label: 'Calendar', action: 'calendar', description: 'Hijri dates' },
    // { icon: 'store', label: 'Business', route: '/directory' },
    // { icon: 'hand', label: 'Volunteer', route: '/community' },
    // { icon: 'gift', label: 'Donate', route: '/community' },
  ];

  constructor() {
    this.user.loadCommunityPrayerData().subscribe({
      next: (response) => console.log('loadCommunityPrayerData response:', response),
      error: (error) => console.error('loadCommunityPrayerData error:', error),
    });

    this.hadith.loadHadithOfDay().subscribe({
      next: (response) => console.log('loadHadithOfDay response:', response),
      error: (error) => console.error('loadHadithOfDay error:', error),
    });
  }

  protected toggleJanazahExpanded(): void {
    this.janazahExpanded.update((isExpanded) => !isExpanded);
  }

  protected toggleUpdatesExpanded(): void {
    this.updatesExpanded.update((isExpanded) => !isExpanded);
  }

  protected isJanazahOpen(id: string): boolean {
    return this.openJanazahNotices().has(id);
  }

  protected toggleJanazahNotice(id: string): void {
    this.openJanazahNotices.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  protected isUpdateOpen(id: string): boolean {
    return this.openUpdates().has(id);
  }

  protected toggleUpdate(id: string): void {
    this.openUpdates.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  protected onQuickAction(action: QuickAction): void {
    if (action.action === 'calendar') this.showCalendarSheet.set(true);
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
