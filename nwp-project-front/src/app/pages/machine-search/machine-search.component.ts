import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MachineService} from "../../service/machine/machine.service";
import {MachineDTO} from "../../model/machine";
import {NotificationService} from "../../service/notification/notification.service";
import {SearchParams} from '../../model/machine';
import {filter, takeUntil} from "rxjs/operators";
import {Subject} from 'rxjs';
import {WebsocketService} from "../../service/websocket/websocket.service";



@Component({
  selector: 'app-machine-search',
  templateUrl: './machine-search.component.html',
  styleUrls: ['./machine-search.component.css']
})
export class MachineSearchComponent implements OnInit, OnDestroy  {

  public form: FormGroup;
  machines: MachineDTO[] = [];
  availableStatuses: string[] = [];
  totalMachines: number = 0;
  page: number = 1;
  size: number = 10;
  private ngUnsubscribe = new Subject<void>();

  constructor(private fb: FormBuilder, private machineService: MachineService, private notifyService: NotificationService, private websocketService: WebsocketService) {
    this.form = this.fb.group({
      name: [''],
      statuses: [[]],
      dateFrom: [''],
      dateTo: [''],
      page: [0],
      size: [10]
    });
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
        }
      }
    });
    /*
    this.websocketService.getConnectionStatus().pipe(
      filter(connected => connected) // Only pass through values when connected is true
    ).subscribe(() => {
      this.websocketService.subscribeToMessages().subscribe((message) => {
        // Parse the message and update the corresponding machine in the machines array
        console.log('Received WebSocket message:', message);
        const updatedMachine: MachineDTO = JSON.parse(message);
        const index = this.machines.findIndex((machine) => machine.id === updatedMachine.id);
        if (index !== -1) {
          this.machines[index] = updatedMachine;
        }
      });
    });*/

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
      },
      error => {
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


}
