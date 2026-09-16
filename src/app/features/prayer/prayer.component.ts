import { Component, computed, inject, signal } from '@angular/core';
import { PrayerService } from '../../core/services/prayer.service';
import { UserService } from '../../core/services/user.service';
import { AppButtonComponent } from '../../shared/components/app-button.component';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { SectionHeaderComponent } from '../../shared/components/section-header.component';
import { TabsComponent } from '../../shared/components/tabs.component';
import { IconComponent } from '../../shared/icon/icon.component';

const PRAYER_ICONS: Record<string, string> = {
  Fajr: 'sunrise',
  Zuhr: 'sun',
  Asr: 'sunset',
  Maghrif: 'moon',
  Isha: 'moonfilled',
  Tahajjud: 'moon-stars',
};

const PRAYER_REMINDERS: Record<string, string> = {
  Fajr: 'Fajr is proof that light always returns.',
  Zuhr: 'Pause, remember, and re-center your heart.',
  Asr: 'Guard the middle prayer as the afternoon wanes.',
  Maghrif: 'Let sunset open the door to evening peace.',
  Isha: 'End the day by leaving worries on the prayer mat.',
};

@Component({
  selector: 'app-prayer',
  imports: [HeaderBarComponent, TabsComponent, SectionHeaderComponent, AppButtonComponent, IconComponent],
  templateUrl: './prayer.component.html',
  styleUrl: './prayer.component.scss',
})
export class PrayerComponent {
  protected readonly prayer = inject(PrayerService);
  protected readonly user = inject(UserService);
  protected readonly prayerIcons = PRAYER_ICONS;
  protected readonly prayerReminders = PRAYER_REMINDERS;
  protected readonly activeTab = signal('Today');
  protected readonly showCalendarSheet = signal(false);
  protected readonly now = signal(new Date());
  protected readonly weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  protected readonly calendarCells = computed(() => {
    const days = this.prayer.calendar();
    const [firstDay] = days;
    if (!firstDay) return [];

    const [day, month, year] = firstDay.date.split('-').map(Number);
    const leadingDays = new Date(year, month - 1, day).getDay();
    return [...Array.from({ length: leadingDays }, () => null), ...days];
  });
  protected readonly selectedMasjid = computed(() => {
    const schedule = this.prayer.selectedSchedule();
    const selectedId = this.user.selectedMasjidId();
    return schedule.masjids.find((masjid) => masjid.id === selectedId) ?? schedule.masjids[0];
  });

  constructor() {
    setInterval(() => this.now.set(new Date()), 1000);
  }

  protected toggleCalendarSheet(): void {
    this.showCalendarSheet.update((isOpen) => !isOpen);
  }

  protected closeCalendar(): void {
    this.showCalendarSheet.set(false);
  }

  protected currentMonthLabel(): string {
    return this.prayer.calendarMonth().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  protected hijriMonthLabel(): string {
    const firstDay = this.prayer.calendar()[0];
    if (!firstDay) return 'اسلامی مہینہ';

    const months = ['', 'محرم', 'صفر', 'ربیع الاول', 'ربیع الثانی', 'جمادی الاول', 'جمادی الثانی', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذوالقعدہ', 'ذوالحجہ'];
    return `${months[firstDay.monthNumber] ?? firstDay.month} ${firstDay.year}`;
  }
}
