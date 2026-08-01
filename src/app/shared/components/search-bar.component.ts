import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-search-bar',
  imports: [FormsModule, IconComponent],
  template: `
    <label class="search-bar">
      <app-icon name="search" [size]="17" />
      <input type="text" [placeholder]="placeholder()" [(ngModel)]="value" />
    </label>
  `,
  styles: [`
    .search-bar {
      display: flex; align-items: center; gap: 8px; margin: 4px 18px 12px; padding: 11px 14px;
      background: var(--card); border: 1px solid var(--line); border-radius: 14px; color: var(--ink-faint);
    }
    input {
      border: none; outline: none; background: transparent; flex: 1;
      font-size: 13px; font-family: inherit; color: var(--ink);
    }
    input::placeholder { color: var(--ink-faint); }
  `],
})
export class SearchBarComponent {
  placeholder = input('Search...');
  value = model('');
}
