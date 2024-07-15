import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MwlComponent } from './mwl.component';

describe('MwlComponent', () => {
  let component: MwlComponent;
  let fixture: ComponentFixture<MwlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MwlComponent]
    });
    fixture = TestBed.createComponent(MwlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
