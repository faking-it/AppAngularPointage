import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClockFormComponent } from './clock-form.component';

describe('ClockFormComponent', () => {
  let component: ClockFormComponent;
  let fixture: ComponentFixture<ClockFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClockFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClockFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
