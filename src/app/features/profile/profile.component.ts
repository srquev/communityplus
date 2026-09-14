import { Component, inject } from '@angular/core';
import { UserService } from '../../core/services/user.service';
import { AppButtonComponent } from '../../shared/components/app-button.component';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { ListCardComponent } from '../../shared/components/list-card.component';
import { SectionHeaderComponent } from '../../shared/components/section-header.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-profile',
  imports: [HeaderBarComponent, SectionHeaderComponent, ListCardComponent, AppButtonComponent, IconComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  protected readonly user = inject(UserService);
}
