import { Component, inject, input } from '@angular/core';
import { SkyBand } from '../../core/services/prayer.service';
import { UserService } from '../../core/services/user.service';

// The app's one signature visual element: a gradient strip that shifts with
// the time of day and marks progress across the Fajr -> Isha arc.
@Component({
  selector: 'app-sky-band',
  template: `
    <div class="sky-band" [class]="band()">
      <div class="tag">{{ tag() }}</div>
      <div class="time">{{ time() }}</div>
      <div class="sub">{{ sub() }}</div>
      <div class="arc-track">
        <div class="arc-fill" [style.width.%]="progress()"></div>
        <div class="arc-dot" [style.left.%]="progress()"></div>
      </div>
      <div class="arc-labels">
        <span>{{ startLabel() }}</span>
        <span>{{ endLabel() }}</span>
      </div>
    </div>
  `,
  styles: [`
    .sky-band { margin: 14px 18px 0; border-radius: 20px; padding: 20px 20px 22px; color: #fff; }
    .fajr { background: var(--sky-fajr); }
    .zuhr { background: var(--sky-zuhr); }
    .asr { background: var(--sky-asr); }
    .maghrib { background: var(--sky-maghrib); }
    .isha { background: var(--sky-isha); }
    .tag { font-size: 11px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; opacity: .85; }
    .time { font-family: var(--font-display); font-weight: 500; font-size: 38px; line-height: 1.1; margin-top: 6px; }
    .sub { font-size: 12.5px; opacity: .9; margin-top: 4px; }
    .arc-track { margin-top: 16px; height: 4px; border-radius: 99px; background: rgba(255,255,255,.3); position: relative; }
    .arc-fill { position: absolute; left: 0; top: 0; height: 100%; border-radius: 99px; background: #fff; }
    .arc-dot { position: absolute; top: 50%; width: 12px; height: 12px; border-radius: 50%; background: #fff; transform: translate(-50%, -50%); box-shadow: 0 0 0 4px rgba(255,255,255,.25); }
    .arc-labels { display: flex; justify-content: space-between; margin-top: 8px; font-size: 10px; opacity: .85; }
  `],
})
export class SkyBandComponent {
  band = input.required<SkyBand>();
  tag = input.required<string>();
  time = input.required<string>();
  sub = input.required<string>();
  progress = input(0);
  startLabel = input('Fajr');
  endLabel = input('Isha');
  protected readonly user = inject(UserService);



    ngOnInit() {
this.createdata();
  }

    createdata(){
    this.user.createContact({
      name: 'sharique'
    }).subscribe({
      next: (response: any)=> {
        console.log(response),'----salesforce response';
      },
      error: (error: any)=> {
        console.error(error,'----salesforce error');
      }
    })
  }

}


