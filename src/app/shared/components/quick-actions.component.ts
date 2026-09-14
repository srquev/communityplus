import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

export interface QuickAction {
  icon: string;
  label: string;
  route?: string;
  action?: string;
  description?: string;
}

@Component({
  selector: 'app-quick-actions',
  imports: [RouterLink, IconComponent],
  template: `
    <div class="quick-row">
      @for (action of actions(); track action.route ?? action.action ?? action.label) {
        @if (action.route) {
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
        } @else {
          <button type="button" class="chip" (click)="actionSelected.emit(action)">
            <span class="bubble"><app-icon [name]="action.icon" [size]="22" /></span>
            <span class="copy">
              <span class="label">{{ action.label }}</span>
              @if (action.description) {
                <span class="description">{{ action.description }}</span>
              }
            </span>
            <app-icon class="chevron" name="chevron" [size]="15" />
          </button>
        }
      }
    </div>
  `,
  styles: [`
    .quick-row {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 8px;
      padding: 0 18px 4px;
    }
    .chip {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 8px;
      min-width: 0;
      min-height: 86px;
      padding: 10px 6px;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: var(--card);
      color: inherit;
      font: inherit;
      box-shadow: 0 8px 18px rgba(18, 21, 28, .03);
      text-align: center;
    }
    .bubble {
      width: 36px; height: 36px; flex: 0 0 36px; border-radius: 12px; background: var(--emerald-bg);
      display: flex; align-items: center; justify-content: center; color: var(--emerald);
    }
    .copy { display: flex; min-width: 0; max-width: 100%; flex-direction: column; gap: 2px; }
    .label { max-width: 100%; overflow: hidden; color: var(--ink); font-size: 12px; font-weight: 850; text-overflow: ellipsis; white-space: nowrap; }
    .description { max-width: 100%; overflow: hidden; color: var(--ink-soft); font-size: 10px; font-weight: 650; text-overflow: ellipsis; white-space: nowrap; }
    .chevron { display: none; }
  `],
})
export class QuickActionsComponent {
  actions = input.required<QuickAction[]>();
  actionSelected = output<QuickAction>();
}
