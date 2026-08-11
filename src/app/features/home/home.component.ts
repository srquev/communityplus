import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BusinessService } from '../../core/services/business.service';
import { CommunityService } from '../../core/services/community.service';
import { PrayerService } from '../../core/services/prayer.service';
import { UserService } from '../../core/services/user.service';
import { BusinessCardComponent } from '../../shared/components/business-card.component';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { ListCardComponent } from '../../shared/components/list-card.component';
import { QuickAction, QuickActionsComponent } from '../../shared/components/quick-actions.component';
import { SectionHeaderComponent } from '../../shared/components/section-header.component';
import { SkyBandComponent } from '../../shared/components/sky-band.component';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink, TitleCasePipe, HeaderBarComponent, SkyBandComponent, QuickActionsComponent,
    SectionHeaderComponent, ListCardComponent, BusinessCardComponent,
  ],
  template: `
    <app-header-bar mode="home" [city]="user.profile().city" />

    <app-sky-band
      [band]="prayer.skyBand()"
      [tag]="prayer.nextPrayer().name + ' in ' + prayer.minutesToNext() + ' minutes'"
      [time]="prayer.activePrayer().time"
      [sub]="'Ramadan · Day ' + prayer.ramadanDay() + ' · Iftar at ' + prayer.iftar()"
      [progress]="prayer.dayProgressPercent()"
    />

    <app-quick-actions [actions]="quickActions" />

    <app-section-header title="Latest updates" linkLabel="See all" [routerLink]="['/community']" />
    @for (post of community.news(); track post.id) {
      <app-list-card icon="megaphone" [title]="post.title" [meta]="post.postedAt" />
    }

    <!--
    <app-section-header title="Featured near you" linkLabel="See all" [routerLink]="['/directory']" />
    <div class="scroll-row" style="padding: 0 18px 6px;">
      @for (biz of business.featured(); track biz.id) {
        <app-business-card [business]="biz" />
      }
    </div>

    <app-section-header title="Community" linkLabel="See all" [routerLink]="['/community']" />

    -->
    <app-list-card icon="wall" title="Neki Ki Deewar" meta="14 items donated this week" />
  `,
})
export class HomeComponent {
  protected readonly prayer = inject(PrayerService);
  protected readonly business = inject(BusinessService);
  protected readonly community = inject(CommunityService);
  protected readonly user = inject(UserService);

  protected readonly quickActions: QuickAction[] = [
    { icon: 'moon', label: 'Prayer', route: '/prayer' },
    { icon: 'mosque', label: 'Mosques', route: '/mosques' },
    { icon: 'leaf', label: 'Janazah', route: '/community' },
    // { icon: 'store', label: 'Business', route: '/directory' },
    // { icon: 'hand', label: 'Volunteer', route: '/community' },
    // { icon: 'gift', label: 'Donate', route: '/community' },
  ];
}
