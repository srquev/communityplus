import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { loadingInterceptor } from './core/services/loading.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withComponentInputBinding()),
    // Angular 20 zoneless: no zone.js patching, signals drive change detection.
    provideZonelessChangeDetection(),
    provideHttpClient(withInterceptors([loadingInterceptor])),
  ],
};
