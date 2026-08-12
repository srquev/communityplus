import { Routes } from '@angular/router';
import { ShellComponent } from './shell/shell.component';

export const routes: Routes = [
  {
    path: 'onboarding',
    loadComponent: () => import('./features/onboarding/city-select.component').then((m) => m.CitySelectComponent),
  },
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent) },
      { path: 'prayer', loadComponent: () => import('./features/prayer/prayer.component').then((m) => m.PrayerComponent) },
      { path: 'mosques', loadComponent: () => import('./features/mosques/mosque-list.component').then((m) => m.MosqueListComponent) },
      // { path: 'mosques/:id', loadComponent: () => import('./features/mosques/mosque-detail.component').then((m) => m.MosqueDetailComponent) },
      // { path: 'directory', loadComponent: () => import('./features/directory/business-list.component').then((m) => m.BusinessListComponent) },
      // { path: 'directory/:id', loadComponent: () => import('./features/directory/business-detail.component').then((m) => m.BusinessDetailComponent) },
      // { path: 'community', loadComponent: () => import('./features/community/community.component').then((m) => m.CommunityComponent) },
      { path: 'quiz', loadComponent: () => import('./features/quiz/quiz.component').then((m) => m.QuizComponent) },
      { path: 'hod', loadComponent: () => import('./features/hadith/hadith-of-day.component').then((m) => m.HadithOfDayComponent) },
      { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent) },
    ],
  },
  { path: '**', redirectTo: 'home' },
];
