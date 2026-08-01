import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AppButtonComponent } from '../../shared/components/app-button.component';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { ListCardComponent } from '../../shared/components/list-card.component';
import { SectionHeaderComponent } from '../../shared/components/section-header.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, HeaderBarComponent, SectionHeaderComponent, ListCardComponent, AppButtonComponent, IconComponent],
  template: `
    <app-header-bar mode="page" title="Profile" actionIcon="settings" />

    <div class="card profile-card">
      <div class="avatar">{{ user.profile().initials }}</div>
      <div>
        <div class="title-sm" style="font-size: 15px;">{{ user.profile().name }}</div>
        <div class="meta">{{ user.profile().city }} · Member since {{ user.profile().memberSince }}</div>
      </div>
    </div>

    <div class="card stats-card">
      <div class="stat"><div class="title-sm">{{ user.profile().streak }}</div><div class="meta">day streak</div></div>
      <div class="rule"></div>
      <div class="stat"><div class="title-sm">₹{{ user.profile().donatedTotal }}</div><div class="meta">donated</div></div>
      <div class="rule"></div>
      <div class="stat"><div class="title-sm">{{ user.profile().badgeCount }}</div><div class="meta">badges</div></div>
    </div>

    <app-section-header title="Account" />
    <app-list-card icon="bell" title="Notifications">
      <app-icon trailing name="chevron" [size]="18" />
    </app-list-card>
    <a [routerLink]="['/onboarding']" style="text-decoration:none">
      <app-list-card icon="pin" title="City & language">
        <app-icon trailing name="chevron" [size]="18" />
      </app-list-card>
    </a>
    <a [routerLink]="['/directory']" style="text-decoration:none">
      <app-list-card icon="store" title="My business listing">
        <app-icon trailing name="chevron" [size]="18" />
      </app-list-card>
    </a>
    <app-list-card icon="gift" title="Donation history">
      <app-icon trailing name="chevron" [size]="18" />
    </app-list-card>
    <app-list-card icon="shield" title="Privacy & security">
      <app-icon trailing name="chevron" [size]="18" />
    </app-list-card>

    <div style="padding: 16px 18px 24px;">
      <app-button variant="outline">
        <app-icon name="logout" [size]="16" />
        Sign out
      </app-button>
    </div>
  `,
  styles: [`
    .profile-card { display: flex; align-items: center; gap: 14px; margin: 14px 18px 12px; }
    .avatar {
      width: 56px; height: 56px; border-radius: 50%; background: var(--emerald); color: #fff;
      display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 18px; flex-shrink: 0;
    }
    .title-sm { font-size: 13.5px; font-weight: 700; }
    .meta { font-size: 11.5px; color: var(--ink-soft); margin-top: 2px; }
    .stats-card { display: flex; justify-content: space-around; text-align: center; margin: 0 18px 12px; }
    .stat .title-sm { font-size: 16px; }
    .rule { width: 1px; background: var(--line); }
  `],
})
export class ProfileComponent {
  protected readonly user = inject(UserService);
}
