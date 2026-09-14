import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommunityService } from '../../core/services/community.service';
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
    IconComponent, RouterLink,
  ],
  template: `
    <main class="home-screen">
      <app-header-bar mode="home" [city]="user.profile().city" />

      <app-sky-band
        [band]="prayer.skyBand()"
        [tag]="prayer.nextPrayer().name"
        [time]="prayer.formatTime(prayer.nextPrayer().time)"
        [countdown]="prayer.countdownToNext()"
        [sub]="prayer.activePrayer().name + ' is active · Ramadan Day ' + prayer.ramadanDay()"
        [progress]="prayer.dayProgressPercent()"
      />

      <section class="today-strip" aria-label="Today summary">
        <div class="today-hadith">
          <div class="quote-icon"><app-icon name="quote" [size]="16" /></div>
          <div>
            <div class="hadith-brief-head">
              <span>Hadith of the Day</span>
              <a [routerLink]="['/hod']">Read more</a>
            </div>
            <p>{{ dailyHadith.text }}</p>
          </div>
        </div>

        <div class="briefing-rail">
          <div class="briefing-main">
            <span>{{ todayLabel }}</span>
            <strong>{{ prayer.activePrayer().name }} active</strong>
          </div>
          <div class="briefing-item">
            <span>Next</span>
            <strong>{{ prayer.nextPrayer().name }}</strong>
          </div>
          <div class="briefing-item">
            <span>Janazah</span>
            <strong>{{ community.janazahNotices().length }}</strong>
          </div>
          <div class="briefing-item">
            <span>Updates</span>
            <strong>{{ community.news().length }}</strong>
          </div>
        </div>
      </section>

      <section class="notice-section" aria-labelledby="janazah-title">
        <div class="home-section-head">
          <div>
            <span>Priority</span>
            <h3 id="janazah-title">Janazah notices</h3>
          </div>
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
          <div>
            <span>Community</span>
            <h3 id="updates-title">Latest updates</h3>
          </div>
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
          <!-- <a class="community-link" [routerLink]="['/community']">View community board</a> -->
        </div>
      </section>

      <section class="shortcut-section" aria-labelledby="shortcuts-title">
        <div class="compact-section-head">
          <span>Explore</span>
          <h3 id="shortcuts-title">Quick shortcuts</h3>
        </div>
        <app-quick-actions [actions]="quickActions" />
      </section>

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

    .today-strip {
      margin: 12px 18px 0;
      padding: 10px;
      border: 1px solid rgba(27, 75, 67, .12);
      border-radius: 20px;
      background:
        linear-gradient(145deg, rgba(255,255,255,.98), rgba(244,248,246,.9)),
        var(--card);
      box-shadow: 0 14px 28px rgba(18, 21, 28, .05);
    }

    .today-hadith {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      padding: 11px;
      border-radius: 16px;
      background: linear-gradient(135deg, var(--emerald-bg), rgba(255,255,255,.72));
    }

    .quote-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      flex: 0 0 32px;
      border-radius: 10px;
      background: rgba(27, 75, 67, .1);
      color: var(--emerald);
    }

    .today-hadith span,
    .briefing-rail span,
    .home-section-head span {
      color: var(--ink-soft);
      font-size: 10px;
      font-weight: 850;
      letter-spacing: .055em;
      text-transform: uppercase;
    }

    .hadith-brief-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .hadith-brief-head a {
      color: var(--emerald);
      font-size: 11.5px;
      font-weight: 850;
      white-space: nowrap;
    }

    .today-hadith p {
      margin: 3px 0 0;
      color: var(--ink);
      font-family: var(--font-display);
      font-size: 14px;
      font-weight: 550;
      line-height: 1.35;
    }

    .briefing-rail {
      display: grid;
      grid-template-columns: 1.4fr repeat(3, minmax(0, .72fr));
      gap: 1px;
      align-items: center;
      overflow: hidden;
      margin-top: 9px;
      border: 1px solid rgba(27, 75, 67, .08);
      border-radius: 15px;
      background: rgba(27, 75, 67, .08);
    }

    .briefing-main,
    .briefing-item {
      min-width: 0;
      padding: 9px 8px;
      background: rgba(255, 255, 255, .72);
    }

    .briefing-main strong,
    .briefing-item strong {
      display: block;
      overflow: hidden;
      margin-top: 3px;
      color: var(--ink);
      font-size: 13px;
      font-weight: 850;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .briefing-main strong {
      color: var(--emerald);
    }

    .briefing-item {
      text-align: center;
    }

    @media (max-width: 380px) {
      .briefing-rail {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .briefing-item {
        text-align: left;
      }
    }

    .notice-section {
      margin-top: 6px;
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
      margin-top: 2px;
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

    .update-banner.open {
      border-color: rgba(27, 75, 67, .28);
      background: linear-gradient(135deg, var(--card), var(--emerald-bg));
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
  `],
})
export class HomeComponent {
  protected readonly prayer = inject(PrayerService);
  protected readonly community = inject(CommunityService);
  protected readonly user = inject(UserService);
  protected readonly todayLabel = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  protected readonly dailyHadith = {
    topic: 'Intentions',
    text: 'Actions are but by intentions, and every person will have but that which they intended.',
    reference: 'Sahih al-Bukhari 1',
  };
  protected readonly janazahExpanded = signal(false);
  protected readonly updatesExpanded = signal(false);
  private readonly openJanazahNotices = signal<Set<string>>(new Set());
  private readonly openUpdates = signal<Set<string>>(new Set());

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
    // { icon: 'store', label: 'Business', route: '/directory' },
    // { icon: 'hand', label: 'Volunteer', route: '/community' },
    // { icon: 'gift', label: 'Donate', route: '/community' },
  ];

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
}
