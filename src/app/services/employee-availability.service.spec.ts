import { TestBed } from '@angular/core/testing';

import { EmployeeAvailabilityService } from './employee-availability.service';

describe('EmployeeAvailabilityService', () => {
  let service: EmployeeAvailabilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmployeeAvailabilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
