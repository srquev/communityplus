import { Component, ElementRef, ViewChild, computed, signal } from '@angular/core';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { IconComponent } from '../../shared/icon/icon.component';

interface HadithEntry {
  id: string;
  daysAgo: number;
  topic: string;
  text: string;
  narrator: string;
  reference: string;
}

const HADITH_ENTRIES: HadithEntry[] = [
  {
    id: 'intentions', daysAgo: 0, topic: 'Intentions',
    text: 'Actions are but by intentions, and every person will have but that which they intended.',
    narrator: 'Narrated by Umar ibn Al-Khattab (RA)', reference: 'Sahih al-Bukhari 1',
  },
  {
    id: 'speech', daysAgo: 1, topic: 'Good speech',
    text: 'Whoever believes in Allah and the Last Day should speak what is good or remain silent.',
    narrator: 'Narrated by Abu Huraira (RA)', reference: 'Sahih al-Bukhari 6018',
  },
  {
    id: 'cleanliness', daysAgo: 2, topic: 'Purification',
    text: 'Cleanliness is half of faith.',
    narrator: 'Reported by Abu Malik al-Ash‘ari (RA)', reference: 'Sahih Muslim 223',
  },
];

@Component({
  selector: 'app-hadith-of-day',
  imports: [HeaderBarComponent, IconComponent],
  template: `
    <app-header-bar mode="page" title="Hadith of the Day" actionIcon="quote" />

    <main class="hadith-page">
      <div class="intro">
        <span class="eyebrow"><app-icon name="quote" [size]="14" /> Daily reflection</span>
        <h1>Words to carry with you</h1>
        <p>A short Hadith, selected for today.</p>
      </div>

      <article #shareCard class="hadith-card">
        <div class="card-topline">
          <span class="topic">{{ selectedHadith().topic }}</span>
          <time>{{ displayDate(selectedHadith().daysAgo) }}</time>
        </div>
        <div class="quote-mark" aria-hidden="true">“</div>
        <blockquote>{{ selectedHadith().text }}</blockquote>
        <p class="narrator">{{ selectedHadith().narrator }}</p>
        <footer class="reference">
          <app-icon name="book" [size]="15" />
          <span>Reference</span>
          <strong>{{ selectedHadith().reference }}</strong>
        </footer>
      </article>

      <div class="share-row">
        <button type="button" class="share-card-btn" [disabled]="isSharing()" (click)="shareHadith()">
          <app-icon name="share" [size]="16" />
          <span>{{ isSharing() ? 'Preparing image...' : 'Share as image' }}</span>
        </button>
        @if (shareMessage()) {
          <span class="share-message">{{ shareMessage() }}</span>
        }
      </div>

      <section class="archive" aria-labelledby="previous-hadith-title">
        <div class="section-heading">
          <div>
            <h2 id="previous-hadith-title">Previously shared</h2>
            <p>Revisit earlier daily Hadith.</p>
          </div>
          <span>{{ entries.length }} entries</span>
        </div>
        <div class="history-list">
          @for (entry of entries; track entry.id) {
            <button type="button" class="history-item" [class.active]="selectedId() === entry.id" (click)="selectHadith(entry.id)">
              <span class="history-date">{{ shortDate(entry.daysAgo) }}</span>
              <span class="history-copy"><strong>{{ entry.topic }}</strong><small>{{ entry.reference }}</small></span>
             <!-- <app-icon name="chevron" [size]="16" /> -->
            </button>
          }
        </div>
      </section>
    </main>
  `,
  styles: [`
    .hadith-page { padding: 4px 18px 28px; }
    .intro { padding: 10px 2px 18px; }
    .eyebrow { display: inline-flex; align-items: center; gap: 6px; color: var(--emerald); font-size: 11px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; }
    h1 { margin: 8px 0 4px; font-family: var(--font-display); font-size: 25px; font-weight: 650; letter-spacing: -.02em; color: var(--ink); }
    .intro p, .section-heading p { margin: 0; color: var(--ink-soft); font-size: 12px; }
    .hadith-card { position: relative; overflow: hidden; padding: 18px; border: 1px solid #d7e5dd; border-radius: 20px; background: linear-gradient(145deg, #f7fcf9, #e5f3ea); box-shadow: 0 14px 30px rgba(18, 77, 54, .09); }
    .hadith-card::after { position: absolute; right: -26px; bottom: -34px; width: 120px; height: 120px; border: 20px solid rgba(32, 123, 86, .08); border-radius: 50%; content: ''; }
    .card-topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; color: var(--emerald-ink); font-size: 11px; font-weight: 750; }
    .topic { padding: 5px 8px; border-radius: 999px; background: rgba(31, 123, 83, .11); }
    time { color: var(--ink-soft); font-weight: 650; }
    .quote-mark { height: 42px; margin: 12px 0 -16px; color: var(--emerald); font-family: Georgia, serif; font-size: 64px; line-height: 1; opacity: .35; }
    blockquote { position: relative; z-index: 1; margin: 0; color: var(--ink); font-family: var(--font-display); font-size: 21px; font-weight: 550; line-height: 1.38; letter-spacing: -.01em; }
    .narrator { position: relative; z-index: 1; margin: 16px 0 14px; color: var(--ink-soft); font-size: 12px; font-style: italic; }
    .reference { position: relative; z-index: 1; display: flex; align-items: center; gap: 6px; padding-top: 12px; border-top: 1px solid rgba(31, 123, 83, .16); color: var(--emerald-ink); font-size: 11px; }
    .reference strong { margin-left: auto; font-size: 11px; }
    .share-row { display: flex; align-items: center; gap: 10px; margin-top: 12px; }
    .share-card-btn { display: inline-flex; align-items: center; justify-content: center; gap: 7px; min-height: 38px; padding: 0 13px; border: 1px solid var(--emerald); border-radius: 12px; background: var(--emerald); color: #fff; font: inherit; font-size: 12px; font-weight: 800; cursor: pointer; }
    .share-card-btn:disabled { cursor: progress; opacity: .68; }
    .share-message { color: var(--ink-soft); font-size: 11px; font-weight: 650; }
    .archive { margin-top: 24px; }
    .section-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
    h2 { margin: 0 0 3px; color: var(--ink); font-size: 15px; font-weight: 750; }
    .section-heading > span { color: var(--ink-faint); font-size: 10px; font-weight: 700; white-space: nowrap; }
    .history-list { display: flex; flex-direction: column; gap: 8px; }
    .history-item { display: flex; align-items: center; gap: 10px; width: 100%; padding: 10px; border: 1px solid var(--line); border-radius: 14px; background: var(--card); color: var(--ink); font: inherit; text-align: left; cursor: pointer; }
    .history-item.active { border-color: var(--emerald); background: var(--emerald-bg); }
    .history-date { display: grid; place-items: center; flex: 0 0 48px; min-height: 38px; padding: 0 4px; border-radius: 10px; background: var(--cloud); color: var(--ink-soft); font-size: 10px; font-weight: 800; text-align: center; }
    .history-item.active .history-date { background: rgba(31, 123, 83, .13); color: var(--emerald-ink); }
    .history-copy { display: flex; flex: 1; flex-direction: column; gap: 2px; min-width: 0; }
    .history-copy strong { font-size: 12px; }
    .history-copy small { overflow: hidden; color: var(--ink-soft); font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
    .history-item app-icon { color: var(--ink-faint); }
  `],
})
export class HadithOfDayComponent {
  @ViewChild('shareCard') private shareCard?: ElementRef<HTMLElement>;

