import { Location } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-header-bar',
  imports: [IconComponent],
  template: `
    @if (mode() === 'home') {
      <div class="header">
        <div class="header-content">
          <div class="place">
            <span class="brand-mark">C+</span>
          </div>
          <div class="location-card">
            <div class="select-pill">
              <div class="select-row">
                <app-icon name="pin" [size]="14" />
                <select class="city-select" aria-label="Location" [value]="user.selectedCityId()" (change)="onCityChange($event)">
                  @for (city of user.cities(); track city.id) {
                    <option [value]="city.id" [selected]="city.id === user.selectedCityId()">{{ city.name }}</option>
                  }
                </select>
              </div>
            </div>
            <span class="divider">|</span>
            <div class="select-pill">
              <div class="select-row">
                <app-icon name="mosque" [size]="14" />
                <select class="city-select" aria-label="Masjid" [value]="user.selectedMasjidId() ?? ''" (change)="onMasjidChange($event)">
                  @for (masjid of currentMasjids(); track masjid.id) {
                    <option [value]="masjid.id" [selected]="masjid.id === user.selectedMasjidId()">{{ masjid.name }}</option>
                  }
                </select>
              </div>
            </div>
          </div>
        </div>
        <!-- Bell action intentionally hidden for now. -->
        <!-- <div class="icons">
          <button type="button" class="icon-btn" (click)="bellClick.emit()"><app-icon name="bell" [size]="16" /></button>
        </div> -->
      </div>
    } @else {
      <div class="header">
        <button type="button" class="icon-btn" (click)="goBack()"><app-icon name="back" [size]="16" /></button>
        <div class="title">{{ title() }}</div>
        <button type="button" class="icon-btn" (click)="actionClick.emit()">
          @if (actionIcon()) { <app-icon [name]="actionIcon()" [size]="16" /> }
        </button>
      </div>
    }
  `,
  styles: [`
    .header { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 12px 18px 10px; }
    .header-content { display: flex; align-items: center; gap: 10px; min-width: 0; flex: 1; }
    .place { display: flex; align-items: center; flex: 0 0 auto; font-size: 13px; font-weight: 700; color: var(--emerald); }
    .brand-mark {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 24px;
      border-radius: 8px;
      background: var(--emerald-bg);
      color: var(--emerald);
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0;
    }
    .location-card {
      display: flex;
      align-items: center;
      margin: 0;
      border-left: 1px solid var(--line);
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      font-size: 12px;
      min-width: 0;
      flex: 1;
    }
    .select-row { display: flex; align-items: center; gap: 7px; min-width: 0; width: 100%; color: var(--emerald); }
    .select-pill {
      flex: 1 1 0;
      display: flex;
      min-width: 0;
      padding: 0 12px;
      border-radius: 0;
      background: transparent;
    }
    .select-pill + .select-pill { border-left: 1px solid var(--line); }
    .city-select {
      appearance: none;
      background: transparent;
      border: 0;
      color: var(--ink);
      font: inherit;
      font-size: 13px;
      font-weight: 800;
      line-height: 1;
      padding: 0 14px 0 0;
      outline: none;
      min-width: 0;
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      background-image:
        linear-gradient(45deg, transparent 50%, var(--ink-soft) 50%),
        linear-gradient(135deg, var(--ink-soft) 50%, transparent 50%);
      background-position:
        calc(100% - 7px) 50%,
        calc(100% - 3px) 50%;
      background-size: 4px 4px, 4px 4px;
      background-repeat: no-repeat;
    }
    .city-select option { color: var(--ink); }
    .divider { display: none; }
    .icons { display: flex; gap: 8px; }
    .title { font-size: 15px; font-weight: 700; color: var(--ink); }
    .icon-btn {
      width: 36px; height: 36px; border-radius: 12px; background: linear-gradient(135deg, var(--card), var(--cloud));
      border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; color: var(--ink);
      box-shadow: 0 8px 16px rgba(18, 21, 28, 0.04);
    }

    :host-context(app-home) .header,
    .header:has(.brand-mark) {
      margin: 2px 18px 8px;
      padding: 0;
      min-height: 38px;
      gap: 0;
      overflow: hidden;
      border: 1px solid #303030;
      border-color: var(--line);
      border-radius: 12px;
      background: color-mix(in srgb, var(--card) 92%, var(--emerald-bg));
      box-shadow: 0 10px 22px rgba(18, 21, 28, 0.05);
    }

    .header:has(.brand-mark) .header-content {
      gap: 0;
      height: 38px;
    }

    .header:has(.brand-mark) .place {
      width: 46px;
      height: 38px;
      justify-content: center;
    }

    .header:has(.brand-mark) .select-pill:first-child {
      max-width: 38%;
    }

    .header:has(.brand-mark) .select-pill:last-child {
      max-width: 62%;
    }

    @media (max-width: 380px) {
      .header:has(.brand-mark) {
        margin-inline: 12px;
      }

      .brand-mark {
        width: 30px;
        height: 23px;
        font-size: 11.5px;
      }

      .header:has(.brand-mark) .place {
        width: 42px;
      }

      .select-pill {
        padding-inline: 9px;
      }

      .city-select {
        font-size: 12px;
      }
    }
  `],
})
export class HeaderBarComponent {
  private readonly location = inject(Location);
  protected readonly user = inject(UserService);

  protected readonly currentMasjids = () => {
    const cityId = this.user.selectedCityId();
    return this.user.cityPrayerData().find((item) => item.id === cityId)?.masjids ?? [];
  };

  mode = input<'home' | 'page'>('page');
  city = input('');
  title = input('');
  actionIcon = input('');
  back = output<void>();
  actionClick = output<void>();
  searchClick = output<void>();
  bellClick = output<void>();

  protected goBack(): void {
    this.back.emit();
    this.location.back();
  }

  protected onCityChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    if (select?.value) {
      this.user.selectCity(select.value);
    }
  }

  protected onMasjidChange(event: Event): void {
    const select = event.target as HTMLSelectElement | null;
    if (select?.value) {
      this.user.selectMasjid(select.value);
    }
  }
}
