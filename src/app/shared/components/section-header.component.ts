import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-section-header',
  template: `
    <div class="sec-head">
      <h3>{{ title() }}</h3>
      @if (linkLabel()) {
        <span class="link" (click)="linkClick.emit()">{{ linkLabel() }}</span>
      }
    </div>
  `,
  styles: [`
    .sec-head { display: flex; align-items: center; justify-content: space-between; padding: 18px 18px 8px; }
    h3 { font-size: 15px; font-weight: 700; }
    .link { font-size: 12px; color: var(--emerald); font-weight: 600; cursor: pointer; }
  `],
})
export class SectionHeaderComponent {
  title = input.required<string>();
  linkLabel = input<string>('');
  linkClick = output<void>();
}
