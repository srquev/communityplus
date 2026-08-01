import { Component, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'outline' | 'gold';

@Component({
  selector: 'app-button',
  template: `
    <button type="button" class="btn" [class]="variant()" (click)="pressed.emit()">
      <ng-content />
    </button>
  `,
  styles: [`
    .btn {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      width: 100%; border: none; border-radius: var(--r-sm);
      padding: 13px; font-size: 13.5px; font-weight: 700; font-family: inherit;
    }
    .primary { background: var(--emerald); color: #fff; }
    .gold { background: var(--gold); color: #fff; }
    .outline { background: transparent; border: 1.5px solid var(--emerald); color: var(--emerald); }
  `],
})
export class AppButtonComponent {
  variant = input<ButtonVariant>('primary');
  pressed = output<void>();
}
