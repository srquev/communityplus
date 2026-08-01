import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-tabs',
  template: `
    <div class="tabs">
      @for (t of tabs(); track t) {
        <div class="tab" [class.on]="t === active()" (click)="active.set(t)">{{ t }}</div>
      }
    </div>
  `,
  styles: [`
    .tabs { display: flex; gap: 6px; margin: 6px 18px 12px; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 4px; }
    .tab { flex: 1; text-align: center; padding: 8px; font-size: 12px; font-weight: 700; color: var(--ink-soft); border-radius: 9px; }
    .tab.on { background: var(--emerald); color: #fff; }
  `],
})
export class TabsComponent {
  tabs = input.required<string[]>();
  active = model.required<string>();
}
