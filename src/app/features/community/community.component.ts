import { DecimalPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommunityService } from '../../core/services/community.service';
import { AppButtonComponent } from '../../shared/components/app-button.component';
import { ChipOption, CategoryChipsComponent } from '../../shared/components/category-chips.component';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { ListCardComponent } from '../../shared/components/list-card.component';
import { SectionHeaderComponent } from '../../shared/components/section-header.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-community',
  imports: [
    DecimalPipe, RouterLink, HeaderBarComponent, CategoryChipsComponent, SectionHeaderComponent,
    ListCardComponent, AppButtonComponent, IconComponent,
  ],
  templateUrl: './community.component.html',
  styleUrl: './community.component.scss',
})
export class CommunityComponent {
  protected readonly community = inject(CommunityService);

  protected readonly sections: ChipOption[] = [
    { id: 'news', label: 'News', icon: 'chat' },
    // { id: 'neki', label: 'Neki wall', icon: 'wall' },
    { id: 'volunteer', label: 'Volunteer', icon: 'hand' },
    { id: 'donate', label: 'Donate', icon: 'gift' },
  ];
  protected readonly activeSection = signal('news');
}
