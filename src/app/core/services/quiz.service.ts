import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ACHIEVEMENTS, QUIZ_CATEGORIES, QUIZ_QUESTIONS } from '../data/mock-data';
import { USER_PROFILE } from '../data/mock-data';
import { QuizCategory, QuizQuestion } from '../models';

interface ApiQuizCategory {
  id?: string;
  key?: string;
  categoryId?: string;
  label?: string;
  name?: string;
  categoryName?: string;
  icon?: string;
}

interface ApiQuizQuestion {
  id?: string;
  key?: string;
  questionId?: string;
  categoryId?: string;
  categoryKey?: string;
  category?: string;
  categoryName?: string;
  question?: string;
  questionText?: string;
  options?: string[];
  answers?: string[];
  choices?: string[];
  correctIndex?: number;
  correctOptionIndex?: number;
  correctAnswerIndex?: number;
  correctAnswer?: string;
  answer?: string;
}

interface ApiQuizResponse {
  categories?: ApiQuizCategory[];
  questions?: ApiQuizQuestion[];
  quiz?: ApiQuizQuestion | ApiQuizQuestion[];
  quizzes?: ApiQuizQuestion[];
  data?: ApiQuizQuestion[] | { categories?: ApiQuizCategory[]; questions?: ApiQuizQuestion[] };
}

interface QuizPayload {
  categories: QuizCategory[];
  questions: QuizQuestion[];
}

@Injectable({ providedIn: 'root' })
export class QuizService {
  private readonly http = inject(HttpClient);
  private readonly url = 'https://orgfarm-d42615ccbd-dev-ed.develop.my.salesforce-sites.com/services/apexrest/quiz';

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

  loadQuiz(): Observable<QuizPayload> {
    return this.http.get<ApiQuizResponse | ApiQuizQuestion[]>(this.url).pipe(
      map((response) => this.mapQuizResponse(response)),
      tap((payload) => {
        if (!payload.questions.length) return;

        this.categories.set(payload.categories.length ? payload.categories : this.deriveCategories(payload.questions));
        this.questions.set(payload.questions);

        const currentCategoryExists = this.categories().some((category) => category.id === this.activeCategoryId());
        this.activeCategoryId.set(currentCategoryExists ? this.activeCategoryId() : this.categories()[0].id);
        this.selectedOptionIndex.set(null);
      }),
    );
  }

  private mapQuizResponse(response: ApiQuizResponse | ApiQuizQuestion[]): QuizPayload {
    const wrapped = response as ApiQuizResponse;
    const data = wrapped.data;
    const categories = this.mapCategories(
      !Array.isArray(data) && data?.categories ? data.categories : wrapped.categories ?? [],
    );
    const questionsPayload = Array.isArray(response)
      ? response
      : Array.isArray(data)
        ? data
        : !Array.isArray(data) && data?.questions
          ? data.questions
          : wrapped.questions ?? wrapped.quizzes ?? (wrapped.quiz ? this.asArray(wrapped.quiz) : []);
    const questions = this.mapQuestions(questionsPayload);

    return {
      categories: categories.length ? categories : this.deriveCategories(questions),
      questions,
    };
  }

  private mapCategories(categories: ApiQuizCategory[]): QuizCategory[] {
    return categories
      .map((category, index) => {
        const label = category.label ?? category.name ?? category.categoryName ?? '';
        return {
          id: category.id ?? category.key ?? category.categoryId ?? this.slugify(label) ?? `category-${index}`,
          label,
          icon: category.icon ?? this.iconForCategory(label),
        };
      })
      .filter((category) => category.label);
  }

  private mapQuestions(questions: ApiQuizQuestion[]): QuizQuestion[] {
    return questions
      .map((question, index) => {
        const options = question.options ?? question.answers ?? question.choices ?? [];
        return {
          id: question.id ?? question.key ?? question.questionId ?? `quiz-${index}`,
          categoryId: question.categoryId ?? question.categoryKey ?? this.slugify(question.categoryName ?? question.category) ?? 'general',
          question: question.question ?? question.questionText ?? '',
          options,
          correctIndex: this.resolveCorrectIndex(question, options),
        };
      })
      .filter((question) => question.question && question.options.length);
  }

  private deriveCategories(questions: QuizQuestion[]): QuizCategory[] {
    const categories = new Map<string, QuizCategory>();
    for (const question of questions) {
      if (categories.has(question.categoryId)) continue;
      const label = this.titleize(question.categoryId);
      categories.set(question.categoryId, {
        id: question.categoryId,
        label,
        icon: this.iconForCategory(label),
      });
    }
    return [...categories.values()];
  }

  private resolveCorrectIndex(question: ApiQuizQuestion, options: string[]): number {
    const index = question.correctIndex ?? question.correctOptionIndex ?? question.correctAnswerIndex;
    if (typeof index === 'number' && index >= 0 && index < options.length) return index;

    const answer = question.correctAnswer ?? question.answer;
    const answerIndex = answer ? options.findIndex((option) => option.trim().toLowerCase() === answer.trim().toLowerCase()) : -1;
    return answerIndex >= 0 ? answerIndex : 0;
  }

  private asArray(value: ApiQuizQuestion | ApiQuizQuestion[]): ApiQuizQuestion[] {
    return Array.isArray(value) ? value : [value];
  }

  private slugify(value?: string): string {
    return (value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  private titleize(value: string): string {
    return value.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
  }

  private iconForCategory(label: string): string {
    const normalized = label.toLowerCase();
    if (normalized.includes('quran')) return 'book';
    if (normalized.includes('history')) return 'calendar';
    if (normalized.includes('fiqh')) return 'star';
    return 'moon';
  }
}
