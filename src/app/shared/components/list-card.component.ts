import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-list-card',
  imports: [IconComponent],
  template: `
    <div class="row-card">
      @if (icon()) {
        <div class="thumb">
          <app-icon [name]="icon()" [size]="22" />
        </div>
      } @else if (initials()) {
        <div class="avatar">{{ initials() }}</div>
      }
      <div class="body">
        <div class="title-sm">{{ title() }}</div>
        @if (meta()) {
          <div class="meta">{{ meta() }}</div>
        }
      </div>
      <ng-content select="[trailing]" />
    </div>
  `,
  styles: [`
    .row-card {
      display: flex; gap: 12px; align-items: center;
      background: var(--card); border: 1px solid var(--line); border-radius: var(--r-md);
      padding: 14px; margin: 0 18px 10px;
    }
    .thumb {
      width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
      background: var(--emerald-bg); color: var(--emerald);
      display: flex; align-items: center; justify-content: center;
    }
    .avatar {
      width: 44px; height: 44px; border-radius: 50%; flex-shrink: 0;
      background: var(--emerald); color: #fff; font-weight: 700; font-size: 14px;
      display: flex; align-items: center; justify-content: center;
    }
    .body { flex: 1; min-width: 0; }
    .title-sm { font-size: 13.5px; font-weight: 700; }
    .meta { font-size: 11.5px; color: var(--ink-soft); margin-top: 2px; }
  `],
})
export class ListCardComponent {
  icon = input('');
  initials = input('');
  title = input.required<string>();
  meta = input('');
}
