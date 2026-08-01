import { Component, ViewEncapsulation, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONS } from './icon-registry';

@Component({
  selector: 'app-icon',
  template: `<span class="app-icon" [style.width.px]="size()" [style.height.px]="size()" [innerHTML]="svg()"></span>`,
  // Content is injected via [innerHTML], which bypasses Angular's emulated
  // view-encapsulation attribute, so a scoped ".app-icon svg" selector would
  // never match the injected node. ViewEncapsulation.None keeps this rule
  // global but scoped safely by the .app-icon class name.
  encapsulation: ViewEncapsulation.None,
  styles: [`
    .app-icon { display: inline-flex; align-items: center; justify-content: center; color: inherit; flex-shrink: 0; }
    .app-icon svg { width: 100%; height: 100%; }
  `],
})
export class IconComponent {
  private readonly sanitizer = inject(DomSanitizer);

  name = input.required<string>();
  size = input<number>(20);

  protected readonly svg = computed(() => this.sanitizer.bypassSecurityTrustHtml(ICONS[this.name()] ?? ''));
}
