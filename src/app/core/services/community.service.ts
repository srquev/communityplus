import { Injectable, signal } from '@angular/core';
import {
  COMMUNITY_NEWS, DONATION_CAMPAIGNS, JANAZAH_NOTICES, NEKI_ITEMS, VOLUNTEERS,
} from '../data/mock-data';

@Injectable({ providedIn: 'root' })
export class CommunityService {
  readonly news = signal(COMMUNITY_NEWS);
  readonly janazahNotices = signal(JANAZAH_NOTICES);
  readonly nekiItems = signal(NEKI_ITEMS);
  readonly volunteers = signal(VOLUNTEERS);
  readonly campaigns = signal(DONATION_CAMPAIGNS);
}
