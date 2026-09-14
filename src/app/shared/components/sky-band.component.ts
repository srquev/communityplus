import { Component, input } from '@angular/core';
import { SkyBand } from '../../core/services/prayer.service';

@Component({
  selector: 'app-sky-band',
  template: `
    <section class="sky-band" [class]="band()" aria-label="Prayer countdown" [style.--progress]="progressValue()">
      <div class="atmosphere" aria-hidden="true">
        <span class="horizon-line"></span>
        <span class="time-disc"></span>
        <span class="star-field"></span>
      </div>

      <div class="content">
        <div class="topline">
          <span class="period">{{ periodLabel() }}</span>
          <span class="live"><i></i> Live timing</span>
        </div>

        <div class="hero-row">
          <div class="next-copy">
            <div class="eyebrow">Upcoming namaz</div>
            <h2>{{ tag() }}</h2>
            <div class="next-time">{{ time() }}</div>
          </div>

          <div class="countdown-panel">
            <span>Time left</span>
            <strong aria-live="polite">{{ countdown() }}</strong>
            <div class="pulse-rail" aria-hidden="true"><i></i></div>
          </div>
        </div>

        <div class="context-row">
          <span>{{ themeLine() }}</span>
          <strong>{{ sub() }}</strong>
        </div>
      </div>

      <div class="progress-wrap" aria-hidden="true">
        <div class="progress-track">
          <div class="progress-fill"></div>
          <div class="progress-dot"></div>
        </div>
        <div class="arc-labels"><span>{{ startLabel() }}</span><span>{{ endLabel() }}</span></div>
      </div>
    </section>
  `,
  styles: [`
    .sky-band {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      margin: 10px 18px 0;
      padding: 16px;
      border: 1px solid rgba(255, 255, 255, .16);
      border-radius: 22px;
      color: #fff;
      box-shadow: 0 20px 40px rgba(18, 21, 28, .18);
      --progress: 0%;
      --line: rgba(255, 255, 255, .28);
      --glass: rgba(255, 255, 255, .12);
      --glass-strong: rgba(255, 255, 255, .18);
      --accent: #fff;
      --accent-soft: rgba(255, 255, 255, .72);
    }

    .fajr {
      background:
        linear-gradient(160deg, rgba(255,255,255,.12), transparent 34%),
        linear-gradient(135deg, #20274f 0%, #5c5c92 48%, #d89789 100%);
      --accent: #ffd9b7;
      --accent-soft: rgba(255, 226, 196, .78);
    }

    .zuhr {
      background:
        linear-gradient(160deg, rgba(255,255,255,.16), transparent 36%),
        linear-gradient(135deg, #08738f 0%, #28a7c1 54%, #b8e6db 100%);
      --accent: #e6fff6;
      --accent-soft: rgba(225, 255, 247, .82);
    }

    .asr {
      background:
        linear-gradient(160deg, rgba(255,255,255,.12), transparent 34%),
        linear-gradient(135deg, #355f72 0%, #b17959 58%, #e8bd6d 100%);
      --accent: #ffe4aa;
      --accent-soft: rgba(255, 229, 178, .8);
    }

    .maghrib {
      background:
        linear-gradient(160deg, rgba(255,255,255,.10), transparent 34%),
        linear-gradient(135deg, #34284f 0%, #a4495d 52%, #e88958 100%);
      --accent: #ffd1a1;
      --accent-soft: rgba(255, 210, 165, .8);
    }

    .isha {
      background:
        linear-gradient(160deg, rgba(255,255,255,.08), transparent 34%),
        linear-gradient(135deg, #071233 0%, #142a62 56%, #264b88 100%);
      --accent: #fff0b8;
      --accent-soft: rgba(226, 236, 255, .76);
    }

    .content,
    .progress-wrap {
      position: relative;
      z-index: 2;
    }

    .atmosphere {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
    }

    .atmosphere::before {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px),
        linear-gradient(0deg, rgba(255,255,255,.06) 1px, transparent 1px);
      background-size: 38px 38px;
      mask-image: linear-gradient(135deg, transparent 0%, #000 30%, transparent 85%);
      opacity: .45;
      content: '';
    }

    .horizon-line {
      position: absolute;
      right: -20%;
      bottom: 28px;
      left: -12%;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(255,255,255,.42), transparent);
      transform: rotate(-6deg);
    }

    .time-disc {
      position: absolute;
      right: 18px;
      top: 18px;
      width: 76px;
      height: 76px;
      border: 1px solid rgba(255,255,255,.22);
      border-radius: 50%;
      background:
        radial-gradient(circle at 35% 35%, rgba(255,255,255,.9) 0 2px, transparent 3px),
        radial-gradient(circle at 50% 50%, var(--accent) 0 33%, rgba(255,255,255,.08) 34% 100%);
      opacity: .34;
    }

    .isha .time-disc,
    .fajr .time-disc {
      width: 62px;
      height: 62px;
      opacity: .48;
      background:
        radial-gradient(circle at 35% 35%, rgba(255,255,255,.96) 0 1px, transparent 2px),
        radial-gradient(circle at 58% 42%, transparent 0 30%, var(--accent) 31% 58%, rgba(255,255,255,.08) 59% 100%);
    }

    .star-field {
      position: absolute;
      inset: 0;
      opacity: 0;
      background-image:
        radial-gradient(circle at 15% 26%, rgba(255,255,255,.9) 0 1px, transparent 1.5px),
        radial-gradient(circle at 42% 14%, rgba(255,255,255,.8) 0 1px, transparent 1.5px),
        radial-gradient(circle at 82% 38%, rgba(255,255,255,.75) 0 1px, transparent 1.5px),
        radial-gradient(circle at 30% 72%, rgba(255,255,255,.7) 0 1px, transparent 1.5px);
    }

    .isha .star-field,
    .fajr .star-field {
      opacity: .7;
      animation: starDrift 8s ease-in-out infinite alternate;
    }

    .topline,
    .hero-row,
    .context-row,
    .arc-labels {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .period,
    .live,
    .eyebrow,
    .countdown-panel span {
      font-size: 10px;
      font-weight: 850;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    .period,
    .eyebrow,
    .countdown-panel span {
      color: rgba(255, 255, 255, .72);
    }

    .live {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 8px;
      border: 1px solid rgba(255,255,255,.24);
      border-radius: 999px;
      background: rgba(8, 16, 32, .16);
      color: rgba(255,255,255,.88);
      letter-spacing: .05em;
      backdrop-filter: blur(10px);
    }

    .live i {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #aaffcb;
      box-shadow: 0 0 0 0 rgba(170, 255, 203, .35);
      animation: livePulse 1.7s ease-out infinite;
    }

    .hero-row {
      align-items: stretch;
      margin-top: 18px;
    }

    .next-copy {
      min-width: 0;
      flex: 1;
    }

    h2 {
      margin: 4px 0 0;
      font-family: var(--font-display);
      font-size: clamp(38px, 11vw, 52px);
      font-weight: 650;
      line-height: .98;
      letter-spacing: 0;
      text-shadow: 0 3px 14px rgba(0,0,0,.18);
    }

    .next-time {
      margin-top: 6px;
      color: var(--accent);
      font-size: 17px;
      font-weight: 850;
      letter-spacing: .02em;
    }

    .countdown-panel {
      display: flex;
      flex: 0 0 126px;
      flex-direction: column;
      justify-content: center;
      min-width: 0;
      padding: 11px;
      border: 1px solid rgba(255,255,255,.18);
      border-radius: 18px;
      background: rgba(8, 16, 32, .16);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.12);
      backdrop-filter: blur(12px);
    }

    .countdown-panel strong {
      margin-top: 5px;
      font-family: var(--font-display);
      font-size: 24px;
      font-weight: 650;
      font-variant-numeric: tabular-nums;
      line-height: 1;
      letter-spacing: .03em;
      color: #fff;
      text-shadow: 0 2px 12px rgba(0,0,0,.18);
    }

    .pulse-rail {
      position: relative;
      overflow: hidden;
      height: 3px;
      margin-top: 11px;
      border-radius: 999px;
      background: rgba(255,255,255,.22);
    }

    .pulse-rail i {
      position: absolute;
      inset: 0 auto 0 0;
      width: 42%;
      border-radius: inherit;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      animation: timeSweep 1.8s ease-in-out infinite;
    }

    .context-row {
      align-items: flex-start;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid rgba(255,255,255,.14);
      color: rgba(255,255,255,.8);
      font-size: 11.5px;
      line-height: 1.35;
    }

    .context-row strong {
      color: rgba(255,255,255,.92);
      font-size: 11.5px;
      font-weight: 750;
      text-align: right;
    }

    .progress-wrap {
      margin-top: 15px;
    }

    .progress-track {
      position: relative;
      height: 5px;
      border-radius: 999px;
      background: rgba(255,255,255,.24);
      box-shadow: inset 0 1px 2px rgba(0,0,0,.12);
    }

    .progress-fill {
      position: absolute;
      inset: 0 auto 0 0;
      width: var(--progress);
      border-radius: inherit;
      background: linear-gradient(90deg, rgba(255,255,255,.72), var(--accent));
      transition: width .6s ease;
    }

    .progress-dot {
      position: absolute;
      top: 50%;
      left: var(--progress);
      width: 14px;
      height: 14px;
      border: 2px solid rgba(255,255,255,.9);
      border-radius: 50%;
      background: var(--accent);
      transform: translate(-50%, -50%);
      box-shadow: 0 0 0 5px rgba(255,255,255,.14);
      transition: left .6s ease;
    }

    .arc-labels {
      margin-top: 8px;
      color: rgba(255,255,255,.72);
      font-size: 10px;
      font-weight: 750;
    }

    @keyframes livePulse {
      0% { box-shadow: 0 0 0 0 rgba(170, 255, 203, .35); }
      100% { box-shadow: 0 0 0 8px rgba(170, 255, 203, 0); }
    }

    @keyframes timeSweep {
      0% { transform: translateX(-120%); opacity: .2; }
      45% { opacity: 1; }
      100% { transform: translateX(260%); opacity: .2; }
    }

    @keyframes starDrift {
      from { transform: translate3d(0, 0, 0); opacity: .55; }
      to { transform: translate3d(-5px, 3px, 0); opacity: .82; }
    }

    @media (max-width: 360px) {
      .hero-row {
        flex-direction: column;
      }

      .countdown-panel {
        flex-basis: auto;
      }

      .context-row {
        flex-direction: column;
      }

      .context-row strong {
        text-align: left;
      }
    }
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
    return {
      fajr: 'Early morning',
      zuhr: 'Noon',
      asr: 'Afternoon',
      maghrib: 'After sunset',
      isha: 'Night',
    }[this.band()];
  }

  protected themeLine(): string {
    return {
      fajr: 'Fajr is proof that light always returns.',
      zuhr: 'Pause, remember, and re-center your heart.',
      asr: 'Guard the middle prayer as the afternoon wanes.',
      maghrib: 'Let sunset open the door to evening peace.',
      isha: 'End the day by leaving worries on the prayer mat.',
    }[this.band()];
  }

  protected progressValue(): string {
    return `${this.progress()}%`;
  }
}
