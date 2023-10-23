import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MofidyEventsComponent } from './mofidy-events.component';

describe('MofidyEventsComponent', () => {
  let component: MofidyEventsComponent;
  let fixture: ComponentFixture<MofidyEventsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MofidyEventsComponent]
    });
    fixture = TestBed.createComponent(MofidyEventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
