import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import cpiJson from '../assets/cpi.json';

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
    expect(service.isReadyForCalculation$.value).toBeFalsy();
  });

  it('should fetch data', () => {
    service.fetchData$();
    const req = httpClientMock.expectOne((req) =>
      req.url.includes('/assets/cpi.json')
    );

    expect(req.request.method).toBe('GET');

    req.flush(cpiJson);
    httpClientMock.verify();

    expect(service.isReadyForCalculation$.value).toBeTruthy();
  });

  it('should calculateInflation', () => {
    expect(cpiJson).toBeTruthy();

    service.fetchData$();
    const req = httpClientMock.expectOne((req) =>
      req.url.includes('/assets/cpi.json')
    );
    req.flush(cpiJson);
    httpClientMock.verify();

    const lastAmount: number = service.calculateInflation().slice(-1)[0].y;
    expect(Math.round(lastAmount)).toBe(482);
  });
});