  protected readonly entries = HADITH_ENTRIES;
  protected readonly selectedId = signal(HADITH_ENTRIES[0].id);
  protected readonly selectedHadith = computed(() => HADITH_ENTRIES.find((entry) => entry.id === this.selectedId()) ?? HADITH_ENTRIES[0]);
  protected readonly isSharing = signal(false);
  protected readonly shareMessage = signal('');

  protected selectHadith(id: string): void {
    this.selectedId.set(id);
  }

  protected async shareHadith(): Promise<void> {
    const element = this.shareCard?.nativeElement;
    if (!element) return;

    this.isSharing.set(true);
    this.shareMessage.set('');

    try {
      const blob = await this.captureElement(element);
      const file = new File([blob], 'hadith-of-the-day.png', { type: 'image/png' });
      const shareData: ShareData = {
        title: 'Hadith of the Day',
        text: `${this.selectedHadith().text} - ${this.selectedHadith().reference}`,
        files: [file],
      };

      if (navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
        this.shareMessage.set('Ready for WhatsApp or Instagram.');
      } else {
        this.downloadBlob(blob);
        this.shareMessage.set('Image downloaded.');
      }
    } catch {
      this.shareMessage.set('Could not create the image.');
    } finally {
      this.isSharing.set(false);
    }
  }

  protected displayDate(daysAgo: number): string {
    const date = this.dateFor(daysAgo);
    return date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  protected shortDate(daysAgo: number): string {
    return this.dateFor(daysAgo).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  }

  private dateFor(daysAgo: number): Date {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date;
  }

  private async captureElement(element: HTMLElement): Promise<Blob> {
    await document.fonts?.ready;

    const rect = element.getBoundingClientRect();
    const width = Math.ceil(rect.width);
    const height = Math.ceil(rect.height);
    const clone = element.cloneNode(true) as HTMLElement;

    this.inlineStyles(element, clone);
    clone.style.width = `${width}px`;
    clone.style.height = `${height}px`;
    clone.style.margin = '0';

    const serialized = new XMLSerializer().serializeToString(clone);
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <foreignObject width="100%" height="100%">
          <div xmlns="http://www.w3.org/1999/xhtml">${serialized}</div>
        </foreignObject>
      </svg>
    `;
    const image = await this.loadImage(`data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`);
    const scale = Math.min(window.devicePixelRatio || 2, 3);
    const canvas = document.createElement('canvas');
    canvas.width = width * scale;
    canvas.height = height * scale;

    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is not supported.');

    context.scale(scale, scale);
    context.drawImage(image, 0, 0, width, height);

    return await new Promise((resolve, reject) => {
      canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error('Image export failed.')), 'image/png');
    });
  }

  private inlineStyles(source: Element, target: Element): void {
    if (source instanceof HTMLElement && target instanceof HTMLElement) {
      const style = window.getComputedStyle(source);
      for (let index = 0; index < style.length; index += 1) {
        const property = style.item(index);
        target.style.setProperty(property, style.getPropertyValue(property), style.getPropertyPriority(property));
      }
    }

    Array.from(source.children).forEach((child, index) => {
      const targetChild = target.children.item(index);
      if (targetChild) this.inlineStyles(child, targetChild);
    });
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = () => reject(new Error('Image load failed.'));
      image.src = src;
    });
  }

  private downloadBlob(blob: Blob): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'hadith-of-the-day.png';
    link.click();
    URL.revokeObjectURL(url);
  }
}
