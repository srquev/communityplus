import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { AppButtonComponent } from '../../shared/components/app-button.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-city-select',
  imports: [AppButtonComponent, IconComponent],
  template: `
    <div class="onboarding-shell">
      <div class="intro">
        <div class="badge-icon"><app-icon name="mosque" [size]="30" /></div>
        <h2>Which city do you call home?</h2>
        <p>We'll tailor prayer times, mosques and businesses to your city.</p>
      </div>

      <div class="cities">
        @for (city of user.cities(); track city.id) {
          <button type="button" class="city-row" [class.on]="city.id === user.selectedCityId()" (click)="user.selectCity(city.id)">
            <span class="left"><app-icon name="pin" [size]="16" /> {{ city.name }}</span>
            @if (city.id === user.selectedCityId()) {
              <app-icon name="check" [size]="16" />
            }
          </button>
        }
      </div>

      <div class="cta">
        <app-button variant="primary" (pressed)="continue()">
          Continue
        </app-button>
      </div>
    </div>
  `,
  styles: [`
    .onboarding-shell {
      max-width: var(--max-app-width); margin: 0 auto; height: 100dvh; background: var(--cloud);
      display: flex; flex-direction: column;
    }
    .intro { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 0 24px; text-align: center; }
    .badge-icon {
      width: 64px; height: 64px; border-radius: 20px; background: var(--emerald); color: #fff;
      display: flex; align-items: center; justify-content: center; margin-bottom: 18px;
    }
    h2 { font-family: var(--font-display); font-weight: 500; font-size: 24px; line-height: 1.2; }
    p { font-size: 12px; color: var(--ink-soft); margin-top: 10px; line-height: 1.6; }
    .cities { padding: 0 18px 4px; display: flex; flex-direction: column; gap: 10px; }
    .city-row {
      display: flex; justify-content: space-between; align-items: center; width: 100%;
      background: var(--card); border: 1px solid var(--line); border-radius: var(--r-md);
      padding: 14px; font-family: inherit; color: var(--ink); font-size: 13.5px; font-weight: 700;
    }
    .city-row.on { border-color: var(--emerald); background: var(--emerald-bg); color: var(--emerald-ink); }
    .left { display: flex; align-items: center; gap: 10px; }
    .cta { padding: 18px; }
  `],
})
export class CitySelectComponent {
  protected readonly user = inject(UserService);
  private readonly router = inject(Router);

  protected continue(): void {
    this.router.navigateByUrl('/home');
  }
}
