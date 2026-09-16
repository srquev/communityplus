import { Component, computed, inject, signal } from '@angular/core';
import { JanazahNotice } from '../../core/models';
import { CommunityService } from '../../core/services/community.service';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { IconComponent } from '../../shared/icon/icon.component';

interface EidNamazTiming {
  id: string;
  title: string;
  date: string;
  hijriDate: string;
  location: string;
  address: string;
  timings: string[];
  notes: string;
}

interface ImportantDate {
  id: string;
  title: string;
  date: string;
  hijriDate: string;
  description: string;
}

@Component({
  selector: 'app-updates',
  imports: [HeaderBarComponent, IconComponent],
  templateUrl: './janazah.component.html',
  styleUrl: './janazah.component.scss',
})
export class UpdatesComponent {
  protected readonly community = inject(CommunityService);
  protected readonly todayDate = this.normalizedToday();
  private readonly expandedSections = signal<Set<string>>(new Set(['janazah', 'islamic', 'eid', 'dates']));
  private readonly expandedNotices = signal<Set<string>>(new Set());
  private readonly expandedUpdates = signal<Set<string>>(new Set());
  private readonly expandedEidTimings = signal<Set<string>>(new Set());
  private readonly expandedImportantDates = signal<Set<string>>(new Set());

  protected readonly todayNotices = computed(() => this.community.janazahNotices().filter((notice) => this.isToday(notice.date)));
  protected readonly previousNotices = computed(() => this.community.janazahNotices().filter((notice) => !this.isToday(notice.date)));
  protected readonly previousGroups = computed(() => this.groupByDate(this.previousNotices()));
  protected readonly islamicUpdates = computed(() => this.community.news());
  protected readonly eidNamazTimings = signal<EidNamazTiming[]>([
    {
      id: 'eid-ul-fitr',
      title: 'Eid-ul-Fitr Namaz',
      date: '2026-03-20',
      hijriDate: '1 Shawwal 1447',
      location: 'Eidgah Ground',
      address: 'Eidgah Road, Mau',
      timings: ['7:00 AM', '8:00 AM'],
      notes: 'Please arrive early and carry your prayer mat.',
    },
    {
      id: 'eid-ul-adha',
      title: 'Eid-ul-Adha Namaz',
      date: '2026-05-27',
      hijriDate: '10 Dhu al-Hijjah 1447',
      location: 'Central Jama Masjid',
      address: 'Main Bazaar Road, Mau',
      timings: ['6:45 AM', '7:45 AM'],
      notes: 'Parking volunteers will guide traffic near the masjid lane.',
    },
  ]);
  protected readonly importantDates = signal<ImportantDate[]>([
    {
      id: 'ramadan-start',
      title: 'Expected Ramadan begins',
      date: '2026-02-18',
      hijriDate: '1 Ramadan 1447',
      description: 'Date may vary by moon sighting announcement.',
    },
    {
      id: 'eid-fitr-date',
      title: 'Expected Eid-ul-Fitr',
      date: '2026-03-20',
      hijriDate: '1 Shawwal 1447',
      description: 'Final date will be confirmed after local moon sighting.',
    },
    {
      id: 'eid-adha-date',
      title: 'Expected Eid-ul-Adha',
      date: '2026-05-27',
      hijriDate: '10 Dhu al-Hijjah 1447',
      description: 'Qurbani guidance and prayer timings will be posted closer to the date.',
    },
  ]);

  protected isSectionExpanded(id: string): boolean {
    return this.expandedSections().has(id);
  }

  protected toggleSection(id: string): void {
    this.expandedSections.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  protected formatDate(value: string): string {
    return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }

  protected isNoticeExpanded(id: string): boolean {
    return this.expandedNotices().has(id);
  }

  protected toggleNotice(id: string): void {
    this.expandedNotices.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  protected isUpdateExpanded(id: string): boolean {
    return this.expandedUpdates().has(id);
  }

  protected toggleUpdate(id: string): void {
    this.expandedUpdates.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  protected isEidTimingExpanded(id: string): boolean {
    return this.expandedEidTimings().has(id);
  }

  protected toggleEidTiming(id: string): void {
    this.expandedEidTimings.update((current) => this.toggleSetValue(current, id));
  }

  protected isImportantDateExpanded(id: string): boolean {
    return this.expandedImportantDates().has(id);
  }

  protected toggleImportantDate(id: string): void {
    this.expandedImportantDates.update((current) => this.toggleSetValue(current, id));
  }

  private isToday(value: string): boolean {
    return value === this.todayDate;
  }

  private normalizedToday(): string {
    const today = new Date();
    return [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('-');
  }

  private groupByDate(notices: JanazahNotice[]): Array<{ date: string; notices: JanazahNotice[] }> {
    const groups = new Map<string, JanazahNotice[]>();
    for (const notice of notices) {
      groups.set(notice.date, [...(groups.get(notice.date) ?? []), notice]);
    }

    return Array.from(groups.entries())
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([date, groupedNotices]) => ({ date, notices: groupedNotices }));
  }

  private toggleSetValue(current: Set<string>, id: string): Set<string> {
    const next = new Set(current);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    return next;
  }
}
