import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { PrayerService } from './prayer.service';
import { UserService } from './user.service';

describe('PrayerService', () => {
  let service: PrayerService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()],
    });

    service = TestBed.inject(PrayerService);
    userService = TestBed.inject(UserService);
  });

  it('updates the active prayer timings when the selected city changes', () => {
    expect(service.timings()[0].time).toBe('04:48');

    userService.selectCity('kanpur');

    expect(service.timings()[0].time).toBe('04:47');
  });
});
