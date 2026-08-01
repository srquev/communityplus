import { Component, input } from '@angular/core';

export type BadgeVariant = 'emerald' | 'gold' | 'brick';

@Component({
  selector: 'app-badge',
  template: `<span class="badge" [class]="variant()"><ng-content /></span>`,
  styles: [`
    .badge { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: var(--r-pill); white-space: nowrap; }
    .emerald { background: var(--emerald-bg); color: var(--emerald-ink); }
    .gold { background: var(--gold-bg); color: var(--gold-ink); }
    .brick { background: var(--brick-bg); color: var(--brick); }
  `],
})
export class BadgeComponent {
  variant = input<BadgeVariant>('emerald');
}
