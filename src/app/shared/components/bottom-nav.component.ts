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
        <a class="nav-item" [routerLink]="item.path" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
          <app-icon [name]="item.icon" [size]="22" />
          <span>{{ item.label }}</span>
        </a>
      }
    </nav>
  `,
  styles: [`
    .bottom-nav {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 2px;
      align-items: center;
      padding: 8px 8px calc(10px + env(safe-area-inset-bottom));
      background: rgba(255, 255, 255, .96);
      border-top: 1px solid var(--line);
      box-shadow: 0 -12px 28px rgba(18, 21, 28, .06);
      flex-shrink: 0;
    }
    .nav-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 4px;
      min-width: 0;
      min-height: 52px;
      border-radius: 14px;
      color: var(--ink-faint);
      transition: background .18s ease, color .18s ease;
    }
    .nav-item span {
      max-width: 100%;
      overflow: hidden;
      font-size: 10px;
      font-weight: 750;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .nav-item.active {
      background: var(--emerald-bg);
      color: var(--emerald);
    }
  `],
})
export class BottomNavComponent {
  readonly items: NavItem[] = [
    { path: '/home', icon: 'home', label: 'Home' },
    { path: '/prayer', icon: 'moon', label: 'Prayer' },
    { path: '/janazah', icon: 'leaf', label: 'Janazah' },
    { path: '/hod', icon: 'quote', label: 'Hadith' },
    { path: '/profile', icon: 'user', label: 'Profile' },
  ];
}
