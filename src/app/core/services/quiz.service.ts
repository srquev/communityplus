import { Injectable, computed, signal } from '@angular/core';
import { ACHIEVEMENTS, QUIZ_CATEGORIES, QUIZ_QUESTIONS } from '../data/mock-data';
import { USER_PROFILE } from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class QuizService {
  readonly categories = signal(QUIZ_CATEGORIES);
  readonly questions = signal(QUIZ_QUESTIONS);
  readonly achievements = signal(ACHIEVEMENTS);

  readonly activeCategoryId = signal(this.categories()[0].id);
  readonly selectedOptionIndex = signal<number | null>(null);

  readonly activeQuestion = computed(
    () => this.questions().find((q) => q.categoryId === this.activeCategoryId()) ?? this.questions()[0]
  );

  readonly streak = computed(() => USER_PROFILE.streak);
  // used to drive the conic-gradient ring; 7-day streak against a 10-day visual goal
  readonly streakRingDegrees = computed(() => Math.min(360, Math.round((this.streak() / 10) * 360)));

  selectCategory(id: string) {
    this.activeCategoryId.set(id);
    this.selectedOptionIndex.set(null);
  }

  selectOption(index: number) {
    this.selectedOptionIndex.set(index);
  }
}
