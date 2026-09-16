import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { LoadingService } from './core/services/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    @if (loading.isLoading()) {
      <div class="app-loader" aria-live="polite" aria-label="Loading">
        <div class="app-loader__bar"></div>
        <div class="app-loader__panel">
          <span class="app-loader__mark"></span>
          <span class="app-loader__text">Loading</span>
        </div>
      </div>
    }
    <router-outlet />
  `,
  styles: [`
    .app-loader {
      position: fixed;
      inset: 0;
      z-index: 1000;
      pointer-events: none;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 18px;
      background: rgba(246, 247, 249, 0.18);
    }

    .app-loader__bar {
      position: fixed;
      top: 0;
      left: 0;
      height: 3px;
      width: 100%;
      overflow: hidden;
      background: rgba(27, 75, 67, 0.08);
    }

    .app-loader__bar::after {
      content: '';
      position: absolute;
      inset: 0;
      width: 42%;
      border-radius: 999px;
      background: linear-gradient(90deg, transparent, var(--emerald), var(--gold), transparent);
      animation: loader-slide 1s ease-in-out infinite;
    }

    .app-loader__panel {
      display: inline-flex;
      align-items: center;
      gap: 9px;
      padding: 9px 13px;
      border: 1px solid rgba(229, 232, 237, 0.86);
      border-radius: var(--r-pill);
      background: rgba(255, 255, 255, 0.84);
      box-shadow: 0 16px 36px rgba(18, 21, 28, 0.12);
      backdrop-filter: blur(18px);
    }

    .app-loader__mark {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: var(--emerald);
      box-shadow: 0 0 0 0 rgba(27, 75, 67, 0.28);
      animation: loader-pulse 1.2s ease-out infinite;
    }

    .app-loader__text {
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0;
      color: var(--emerald-ink);
    }

    @keyframes loader-slide {
      0% { transform: translateX(-110%); }
      100% { transform: translateX(250%); }
    }

    @keyframes loader-pulse {
      0% { box-shadow: 0 0 0 0 rgba(27, 75, 67, 0.28); }
      80%, 100% { box-shadow: 0 0 0 9px rgba(27, 75, 67, 0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .app-loader__bar::after,
      .app-loader__mark {
        animation: none;
      }
    }
  `],
})
export class AppComponent {
  protected readonly loading = inject(LoadingService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationStart || event instanceof RouteConfigLoadStart) {
        this.loading.start();
      }

      if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError ||
        event instanceof RouteConfigLoadEnd
      ) {
        this.loading.stop();
      }
    });
  }
}
