import { Component, inject } from '@angular/core';
import { QuizService } from '../../core/services/quiz.service';
import { BadgeComponent } from '../../shared/components/badge.component';
import { CategoryChipsComponent } from '../../shared/components/category-chips.component';
import { HeaderBarComponent } from '../../shared/components/header-bar.component';
import { SectionHeaderComponent } from '../../shared/components/section-header.component';
import { IconComponent } from '../../shared/icon/icon.component';

@Component({
  selector: 'app-quiz',
  imports: [HeaderBarComponent, CategoryChipsComponent, SectionHeaderComponent, BadgeComponent, IconComponent],
  template: `
    <app-header-bar mode="page" title="Islamic quiz" actionIcon="trophy" />

    <div class="card streak-card">
      <div class="ring" [style.background]="ringStyle()">
        <div class="ring-inner">
          <b>{{ quiz.streak() }}</b>
          <small>day streak</small>
        </div>
      </div>
      <div>
        <div class="title-sm">Keep it going!</div>
        <div class="meta">Answer today's question to extend your streak</div>
      </div>
    </div>

    <app-section-header title="Categories" />
    <app-category-chips
      [options]="quiz.categories()"
      [selectedId]="quiz.activeCategoryId()"
      (selectedIdChange)="quiz.selectCategory($event)"
    />

    <div class="card question-card">
      <app-badge variant="gold">Today's question · {{ activeCategoryLabel() }}</app-badge>
      <div class="question">{{ quiz.activeQuestion().question }}</div>
      <div class="options">
        @for (opt of quiz.activeQuestion().options; track opt; let i = $index) {
          <button
            type="button"
            class="option"
            [class.correct]="quiz.selectedOptionIndex() !== null && i === quiz.activeQuestion().correctIndex"
            [class.wrong]="quiz.selectedOptionIndex() === i && i !== quiz.activeQuestion().correctIndex"
            (click)="quiz.selectOption(i)"
          >
            {{ letters[i] }}. {{ opt }}
          </button>
        }
      </div>
    </div>

    <app-section-header title="Achievements" />
    <div class="achievements">
      @for (a of quiz.achievements(); track a.id) {
        <div class="achievement" [class.earned]="a.earned">
          <app-icon [name]="a.icon" [size]="20" />
          <span>{{ a.label }}</span>
        </div>
      }
    </div>
  `,
  styles: [`
    .streak-card { display: flex; align-items: center; gap: 16px; margin: 14px 18px; }
    .ring { width: 70px; height: 70px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
    .ring-inner {
      width: 56px; height: 56px; border-radius: 50%; background: var(--card);
      display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .ring-inner b { font-size: 15px; font-family: var(--font-display); }
    .ring-inner small { font-size: 8.5px; color: var(--ink-soft); }
    .title-sm { font-size: 13.5px; font-weight: 700; }
    .meta { font-size: 11.5px; color: var(--ink-soft); margin-top: 2px; }
    .question-card { margin: 0 18px 12px; }
    .question { margin-top: 10px; font-size: 14.5px; line-height: 1.5; font-weight: 700; }
    .options { display: flex; flex-direction: column; gap: 8px; margin-top: 12px; }
    .option {
      text-align: left; background: var(--card); border: 1px solid var(--line); border-radius: 12px;
      padding: 11px 14px; font-size: 12.5px; color: var(--ink-soft); font-family: inherit;
    }
    .option.correct { border-color: var(--emerald); background: var(--emerald-bg); color: var(--emerald-ink); font-weight: 700; }
    .option.wrong { border-color: var(--brick); background: var(--brick-bg); color: var(--brick); font-weight: 700; }
    .achievements { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; padding: 0 18px 20px; }
    .achievement {
      display: flex; flex-direction: column; align-items: center; gap: 6px; padding: 12px 4px;
      border-radius: 14px; background: var(--card); border: 1px solid var(--line); color: var(--ink-faint);
    }
    .achievement span { font-size: 9.5px; font-weight: 700; color: var(--ink-soft); text-align: center; }
    .achievement.earned { background: var(--emerald); border-color: var(--emerald); color: #fff; }
    .achievement.earned span { color: #fff; }
  `],
})
export class QuizComponent {
  protected readonly quiz = inject(QuizService);
  protected readonly letters = ['A', 'B', 'C', 'D'];

  protected ringStyle() {
    return `conic-gradient(var(--gold) 0deg ${this.quiz.streakRingDegrees()}deg, var(--line) ${this.quiz.streakRingDegrees()}deg 360deg)`;
  }

  protected activeCategoryLabel() {
    return this.quiz.categories().find((c) => c.id === this.quiz.activeCategoryId())?.label ?? '';
  }
}
