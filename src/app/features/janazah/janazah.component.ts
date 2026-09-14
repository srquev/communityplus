import { Component, computed, inject, signal } from '@angular/core';
import { JanazahNotice } from '../../core/models';
import { CommunityService } from '../../core/services/community.service';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-janazah',
  imports: [HeaderBarComponent, IconComponent],
  templateUrl: './janazah.component.html',
  styleUrl: './janazah.component.scss',
})
export class JanazahComponent {
  protected readonly community = inject(CommunityService);
  protected readonly todayDate = this.normalizedToday();
  private readonly expandedNotices = signal<Set<string>>(new Set());

  protected readonly todayNotices = computed(() => this.community.janazahNotices().filter((notice) => this.isToday(notice.date)));
  protected readonly previousNotices = computed(() => this.community.janazahNotices().filter((notice) => !this.isToday(notice.date)));
  protected readonly previousGroups = computed(() => this.groupByDate(this.previousNotices()));

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
}
