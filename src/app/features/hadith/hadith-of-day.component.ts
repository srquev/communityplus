import { Component, ElementRef, ViewChild, inject, signal } from '@angular/core';
import { HadithService } from '../../core/services/hadith.service';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-hadith-of-day',
  imports: [HeaderBarComponent, IconComponent],
  templateUrl: './hadith-of-day.component.html',
  styleUrl: './hadith-of-day.component.scss',
})
export class HadithOfDayComponent {
  @ViewChild('shareCard') private shareCard?: ElementRef<HTMLElement>;

  protected readonly hadith = inject(HadithService);
  protected readonly entries = this.hadith.entries;
  protected readonly selectedId = this.hadith.selectedHadithId;
  protected readonly selectedHadith = this.hadith.selectedHadith;
  protected readonly isSharing = signal(false);
  protected readonly shareMessage = signal('');

  constructor() {
    this.hadith.loadHadithOfDay().subscribe({
      next: (response) => console.log('loadHadithOfDay response:', response),
      error: (error) => console.error('loadHadithOfDay error:', error),
    });
  }

  protected selectHadith(id: string): void {
    this.hadith.selectHadith(id);
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
