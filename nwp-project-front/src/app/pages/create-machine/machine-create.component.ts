import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable, Subject, throwError} from "rxjs";
import {MachineService} from "../../service/machine/machine.service";
import {NotificationService} from "../../service/notification/notification.service";
import {catchError, takeUntil} from "rxjs/operators";
import {MachineCreateDTO} from "../../model/dto.machine";

@Component({
  selector: 'app-create-machine',
  templateUrl: './machine-create.component.html',
  styleUrls: ['./machine-create.component.css']
})
export class MachineCreateComponent implements OnDestroy {

  // Public Fields
  form: FormGroup;

  // Private Fields
  private ngUnsubscribe = new Subject<void>();

  constructor(private machineService: MachineService,
              private notifyService: NotificationService,
              private formBuilder: FormBuilder
  ) {
    this.form = this._initializeForm();
  }

  // Lifecycle Hooks
  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Public Methods
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
      catchError(this._handleError.bind(this, 'Failed to create a machine.')),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: _ => {
        this.notifyService.showSuccess('Machine created successfully.');
      },
      error: err => console.error(err)
    })
  }

  // Utility methods or handlers
  private _handleError(message: string, error: any): Observable<never> {
    this.notifyService.showError(message);
    return throwError(error);
  }

}
