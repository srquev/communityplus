import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

export interface HadithEntry {
  id: string;
  daysAgo: number;
  topic: string;
  text: string;
  narrator: string;
  reference: string;
}

interface ApiHadith {
  id?: string;
  key?: string;
  daysAgo?: number;
  topic?: string;
  title?: string;
  text?: string;
  hadithText?: string;
  description?: string;
  narrator?: string;
  reference?: string;
  source?: string;
}

interface ApiHadithResponse {
  hadith?: ApiHadith;
  hadiths?: ApiHadith[];
  data?: ApiHadith | ApiHadith[];
}

const FALLBACK_HADITH_ENTRIES: HadithEntry[] = [
  {
    id: 'intentions',
    daysAgo: 0,
    topic: 'Intentions',
    text: 'Actions are but by intentions, and every person will have but that which they intended.',
    narrator: 'Narrated by Umar ibn Al-Khattab (RA)',
    reference: 'Sahih al-Bukhari 1',
  },
  {
    id: 'speech',
    daysAgo: 1,
    topic: 'Good speech',
    text: 'Whoever believes in Allah and the Last Day should speak what is good or remain silent.',
    narrator: 'Narrated by Abu Huraira (RA)',
    reference: 'Sahih al-Bukhari 6018',
  },
  {
    id: 'cleanliness',
    daysAgo: 2,
    topic: 'Purification',
    text: 'Cleanliness is half of faith.',
    narrator: 'Reported by Abu Malik al-Ash‘ari (RA)',
    reference: 'Sahih Muslim 223',
  },
];

@Injectable({ providedIn: 'root' })
export class HadithService {
  private readonly http = inject(HttpClient);
  private readonly url = 'https://orgfarm-d42615ccbd-dev-ed.develop.my.salesforce-sites.com/services/apexrest/hadith-of-day';
  private readonly entriesValue = signal<HadithEntry[]>(FALLBACK_HADITH_ENTRIES);
  private readonly selectedId = signal(FALLBACK_HADITH_ENTRIES[0].id);
  private hadithRequest?: Observable<HadithEntry[]>;

  readonly entries = this.entriesValue.asReadonly();
  readonly selectedHadith = computed(() => this.entries().find((entry) => entry.id === this.selectedId()) ?? this.entries()[0] ?? FALLBACK_HADITH_ENTRIES[0]);
  readonly selectedHadithId = this.selectedId.asReadonly();

  loadHadithOfDay(): Observable<HadithEntry[]> {
    this.hadithRequest ??= this.http.get<ApiHadith | ApiHadith[] | ApiHadithResponse>(this.url).pipe(
      map((response) => this.mapResponse(response)),
      tap((entries) => {
        if (!entries.length) return;
        this.entriesValue.set(entries);
        this.selectedId.set(entries[0].id);
      }),
      shareReplay({ bufferSize: 1, refCount: false }),
    );

    return this.hadithRequest;
  }

  selectHadith(id: string): void {
    this.selectedId.set(id);
  }

  private mapResponse(response: ApiHadith | ApiHadith[] | ApiHadithResponse): HadithEntry[] {
    const wrapped = response as ApiHadithResponse;
    const payload: ApiHadith[] = Array.isArray(response)
      ? response
      : Array.isArray(wrapped.data)
        ? wrapped.data
        : wrapped.hadiths
          ? wrapped.hadiths
          : wrapped.hadith
            ? [wrapped.hadith]
            : wrapped.data
              ? [wrapped.data]
              : [response as ApiHadith];

    return payload.map((item: ApiHadith, index: number) => ({
      id: item.id ?? item.key ?? `hadith-${index}`,
      daysAgo: item.daysAgo ?? index,
      topic: item.topic ?? item.title ?? 'Hadith of the Day',
      text: item.text ?? item.hadithText ?? item.description ?? '',
      narrator: item.narrator ?? '',
      reference: item.reference ?? item.source ?? '',
    })).filter((entry: HadithEntry) => entry.text);
  }
}
