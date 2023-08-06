import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineCreateComponent } from './machine-create.component';

describe('CreateMachineComponent', () => {
  let component: MachineCreateComponent;
  let fixture: ComponentFixture<MachineCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineCreateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
