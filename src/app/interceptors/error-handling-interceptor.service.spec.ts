import { TestBed } from '@angular/core/testing';

import { ErrorHandingInterceptor } from './error-handling-interceptor.service';

describe('ErrorHandlingService', () => {
  let service: ErrorHandingInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorHandingInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
