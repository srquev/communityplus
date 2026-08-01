# City Community — Angular 20 source

Source code for the mobile-first City Community Platform, matching the UI
designs pass. Standalone components throughout, Signals for state, the new
`@if/@for/@switch` control flow, lazy-loaded feature routes, and zoneless
change detection.

## Stack

- Angular 20 — standalone components (default, no NgModules), Signals, zoneless
- Plain SCSS design tokens (`src/styles/_tokens.scss`) — swap for Tailwind
  later via `ng add @angular/pwa` style tooling if you want utility classes
- No backend yet — every `core/services/*.service.ts` reads from
  `core/data/mock-data.ts`. Replace the body of each service method with an
  `HttpClient` call when the NestJS API from the blueprint is ready; no
  component or template needs to change, since components only depend on the
  service's public signals/methods.

## Getting started

This was written directly as source files (no network access in this
environment to run `ng new`/`npm install`), so before running it locally:

```bash
npm install
npm start        # ng serve, http://localhost:4200
```

If `npm install` complains about peer versions, this was targeted at
Angular ^20.0.0 — pin your installed CLI/core versions to match.

## Structure

```
src/app/
  core/
    models/         All TypeScript interfaces (Mosque, Business, PrayerDay, ...)
    data/            Dummy JSON-style mock data — the only file to touch when wiring a real API
    services/        Signal-based stores (PrayerService, MosqueService, BusinessService, ...)
  shared/
    icon/            IconComponent + icon-registry (inline SVG, referenced by name)
    components/      Reusable UI: header-bar, bottom-nav, sky-band, quick-actions,
                     search-bar, category-chips, list-card, business-card, tabs,
                     badge, app-button, section-header
  shell/             ShellComponent — layout wrapper with the persistent bottom nav
  features/
    home/            Home screen
    prayer/          Prayer & Islamic (Today / Ramadan / Calendar tabs)
    mosques/         Mosque list + detail
    directory/        Business directory list + detail
    community/        News, Janazah notices, Neki Ki Deewar, volunteers, donations
    quiz/            Islamic quiz with streak ring + category-scoped questions
    profile/         Profile + account settings list
    onboarding/       City selection (first-run screen, outside the tab shell)
```

## Notable patterns

- **`SkyBandComponent`** is the app's signature element — a gradient band
  that shifts (fajr/zuhr/asr/maghrib/isha) with `PrayerService.skyBand()`
  and shows progress across the day via `dayProgressPercent()`. Both Home
  and Prayer consume it with different inputs.
- **Route param binding**: `mosques/:id` and `directory/:id` resolve
  straight into a signal `id = input.required<string>()` on the detail
  components via `withComponentInputBinding()` in `app.config.ts` — no
  manual `ActivatedRoute.snapshot.paramMap` wiring.
- **Content projection** (`ng-content select="[trailing]"`) on
  `ListCardComponent` lets each screen attach a trailing badge/rating/chevron
  without the shared component needing to know about every possible trailing
  element type.
- **Two-way `model()` bindings** (`CategoryChipsComponent.selectedId`,
  `TabsComponent.active`, `SearchBarComponent.value`) — bind with
  `[(selectedId)]="localSignal"` for local component state; when the source
  of truth lives on an injected service, bind explicitly
  (`[selectedId]="quiz.activeCategoryId()"` + `(selectedIdChange)="quiz.selectCategory($event)"`)
  so the service's own update logic runs instead of being bypassed — see
  `QuizComponent` for the concrete case.

## Known gaps / next steps

- Search and category filters are functional in the Directory; Mosque list
  filter chips are currently visual only — wire them the same way
  (`computed()` over `MosqueService.all()`) when needed.
- No HTTP layer, auth, or persistence — this is the frontend blueprint only,
  per the earlier architecture doc (NestJS + PostgreSQL + Prisma backend).
- No unit tests included; add `*.spec.ts` alongside each service/component
  as the app stabilizes.
