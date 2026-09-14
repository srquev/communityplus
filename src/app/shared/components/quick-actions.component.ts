import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

export interface QuickAction {
  icon: string;
  label: string;
  route: string;
  description?: string;
}

@Component({
  selector: 'app-quick-actions',
  imports: [RouterLink, IconComponent],
  template: `
    <div class="quick-row">
      @for (action of actions(); track action.route) {
        <a class="chip" [routerLink]="action.route">
          <span class="bubble"><app-icon [name]="action.icon" [size]="22" /></span>
          <span class="copy">
            <span class="label">{{ action.label }}</span>
            @if (action.description) {
              <span class="description">{{ action.description }}</span>
            }
          </span>
          <app-icon class="chevron" name="chevron" [size]="15" />
        </a>
      }
    </div>
  `,
  styles: [`
    .quick-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 8px;
      padding: 0 18px 4px;
    }
    .chip {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: 10px;
      min-width: 0;
      min-height: 64px;
      padding: 10px;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: var(--card);
      box-shadow: 0 8px 18px rgba(18, 21, 28, .03);
    }
    .bubble {
      width: 38px; height: 38px; flex: 0 0 38px; border-radius: 12px; background: var(--emerald-bg);
      display: flex; align-items: center; justify-content: center; color: var(--emerald);
    }
    .copy { display: flex; flex: 1; min-width: 0; max-width: 100%; flex-direction: column; gap: 2px; }
    .label { max-width: 100%; overflow: hidden; color: var(--ink); font-size: 12px; font-weight: 850; text-overflow: ellipsis; white-space: nowrap; }
    .description { max-width: 100%; overflow: hidden; color: var(--ink-soft); font-size: 10px; font-weight: 650; text-overflow: ellipsis; white-space: nowrap; }
    .chevron { display: block; color: var(--ink-faint); }
  `],
})
export class QuickActionsComponent {
  actions = input.required<QuickAction[]>();
}
