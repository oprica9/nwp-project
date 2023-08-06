import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineSearchComponent } from './machine-search.component';

describe('MachineSearchComponent', () => {
  let component: MachineSearchComponent;
  let fixture: ComponentFixture<MachineSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MachineSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
