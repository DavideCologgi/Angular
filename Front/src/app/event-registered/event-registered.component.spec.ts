import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRegisteredComponent } from './event-registered.component';

describe('EventRegisteredComponent', () => {
  let component: EventRegisteredComponent;
  let fixture: ComponentFixture<EventRegisteredComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventRegisteredComponent]
    });
    fixture = TestBed.createComponent(EventRegisteredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
