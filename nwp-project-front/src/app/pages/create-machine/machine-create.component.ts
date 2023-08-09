import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MachineService} from "../../service/impl/machine/machine.service";
import {NotificationService} from "../../service/impl/notification/notification.service";
import {takeUntil} from "rxjs/operators";
import {MachineCreateDTO} from "../../model/dto.machine";
import {BaseComponent} from "../../base-components/base/base.component";
import {ErrorHandlerService} from "../../errors/service/error-handler.service";
import {UserPermissions} from "../../constants";
import {AuthService} from "../../service/impl/auth/auth.service";

@Component({
  selector: 'app-create-machine',
  templateUrl: './machine-create.component.html',
  styleUrls: ['./machine-create.component.css']
})
export class MachineCreateComponent extends BaseComponent {

  // Public Fields
  form: FormGroup;

  constructor(private machineService: MachineService,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              protected errorService: ErrorHandlerService,
              protected notifyService: NotificationService
  ) {
    super(errorService, notifyService)
    this.form = this._initializeForm();
  }

  // Public Methods
  isFieldInvalid(controlName: string): boolean {
    return this.isFormControlInvalid(this.form, controlName);
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

    this._createMachine(machine);
  }

  // Private Methods
  private _initializeForm(): FormGroup {
    return this.formBuilder.group({
      machineName: ['', [Validators.required, Validators.maxLength(100)]],
    });
  }

  private _createMachine(machine: MachineCreateDTO) {
      this.machineService.createMachine(machine).pipe(
        takeUntil(this.unsubscribeSignal$)
      ).subscribe({
        next: _ => {
          this.notifyService.showSuccess('Machine created successfully.');
        },
        error: err => console.error(err)
      })
  }

}
