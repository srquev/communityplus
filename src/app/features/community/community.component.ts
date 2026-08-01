import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { CommunityService } from '../../core/services/community.service';
import { AppButtonComponent } from '../../shared/components/app-button.component';
import { ChipOption, CategoryChipsComponent } from '../../shared/components/category-chips.component';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { ListCardComponent } from '../../shared/components/list-card.component';
import { SectionHeaderComponent } from '../../shared/components/section-header.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-community',
  imports: [
    DecimalPipe, HeaderBarComponent, CategoryChipsComponent, SectionHeaderComponent,
    ListCardComponent, AppButtonComponent, IconComponent,
  ],
  template: `
    <app-header-bar mode="page" title="Community" actionIcon="plus" />

    @for (n of community.janazahNotices(); track n.id) {
      <div class="card janazah">
        <app-icon name="leaf" [size]="22" />
        <div>
          <div class="title-sm">Janazah notice</div>
          <div class="meta">{{ n.name }} · {{ n.detail }}</div>
        </div>
      </div>
    }

    <app-category-chips [options]="sections" [(selectedId)]="activeSection" />

    <app-section-header title="Neki Ki Deewar" linkLabel="Give / Take" />
    <div class="scroll-row" style="padding: 0 18px 6px;">
      @for (item of community.nekiItems(); track item.id) {
        <div class="neki-card">
          <div class="img"><app-icon name="shirt" [size]="24" /></div>
          <div class="body">
            <div class="title-sm">{{ item.title }}</div>
            <div class="meta">Available · {{ item.distanceKm }} km</div>
          </div>
        </div>
      }
    </div>

    <app-section-header title="Volunteer services" />
    @for (v of community.volunteers(); track v.id) {
      <app-list-card [initials]="v.initials" [title]="v.name + ' — ' + v.service" [meta]="v.detail" />
    }

    <app-section-header title="Active donation campaigns" />
    @for (c of community.campaigns(); track c.id) {
      <div class="card" style="margin: 0 18px 12px;">
        <div class="title-sm">{{ c.title }}</div>
        <div class="progress-track">
          <div class="progress-fill" [style.width.%]="(c.raisedAmount / c.targetAmount) * 100"></div>
        </div>
        <div class="meta" style="margin-top: 6px;">
          ₹{{ c.raisedAmount | number }} raised of ₹{{ c.targetAmount | number }}
        </div>
        <div style="margin-top: 12px;">
          <app-button variant="gold">Donate now</app-button>
        </div>
      </div>
    }
  `,
  styles: [`
    .janazah {
      display: flex; gap: 10px; align-items: flex-start; margin: 14px 18px 4px;
      border-color: var(--brick); background: var(--brick-bg); color: var(--brick);
    }
    .janazah .title-sm { color: var(--brick); }
    .janazah .meta { color: #7d4234; margin-top: 2px; }
    .neki-card { flex-shrink: 0; width: 150px; background: var(--card); border: 1px solid var(--line); border-radius: 16px; overflow: hidden; }
    .neki-card .img { height: 80px; background: linear-gradient(135deg, #efe3c6, #e3d2a0); color: #a8925a; display: flex; align-items: center; justify-content: center; }
    .neki-card .body { padding: 10px 12px 12px; }
    .title-sm { font-size: 13.5px; font-weight: 700; }
    .meta { font-size: 11.5px; color: var(--ink-soft); margin-top: 2px; }
    .progress-track { height: 6px; border-radius: 99px; background: var(--line); margin-top: 10px; position: relative; }
    .progress-fill { position: absolute; left: 0; top: 0; height: 100%; border-radius: 99px; background: var(--gold); }
  `],
})
export class CommunityComponent {
  protected readonly community = inject(CommunityService);

  protected readonly sections: ChipOption[] = [
    { id: 'news', label: 'News', icon: 'chat' },
    { id: 'neki', label: 'Neki wall', icon: 'wall' },
    { id: 'volunteer', label: 'Volunteer', icon: 'hand' },
    { id: 'donate', label: 'Donate', icon: 'gift' },
  ];
  protected readonly activeSection = signal('news');
}
