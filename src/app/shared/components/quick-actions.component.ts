import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

export interface QuickAction {
  icon: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-quick-actions',
  imports: [RouterLink, IconComponent],
  template: `
    <div class="quick-row">
      @for (action of actions(); track action.route) {
        <a class="chip" [routerLink]="action.route">
          <span class="bubble"><app-icon [name]="action.icon" [size]="22" /></span>
          <span class="label">{{ action.label }}</span>
        </a>
      }
    </div>
  `,
  styles: [`
    .quick-row { display: flex; gap: 10px; overflow-x: auto; padding: 16px 18px 6px; scrollbar-width: none; }
    .quick-row::-webkit-scrollbar { display: none; }
    .chip { flex-shrink: 0; width: 64px; display: flex; flex-direction: column; align-items: center; gap: 6px; }
    .bubble {
      width: 52px; height: 52px; border-radius: 16px; background: var(--card); border: 1px solid var(--line);
      display: flex; align-items: center; justify-content: center; color: var(--emerald);
    }
    .label { font-size: 10.5px; font-weight: 600; color: var(--ink-soft); text-align: center; }
  `],
})
export class QuickActionsComponent {
  actions = input.required<QuickAction[]>();
}
