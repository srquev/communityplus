import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Business } from '../../core/models';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-business-card',
  imports: [RouterLink, IconComponent],
  template: `
    <a class="biz-card" [routerLink]="['/directory', business().id]">
      <div class="img">
        <app-icon [name]="business().categoryIcon" [size]="30" />
      </div>
      <div class="body">
        <div class="name">{{ business().name }}</div>
        <div class="cat">{{ business().category }} · {{ business().distanceKm }} km</div>
        <div class="stars">
          <app-icon name="star" [size]="12" />
          {{ business().rating }}
        </div>
      </div>
    </a>
  `,
  styles: [`
    .biz-card {
      flex-shrink: 0; width: 168px; display: block;
      background: var(--card); border: 1px solid var(--line); border-radius: 16px; overflow: hidden;
    }
    .img {
      height: 96px; background: linear-gradient(135deg, #ede6d6, #dcd2b8);
      display: flex; align-items: center; justify-content: center; color: #b8a876;
    }
    .body { padding: 10px 12px 12px; }
    .name { font-size: 13px; font-weight: 700; }
    .cat { font-size: 11px; color: var(--ink-soft); margin-top: 1px; }
    .stars { display: flex; align-items: center; gap: 4px; margin-top: 6px; font-size: 11px; color: var(--gold-ink); font-weight: 700; }
  `],
})
export class BusinessCardComponent {
  business = input.required<Business>();
}
