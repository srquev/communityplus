import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly activeTasks = signal(0);

  readonly isLoading = computed(() => this.activeTasks() > 0);

  start(): void {
    this.activeTasks.update((count) => count + 1);
  }

  stop(): void {
    this.activeTasks.update((count) => Math.max(0, count - 1));
  }
}
