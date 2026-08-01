import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BottomNavComponent } from '../shared/components/bottom-nav.component';

// Default layout for the main app routes: scrollable content area + the
// persistent bottom tab bar. Onboarding sits outside this shell.
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, BottomNavComponent],
  template: `
    <div class="app-shell">
      <div class="app-content">
        <router-outlet />
      </div>
      <app-bottom-nav />
    </div>
  `,
  styles: [`
    .app-shell {
      max-width: var(--max-app-width);
      margin: 0 auto;
      height: 100dvh;
      display: flex;
      flex-direction: column;
      background: var(--cloud);
      box-shadow: 0 0 40px rgba(0,0,0,.08);
    }
    .app-content { flex: 1; overflow-y: auto; }
  `],
})
export class ShellComponent {}
