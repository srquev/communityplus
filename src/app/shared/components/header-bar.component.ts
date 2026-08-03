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
        <div class="place">
          <app-icon name="pin" [size]="14" />
          <select class="city-select" [value]="user.selectedCityId()" (change)="onCityChange($event)">
            @for (city of user.cities(); track city.id) {
              <option [value]="city.id">{{ city.name }}</option>
            }
          </select>
        </div>
        <div class="icons">
          <button type="button" class="icon-btn" (click)="searchClick.emit()"><app-icon name="search" [size]="16" /></button>
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
    .header { display: flex; align-items: center; justify-content: space-between; padding: 16px 18px 4px; }
    .place { display: flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 700; color: var(--emerald); }
    .city-select {
      background: transparent; border: 0; color: inherit; font: inherit; font-weight: 700;
      padding: 0; outline: none; min-width: 92px;
    }
    .city-select option { color: var(--ink); }
    .icons { display: flex; gap: 8px; }
    .title { font-size: 15px; font-weight: 700; }
    .icon-btn {
      width: 34px; height: 34px; border-radius: 11px; background: var(--card); border: 1px solid var(--line);
      display: flex; align-items: center; justify-content: center; color: var(--ink);
    }
  `],
})
export class HeaderBarComponent {
  private readonly location = inject(Location);
  protected readonly user = inject(UserService);

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
}
