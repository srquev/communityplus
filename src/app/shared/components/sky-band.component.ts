import { Component, input } from '@angular/core';
import { SkyBand } from '../../core/services/prayer.service';

@Component({
  selector: 'app-sky-band',
  template: `
    <section class="sky-band" [class]="band()" aria-label="Prayer countdown">
      <div class="sky-glow" aria-hidden="true"></div>
      <div class="sky-specks" aria-hidden="true"></div>
      <div class="content">
        <div class="topline">
          <span class="period">{{ periodLabel() }}</span>
          <span class="live"><i></i> Live</span>
        </div>
        <div class="next-label">Next prayer · {{ tag() }} at {{ time() }}</div>
        <div class="countdown" aria-live="polite">{{ countdown() }}</div>
         <!-- 
      <div class="countdown-label">remaining</div>
       <div class="sub">{{ sub() }}</div> -->
      </div>
      <div class="arc-track">
        <div class="arc-fill" [style.width.%]="progress()"></div>
        <div class="arc-dot" [style.left.%]="progress()"></div>
      </div>
      <div class="arc-labels"><span>{{ startLabel() }}</span><span>{{ endLabel() }}</span></div>
    </section>
  `,
  styles: [`
    .sky-band { position: relative; isolation: isolate; overflow: hidden; margin: 10px 18px 0; padding: 16px; border-radius: 20px; color: #fff; box-shadow: 0 16px 30px rgba(18, 21, 28, .14); }
    .fajr { background: linear-gradient(135deg, #4c4b87, #a46a92 58%, #f4ad81); }
    .zuhr { background: linear-gradient(135deg, #117f9a, #49b9d2 58%, #bce5d4); }
    .asr { background: linear-gradient(135deg, #4b7488, #c78b5c 60%, #f2c36e); }
    .maghrib { background: linear-gradient(135deg, #56365f, #cb5f57 52%, #f0a15e); }
    .isha { background: linear-gradient(135deg, #111d4c, #243b78 58%, #3c5c99); }
    .content, .arc-track, .arc-labels { position: relative; z-index: 1; }
    .sky-glow { position: absolute; z-index: 0; top: -48px; right: -34px; width: 128px; height: 128px; border-radius: 50%; background: rgba(255, 244, 190, .74); box-shadow: 0 0 46px 18px rgba(255, 224, 139, .3); }
    .isha .sky-glow { top: 15px; right: 22px; width: 54px; height: 54px; background: #fff5cc; box-shadow: 0 0 24px 8px rgba(255, 244, 190, .25); }
    .sky-specks { position: absolute; inset: 0; z-index: 0; opacity: 0; background-image: radial-gradient(circle at 16% 22%, #fff 0 1px, transparent 1.5px), radial-gradient(circle at 45% 13%, #fff 0 1px, transparent 1.5px), radial-gradient(circle at 74% 42%, #fff 0 1px, transparent 1.5px), radial-gradient(circle at 27% 68%, #fff 0 1px, transparent 1.5px); }
    .isha .sky-specks, .fajr .sky-specks { opacity: .65; }
    .topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    .period, .live { font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
    .live { display: inline-flex; align-items: center; gap: 5px; padding: 4px 7px; border: 1px solid rgba(255,255,255,.25); border-radius: 999px; background: rgba(17, 20, 40, .14); letter-spacing: .05em; }
    .live i { width: 6px; height: 6px; border-radius: 50%; background: #aaffcb; box-shadow: 0 0 0 3px rgba(170,255,203,.16); }
    .next-label { margin-top: 16px; font-size: 12px; font-weight: 650; opacity: .94; }
    .countdown { margin-top: 2px; font-family: var(--font-display); font-size: clamp(34px, 10vw, 44px); font-weight: 650; font-variant-numeric: tabular-nums; letter-spacing: .035em; line-height: 1.05; text-shadow: 0 2px 10px rgba(0,0,0,.14); }
    .countdown-label { margin-top: 2px; font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; opacity: .78; }
    .sub { margin-top: 10px; font-size: 12px; line-height: 1.35; opacity: .94; }
    .arc-track { height: 4px; margin-top: 16px; border-radius: 99px; background: rgba(255,255,255,.3); }
    .arc-fill { position: absolute; top: 0; left: 0; height: 100%; border-radius: 99px; background: #fff; }
    .arc-dot { position: absolute; top: 50%; width: 12px; height: 12px; border-radius: 50%; background: #fff; transform: translate(-50%, -50%); box-shadow: 0 0 0 4px rgba(255,255,255,.25); }
    .arc-labels { display: flex; justify-content: space-between; margin-top: 8px; font-size: 10px; font-weight: 650; opacity: .88; }
  `],
})
export class SkyBandComponent {
  band = input.required<SkyBand>();
  tag = input.required<string>();
  time = input.required<string>();
  sub = input.required<string>();
  countdown = input.required<string>();
  progress = input(0);
  startLabel = input('Fajr');
  endLabel = input('Isha');

  protected periodLabel(): string {
    return { fajr: 'Dawn', zuhr: 'High noon', asr: 'Late afternoon', maghrib: 'Sunset', isha: 'Night' }[this.band()];
  }
}
