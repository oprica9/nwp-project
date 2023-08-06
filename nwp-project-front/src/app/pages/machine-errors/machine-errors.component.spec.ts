import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineErrorsComponent } from './machine-errors.component';

describe('MachineErrorsComponent', () => {
  let component: MachineErrorsComponent;
  let fixture: ComponentFixture<MachineErrorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineErrorsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineErrorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
