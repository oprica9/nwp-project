import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MachineService} from "../../service/machine/machine.service";
import {MachineDTO} from "../../model/machine";
import {NotificationService} from "../../service/notification/notification.service";
import {SearchParams} from '../../model/machine';
import {catchError, takeUntil} from "rxjs/operators";
import {Subject, tap} from 'rxjs';
import {WebsocketService} from "../../service/websocket/websocket.service";
import {AuthUser} from "../../model/user";
import {AuthService} from "../../service/auth/auth.service";

@Component({
  selector: 'app-machine-search',
  templateUrl: './machine-search.component.html',
  styleUrls: ['./machine-search.component.css']
})
export class MachineSearchComponent implements OnInit, OnDestroy {

  currentUser?: AuthUser | null;

  public form: FormGroup;
  machines: MachineDTO[] = [];
  availableStatuses: string[] = [];
  totalMachines: number = 0;
  page: number = 1;
  size: number = 10;
  private ngUnsubscribe = new Subject<void>();

  actionInProgress: Map<number, boolean>;

  constructor(private fb: FormBuilder, private machineService: MachineService, private notifyService: NotificationService, private websocketService: WebsocketService, private authService: AuthService) {
    this.form = this.fb.group({
      name: [''],
      statuses: [[]],
      dateFrom: [''],
      dateTo: [''],
      page: [0],
      size: [10]
    });
    this.actionInProgress = new Map();
    this.authService.currentUser$.subscribe(user => this.currentUser = user);
  }

  ngOnInit(): void {
    // Wait until the WebSocket connection is established before subscribing to messages
    this.websocketService.connect();

    this.websocketService.messages.subscribe(message => {
      if (message) {
        console.log(message)
        const updatedMachine: MachineDTO = message;
        const index = this.machines.findIndex((machine) => machine.id === updatedMachine.id);
        if (index !== -1) {
          this.machines[index] = updatedMachine;
          if (this.mainMachineStatuses.includes(updatedMachine.status)) {
            this.actionInProgress.set(updatedMachine.id, false);
          }
        }
      }
    });
    this.searchMachines();
    this.fetchAvailableStatuses();
  }

  pageChanged(event: any): void {
    console.log(event)
    this.page = event;
    this.searchMachines();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.actionInProgress.clear();
  }

  fetchAvailableStatuses(): void {
    this.machineService.getAvailableStatuses()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(
        (response) => {
          this.availableStatuses = response.data;

          // add a new form control for each permission
          for (let string of this.availableStatuses) {
            this.form.addControl(string, this.fb.control(false));
          }
        },
        (error) => {
          console.error(error);
          this.notifyService.showError('Failed to fetch available statuses.');
        }
      );
  }

  searchMachines(): void {
    const searchParams: Partial<SearchParams> = this.buildSearchParams();

    this.machineService.searchMachines(searchParams).subscribe(
      response => {
        this.machines = response.data.content;
        this.totalMachines = response.data.totalElements;
        this.populateMAvailableActions();
      },
      error => {
        console.log(error);
        this.notifyService.showError('An unknown error occurred.');
      }
    );
  }

