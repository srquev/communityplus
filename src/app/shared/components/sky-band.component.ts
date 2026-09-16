import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PrayerCountdownTone, PrayerMilestone, SkyBand } from '../../core/services/prayer.service';

@Component({
  selector: 'app-sky-band',
  imports: [RouterLink],
  template: `
    <section
      class="sky-band"
      [class]="band()"
      aria-label="Salah countdown"
      [style.--tone]="toneColor()"
      [style.--tone-glow]="toneGlow()"
    >
      <div class="atmosphere" aria-hidden="true">
        <span class="time-disc"></span>
        <span class="star-field"></span>
      </div>

      <div class="content">
        <div class="topline">
          <div class="date-block">
            <span class="date-kicker">Today</span>
            <span class="date-value">{{ dateLabel() }}</span>
          </div>
          <div class="hijri-block" dir="auto">
            <span class="hijri-value">{{ hijriDateEnglish() }}</span>
            <span class="hijri-alias">{{ hijriDateUrdu() }}</span>
          </div>
        </div>

        <div class="hero-row">
          <div class="next-copy">
            <div class="eyebrow">Upcoming namaz</div>
            <h2>{{ displayPrayerName(tag()) }}</h2>
            <div class="next-time">{{ time() }}</div>
          </div>

          <div class="countdown-panel" [class]="countdownTone()">
            <span class="countdown-label"><i></i> Time left</span>
            <strong aria-live="polite">{{ countdown() }}</strong>
            <div class="pulse-rail" aria-hidden="true"><i></i></div>
          </div>
        </div>

        <div class="hadith-row">
          <div class="hadith-copy">
            <div class="hadith-head">
              <span>Hadith of the Day</span>
              <a [routerLink]="['/hod']">Read more</a>
            </div>
            <p>{{ hadithText() }}</p>
          </div>
        </div>
      </div>

      <div class="prayer-strip" aria-label="Today's prayer status">
        @for (milestone of milestones(); track milestone.name) {
          <div
            class="prayer-chip"
            [class.done]="milestone.status === 'done'"
            [class.active]="milestone.status === 'active'"
            [class.next]="isNextPrayer(milestone)"
          >
            <span class="prayer-name">
              {{ milestone.label }}
            </span>
            <span class="prayer-state">
              @if (milestone.status === 'done') {
                ✓
              } @else if (milestone.status === 'active') {
                Going on
              } @else {
                {{ milestone.time }}
              }
            </span>
          </div>
        }
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
      --line: rgba(255, 255, 255, .28);
      --glass: rgba(255, 255, 255, .12);
      --glass-strong: rgba(255, 255, 255, .18);
      --accent: #fff;
      --accent-soft: rgba(255, 255, 255, .72);
      --tone: #aaffcb;
      --tone-glow: rgba(170, 255, 203, .35);
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

    .maghrif {
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
    .prayer-strip {
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
    .hadith-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .topline {
      min-width: 0;
      flex-wrap: nowrap;
    }

    .date-kicker,
    .hijri-alias,
    .eyebrow,
    .countdown-label {
      font-size: 10px;
      font-weight: 850;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    .date-kicker,
    .hijri-alias,
    .eyebrow,
    .countdown-label {
      color: rgba(255, 255, 255, .72);
    }

    .date-block,
    .hijri-block {
      display: grid;
      min-width: 0;
      gap: 3px;
    }

    .date-block {
      flex: 1 1 auto;
    }

    .hijri-block {
      flex: 0 1 46%;
      justify-items: end;
      text-align: right;
    }

    .date-value,
    .hijri-value,
    .hijri-alias {
      overflow: hidden;
      min-width: 0;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .date-value,
    .hijri-value {
      color: rgba(255, 255, 255, .96);
      font-size: 12px;
      font-weight: 850;
      line-height: 1.1;
      letter-spacing: 0;
    }

    .hijri-alias {
      max-width: 100%;
      font-size: 10.5px;
      letter-spacing: 0;
      text-transform: none;
      direction: rtl;
    }

    .countdown-label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    .countdown-label i {
      width: 6px;
      height: 6px;
      flex: 0 0 6px;
      border-radius: 50%;
      background: var(--tone);
      box-shadow: 0 0 0 0 var(--tone-glow);
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
      background: rgba(255,255,255,.18);
    }

    .pulse-rail i {
      position: absolute;
      inset: 0 auto 0 0;
      width: 42%;
      border-radius: inherit;
      background: linear-gradient(90deg, transparent, var(--tone), transparent);
      animation: timeSweep 1.8s ease-in-out infinite;
    }

    .hadith-row {
      align-items: center;
      margin-top: 16px;
      padding-top: 12px;
      border-top: 1px solid rgba(255,255,255,.14);
      color: rgba(255,255,255,.8);
      font-size: 11.5px;
      line-height: 1.35;
    }

    .hadith-copy {
      flex: 1;
      min-width: 0;
    }

    .hadith-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
    }

    .hadith-head span {
      color: rgba(255,255,255,.72);
      font-size: 10px;
      font-weight: 850;
      letter-spacing: .08em;
      text-transform: uppercase;
    }

    .hadith-copy p {
      margin: 4px 0 0;
      color: rgba(255,255,255,.9);
      font-family: var(--font-display);
      font-size: 13px;
      font-weight: 550;
      line-height: 1.35;
    }

    .hadith-head a {
      flex: 0 0 auto;
      padding: 5px 8px;
      border: 1px solid rgba(255,255,255,.16);
      border-radius: 999px;
      background: rgba(8, 16, 32, .16);
      color: rgba(255,255,255,.92);
      font-size: 11px;
      font-weight: 850;
      text-decoration: none;
      text-align: right;
      white-space: nowrap;
      backdrop-filter: blur(10px);
    }

    .prayer-strip {
      position: relative;
      z-index: 2;
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 6px;
      margin-top: 18px;
    }

    .prayer-chip {
      display: grid;
      align-content: center;
      gap: 4px;
      min-width: 0;
      min-height: 52px;
      padding: 8px 4px;
      border: 1px solid rgba(255,255,255,.14);
      border-radius: 12px;
      background: rgba(8, 16, 32, .14);
      color: rgba(255,255,255,.72);
      box-shadow: inset 0 1px 0 rgba(255,255,255,.08);
      text-align: center;
    }

    .prayer-chip.done {
      background: rgba(255,255,255,.14);
      color: rgba(255,255,255,.9);
    }

    .prayer-chip.active {
      border-color: rgba(255,255,255,.3);
      background: rgba(255,255,255,.2);
      color: #fff;
    }

    .prayer-chip.next {
      border-color: var(--tone);
      background: rgba(8, 16, 32, .18);
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,.1),
        0 0 0 2px var(--tone-glow);
      color: #fff;
    }

    .prayer-name,
    .prayer-state {
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .prayer-name {
      font-size: 10px;
      font-weight: 850;
    }

    .prayer-state {
      font-size: 9.5px;
      font-weight: 900;
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
      .topline {
        gap: 8px;
      }

      .hijri-block {
        flex-basis: 42%;
      }

      .date-value,
      .hijri-value {
        font-size: 11px;
      }

      .hijri-alias {
        font-size: 9.5px;
      }

      .hero-row {
        flex-direction: column;
      }

      .countdown-panel {
        flex-basis: auto;
      }

      .hadith-row { align-items: flex-start; }
    }
  `],
})
export class SkyBandComponent {
  band = input.required<SkyBand>();
  tag = input.required<string>();
  time = input.required<string>();
  dateLabel = input('');
  hijriDate = input('');
  countdown = input.required<string>();
  countdownTone = input<PrayerCountdownTone>('calm');
  milestones = input<PrayerMilestone[]>([]);
  hadithText = input('');

  protected displayPrayerName(name: string): string {
    return name === 'Maghrif' ? 'Maghrib' : name;
  }

  protected isNextPrayer(milestone: PrayerMilestone): boolean {
    return milestone.status === 'upcoming' && milestone.label === this.displayPrayerName(this.tag());
  }

  protected hijriDateEnglish(): string {
    return this.hijriDate().split('|')[0] ?? this.hijriDate();
  }

  protected hijriDateUrdu(): string {
    return this.hijriDate().split('|')[1] ?? '';
  }

  protected toneColor(): string {
    return {
      calm: '#aaffcb',
      soon: '#ffd166',
      urgent: '#ff8a80',
    }[this.countdownTone()];
  }

  protected toneGlow(): string {
    return {
      calm: 'rgba(170, 255, 203, .35)',
      soon: 'rgba(255, 209, 102, .38)',
      urgent: 'rgba(255, 138, 128, .42)',
    }[this.countdownTone()];
  }
}
