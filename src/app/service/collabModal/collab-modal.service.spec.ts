import { TestBed } from '@angular/core/testing';

import { CollabModalService } from './collab-modal.service';

describe('CollabModalService', () => {
  let service: CollabModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollabModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
