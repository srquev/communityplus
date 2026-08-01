import { Component, input, model } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

export interface ChipOption {
  id: string;
  label: string;
  icon: string;
}

@Component({
  selector: 'app-category-chips',
  imports: [IconComponent],
  template: `
    <div class="grid" [style.gridTemplateColumns]="'repeat(' + columns() + ', 1fr)'">
      @for (opt of options(); track opt.id) {
        <button type="button" class="chip" [class.on]="opt.id === selectedId()" (click)="selectedId.set(opt.id)">
          <app-icon [name]="opt.icon" [size]="20" />
          <span>{{ opt.label }}</span>
        </button>
      }
    </div>
  `,
  styles: [`
    .grid { display: grid; gap: 10px; padding: 6px 18px 4px; }
    .chip {
      display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 4px;
      border-radius: 14px; background: var(--card); border: 1px solid var(--line);
      color: var(--emerald); font-family: inherit;
    }
    .chip span { font-size: 9.5px; font-weight: 700; color: var(--ink-soft); }
    .chip.on { background: var(--emerald); border-color: var(--emerald); color: #fff; }
    .chip.on span { color: #fff; }
  `],
})
export class CategoryChipsComponent {
  options = input.required<ChipOption[]>();
  columns = input(4);
  selectedId = model('');
}
