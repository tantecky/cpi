import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { CpiService } from './cpi.service';

describe('CpiService', () => {
  let service: CpiService;
  let httpClientMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(CpiService);
    httpClientMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not be ready', () => {
    expect(service.isReady$.value).toBeFalsy();
  });

  it('should fetch data', () => {
    service.fetchData$();
    const req = httpClientMock.expectOne((req) =>
      req.url.includes('/assets/cpi.json')
    );

    expect(req.request.method).toBe('GET');

    req.flush({ 1997: ['0.1'] });
    httpClientMock.verify();

    expect(service.isReady$.value).toBeTruthy();
  });
});
