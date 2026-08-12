import { Location } from '@angular/common';
import { Component, inject, input, output } from '@angular/core';
import { CITY_PRAYER_DATA } from '../../core/data/mock-data';
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
            <span class="brand-text">Community+</span>
          </div>
          <div class="location-card">
            <div class="select-pill">
              <div class="select-row">
                <app-icon name="pin" [size]="14" />
                <select class="city-select" aria-label="Location" [value]="user.selectedCityId()" (change)="onCityChange($event)">
                  @for (city of user.cities(); track city.id) {
                    <option [value]="city.id">{{ city.name }}</option>
                  }
                </select>
              </div>
            </div>
            <div class="divider"></div>
            <div class="select-pill">
              <div class="select-row">
                <app-icon name="mosque" [size]="14" />
                <select class="city-select" aria-label="Masjid" [value]="user.selectedMasjidId() ?? ''" (change)="onMasjidChange($event)">
                  @for (masjid of currentMasjids(); track masjid.id) {
                    <option [value]="masjid.id">{{ masjid.name }}</option>
                  }
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="icons">
          <!-- <button type="button" class="icon-btn" (click)="searchClick.emit()"><app-icon name="search" [size]="16" /></button> -->
          <button type="button" class="icon-btn" (click)="bellClick.emit()"><app-icon name="bell" [size]="16" /></button>
        </div>
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
    .brand-text { font-size: 14px; font-weight: 800; color: var(--ink); }
    .location-card {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      padding: 0 8px;
      border: 1px solid var(--line);
      border-radius: 16px;
      background: linear-gradient(135deg, var(--card), var(--cloud));
      box-shadow: 0 10px 20px rgba(18, 21, 28, 0.04);
      font-size: 12px;
      min-width: 0;
      flex: 1;
    }
    .select-row { display: flex; align-items: center; gap: 4px; min-width: 0; color: var(--emerald); }
    .select-pill {
      flex: 1; display: flex; min-width: 0; padding: 9px 8px;
      border-radius: 12px; background: rgba(255,255,255,0.72);
    }
    .city-select {
      background: transparent; border: 0; color: var(--ink); font: inherit; font-weight: 700;
      padding: 0; outline: none; min-width: 0; width: 100%;
      
    }
    .city-select option { color: var(--ink); }
    .divider { width: 1px; align-self: stretch; background: var(--line); }
    .icons { display: flex; gap: 8px; }
    .title { font-size: 15px; font-weight: 700; color: var(--ink); }
    .icon-btn {
      width: 36px; height: 36px; border-radius: 12px; background: linear-gradient(135deg, var(--card), var(--cloud));
      border: 1px solid var(--line); display: flex; align-items: center; justify-content: center; color: var(--ink);
      box-shadow: 0 8px 16px rgba(18, 21, 28, 0.04);
    }
  `],
})
export class HeaderBarComponent {
  private readonly location = inject(Location);
  protected readonly user = inject(UserService);

  protected readonly currentMasjids = () => {
    const cityId = this.user.selectedCityId();
    return CITY_PRAYER_DATA.find((item) => item.id === cityId)?.masjids ?? [];
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
