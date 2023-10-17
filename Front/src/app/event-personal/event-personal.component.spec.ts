import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventPersonalComponent } from './event-personal.component';

describe('EventPersonalComponent', () => {
  let component: EventPersonalComponent;
  let fixture: ComponentFixture<EventPersonalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventPersonalComponent]
    });
    fixture = TestBed.createComponent(EventPersonalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