  private buildSearchParams(): Partial<SearchParams> {
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
      dateFrom: formValue.dateFrom, // We'll use string to hold the date-time data in ISO 8601 format
      dateTo: formValue.dateTo, // We'll use string to hold the date-time data in ISO 8601 format
      page: formValue.page,
      size: formValue.size
    };
  }

  startMachine(machineId: number) {
    const currentUser = this.currentUser;

    if (!currentUser) {
      this.notifyService.showError('User is not authenticated.');
      return;
    }

    const userPermissions = currentUser.permissions || [];

    if (!userPermissions.includes('can_start_machines')) {
      this.notifyService.showError('You do not have permission to start machines.');
      return;
    }

    this.machineService.startMachine(machineId).pipe(
      tap(() => {
        this.actionInProgress.set(machineId, true);
        this.notifyService.showSuccess('Machine is starting.');
        this.searchMachines();  // Fetch users again to update the list
      }),
      catchError((error) => {
        this.notifyService.showError('Failed to start the machine.');
        throw error;  // If you want to continue the error chain
      })
    ).subscribe({
      next: () => {
      },  // handle next value, if needed
      error: err => console.error(err),  // handle error
    });
  }

  restartMachine(machineId: number) {
    const currentUser = this.currentUser;

    if (!currentUser) {
      this.notifyService.showError('User is not authenticated.');
      return;
    }

    const userPermissions = currentUser.permissions || [];

    if (!userPermissions.includes('can_restart_machines')) {
      this.notifyService.showError('You do not have permission to restart machines.');
      return;
    }

    this.machineService.restartMachine(machineId).pipe(
      tap(() => {
        this.actionInProgress.set(machineId, true);
        this.notifyService.showSuccess('Machine is restarting.');
        this.searchMachines();  // Fetch users again to update the list
      }),
      catchError((error) => {
        this.notifyService.showError('Failed to restart the machine.');
        throw error;  // If you want to continue the error chain
      })
    ).subscribe({
      next: () => {
      },  // handle next value, if needed
      error: err => console.error(err),  // handle error
    });
  }

  stopMachine(machineId: number) {
    const currentUser = this.currentUser;

    if (!currentUser) {
      this.notifyService.showError('User is not authenticated.');
      return;
    }

    const userPermissions = currentUser.permissions || [];

    if (!userPermissions.includes('can_stop_machines')) {
      this.notifyService.showError('You do not have permission to stop machines.');
      return;
    }

    this.machineService.stopMachine(machineId).pipe(
      tap(() => {
        this.actionInProgress.set(machineId, true);
        this.notifyService.showSuccess('Machine is stopping.');
        this.searchMachines();  // Fetch users again to update the list
      }),
      catchError((error) => {
        this.notifyService.showError('Failed to stop the machine.');
        throw error;  // If you want to continue the error chain
      })
    ).subscribe({
      next: () => {
      },  // handle next value, if needed
      error: err => console.error(err),  // handle error
    });
  }

  mainMachineStatuses: string[] = ['RUNNING', 'STOPPED'];

  actionAllowed(status: string, action: string): boolean {
    if (action == "START") {
      if (status == 'STOPPED') {
        return true;
      }
    } else if (action == "STOP") {
      if (status == 'RUNNING') {
        return true;
      }
    } else if (action == "RESTART") {
      if (status == 'RUNNING') {
        return true;
      }
    } else if (action == "DESTROY") {
      if (status == 'STOPPED') {
        return true;
      }
    }
    return false;
  }

  private populateMAvailableActions() {
    this.machines.forEach(machine => {
      if (!this.mainMachineStatuses.includes(machine.status)) {
        this.actionInProgress.set(machine.id, true);
      }
    })
  }

  destroyMachine(machineId: number) {
    const currentUser = this.currentUser;

    if (!currentUser) {
      this.notifyService.showError('User is not authenticated.');
      return;
    }

    const userPermissions = currentUser.permissions || [];

    if (!userPermissions.includes('can_destroy_machines')) {
      this.notifyService.showError('You do not have permission to destroy machines.');
      return;
    }

    this.machineService.destroyMachine(machineId).pipe(
      tap(() => {
        this.actionInProgress.set(machineId, true);
        this.notifyService.showSuccess('Machine successfully destroyed.');
        this.searchMachines();  // Fetch users again to update the list
      }),
      catchError((error) => {
        this.notifyService.showError('Failed to destroy the machine.');
        throw error;  // If you want to continue the error chain
      })
    ).subscribe({
      next: () => {
      },  // handle next value, if needed
      error: err => console.error(err),  // handle error
    });
  }

  scheduleMachineAction(id: number) {

  }
}
