import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MachineService} from "../../service/machine/machine.service";
import {Machine} from "../../model/model.machine";
import {NotificationService} from "../../service/notification/notification.service";
import {SearchParams} from '../../model/model.machine';
import {catchError, takeUntil} from "rxjs/operators";
import {Observable, Subject, throwError} from 'rxjs';
import {WebsocketService} from "../../service/websocket/websocket.service";
import {AuthService} from "../../service/auth/auth.service";
import {MachineActions, MachineStates, UserPermissions} from "../../constants";

@Component({
  selector: 'app-machine-search',
  templateUrl: './machine-search.component.html',
  styleUrls: ['./machine-search.component.css']
})
export class MachineSearchComponent implements OnInit, OnDestroy {

  // Public Fields
  form: FormGroup;
  machines: Machine[] = [];
  availableStatuses: string[] = [];
  totalMachines: number = 0;
  page: number = 1;
  size: number = 10;
  MachineActions = MachineActions;

  // Private Fields
  private ngUnsubscribe = new Subject<void>();
  private actionMap: { [key in MachineActions]: MachineStates } = {
    [MachineActions.START]: MachineStates.STOPPED,
    [MachineActions.STOP]: MachineStates.RUNNING,
    [MachineActions.RESTART]: MachineStates.RUNNING,
    [MachineActions.DESTROY]: MachineStates.STOPPED
  };

  constructor(
    private formBuilder: FormBuilder,
    private machineService: MachineService,
    private notifyService: NotificationService,
    private websocketService: WebsocketService,
    private authService: AuthService
  ) {
    this.form = this._initializeForm();
  }

  // Lifecycle Hooks
  ngOnInit(): void {
    this.websocketService.connect();

    this.websocketService.messages.pipe(
      catchError(this._handleError.bind(this, 'An unknown error occurred.')),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: response => {
        if (response) {
          const updatedMachine: Machine = response;
          const index = this.machines.findIndex((machine) => machine.id === updatedMachine.id);
          if (index !== -1) {
            this.machines[index] = updatedMachine;
            this._evaluateActionsForMachine(this.machines[index]);
          }
        }
      },
      error: err => console.error(err)
    });

    this.searchMachines();
    this._fetchAvailableStatuses();
  }

  ngOnDestroy(): void {
    this.websocketService.disconnect()
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Public Methods
  searchMachines(): void {
    const searchParams: Partial<SearchParams> = this._buildSearchParams();
    this._executeMachineSearch(searchParams);
  }

  pageChanged(event: any): void {
    this.page = event;
    this.searchMachines();
  }

  // Event Handlers
  startMachine(machineId: number) {
    this._executeMachineAction(
      UserPermissions.CAN_START_MACHINES,
      'Machine is starting.',
      () => this.machineService.startMachine(machineId)
    );
  }

  restartMachine(machineId: number) {
    this._executeMachineAction(
      UserPermissions.CAN_RESTART_MACHINES,
      'Machine is restarting.',
      () => this.machineService.restartMachine(machineId)
    );
  }

  stopMachine(machineId: number) {
    this._executeMachineAction(
      UserPermissions.CAN_STOP_MACHINES,
      'Machine is stopping.',
      () => this.machineService.stopMachine(machineId)
    );
  }

  destroyMachine(machineId: number) {
    this._executeMachineAction(
      UserPermissions.CAN_DESTROY_MACHINES,
      'Machine successfully destroyed.',
      () => this.machineService.destroyMachine(machineId)
    );
  }

  // Private Methods
  private _initializeForm(): FormGroup {
    return this.formBuilder.group({
      name: [''],
      statuses: [[]],
      dateFrom: [''],
      dateTo: [''],
      page: [0],
      size: [10]
    });
  }

  private _executeMachineSearch(params: SearchParams): void {
    this.machineService.searchMachines(params).pipe(
      catchError(this._handleError.bind(this, 'An unknown error occurred.')),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: response => {
        this.machines = response.data.content;
        this.totalMachines = response.data.totalElements;
        this._populateAvailableActions();
      },
      error: err => console.error(err)
    });
  }

  private _executeMachineAction(requiredPermission: UserPermissions, successMessage: string, action: () => Observable<any>) {
    if (!this.authService.isAuthenticated()) {
      this.notifyService.showError('User is not authenticated.');
      return;
    }
    if (!this.authService.userHasPermission(requiredPermission)) {
      this.notifyService.showError(`You do not have permission to perform this action on machines.`);
      return;
    }
    action()
      .pipe(
        catchError(this._handleError.bind(this, 'Failed to perform the action on the machine.')),
        takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: _ => {
          this.notifyService.showSuccess(successMessage);
          this.searchMachines();
        },
        error: err => console.error(err)
      });
  }

  private _fetchAvailableStatuses(): void {
    this.machineService.getAvailableStatuses()
      .pipe(
        catchError(this._handleError.bind(this, 'Failed to fetch available statuses.')),
        takeUntil(this.ngUnsubscribe))
      .subscribe({
        next: next => {
          this.availableStatuses = next.data;
          for (let string of this.availableStatuses) {
            this.form.addControl(string, this.formBuilder.control(false));
          }
        },
        error: err => console.error(err)
      });
  }

  private _populateAvailableActions() {
    this.machines.forEach(machine => {
      machine.allowedActions = [];
      machine.actionPermissions = {};  // Initialize the map

      for (let action in this.actionMap) {
        const isAllowed = this.actionMap[action as MachineActions] === machine.status;
        machine.actionPermissions[action as MachineActions] = isAllowed;

        if (isAllowed) {
          machine.allowedActions.push(action as MachineActions);
        }
      }
    });
  }

  private _buildSearchParams(): Partial<SearchParams> {
    let statusesList: string[] = [];
    for (const status of this.availableStatuses) {
      if ((this.form.controls as { [key: string]: any })[status].value) {
        statusesList.push(status);
      }
    }
    const formValue = this.form.value;
    return {
      name: formValue.name,
      statuses: statusesList,
      // Date-time data in ISO 8601 format
      dateFrom: formValue.dateFrom,
      dateTo: formValue.dateTo,
      page: this.page - 1,
      size: this.size
    };
  }

  private _evaluateActionsForMachine(machine: Machine): void {
    machine.actionPermissions = machine.actionPermissions || {};
    for (let action in this.actionMap) {
      machine.actionPermissions[action as MachineActions] = this.actionMap[action as MachineActions] === machine.status;
    }
  }

  // Utility methods or handlers
  private _handleError(message: string, error: any): Observable<never> {
    this.notifyService.showError(message);
    return throwError(error);
  }

}
