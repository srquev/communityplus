import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../icon/icon.component';

interface NavItem {
  path: string;
  icon: string;
  label: string;
}

@Component({
  selector: 'app-bottom-nav',
  imports: [RouterLink, RouterLinkActive, IconComponent],
  template: `
    <nav class="bottom-nav">
      @for (item of items; track item.path) {
        <a class="nav-item" [routerLink]="item.path" routerLinkActive="active">
          <app-icon [name]="item.icon" [size]="22" />
          <span>{{ item.label }}</span>
        </a>
      }
    </nav>
  `,
  styles: [`
    .bottom-nav {
      display: flex; justify-content: space-around; align-items: center;
      padding: 10px 6px calc(14px + env(safe-area-inset-bottom));
      background: var(--card); border-top: 1px solid var(--line); flex-shrink: 0;
    }
    .nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; color: var(--ink-faint); }
    .nav-item span { font-size: 10px; font-weight: 600; }
    .nav-item.active { color: var(--emerald); }
  `],
})
export class BottomNavComponent {
  readonly items: NavItem[] = [
    { path: '/home', icon: 'home', label: 'Home' },
    // { path: '/directory', icon: 'compass', label: 'Directory' },
    { path: '/prayer', icon: 'moon', label: 'Prayer' },
    // { path: '/community', icon: 'chat', label: 'Community' },
    { path: '/quiz', icon: 'quiz', label: 'Quiz' },
    { path: '/hod', icon: 'quote', label: 'HOD' },
    { path: '/profile', icon: 'user', label: 'Profile' },
  ];
}
