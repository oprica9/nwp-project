import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Subject} from "rxjs";
import {MachineService} from "../../service/machine/machine.service";
import {NotificationService} from "../../service/notification/notification.service";
import {takeUntil} from "rxjs/operators";
import {MachineCreateDTO} from "../../model/machine";

@Component({
  selector: 'app-create-machine',
  templateUrl: './machine-create.component.html',
  styleUrls: ['./machine-create.component.css']
})
export class MachineCreateComponent implements OnInit {

  public form: FormGroup;
  private ngUnsubscribe = new Subject();

  constructor(private machineService: MachineService,
              private notifyService: NotificationService,
              private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      machineName: [''],
    });
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.form = this.formBuilder.group({
      machineName: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  createMachine(): void {
    if (!this.form.valid) {
      this.notifyService.showError('Form is not valid. Please check the inputs.');
      return;
    }
    const formValue = this.form.value;

    const machine: MachineCreateDTO = {
      name: formValue.machineName
    }

    this.machineService.createMachine(machine)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        () => {
          this.notifyService.showSuccess('Machine created successfully.');
        },
        (error) => {
          console.error(error);
          this.notifyService.showError(`Failed to create machine.\n ${error.error.message}`);
        }
      );
  }

}
