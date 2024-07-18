import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollabModalComponent } from './collab-modal.component';

describe('CollabModalComponent', () => {
  let component: CollabModalComponent;
  let fixture: ComponentFixture<CollabModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollabModalComponent]
    });
    fixture = TestBed.createComponent(CollabModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
