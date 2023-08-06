import { Component, OnInit } from '@angular/core';
import {ErrorMessageDTO} from "../../model/machine";
import {MachineService} from "../../service/machine/machine.service";
import {NotificationService} from "../../service/notification/notification.service";

@Component({
  selector: 'app-machine-errors',
  templateUrl: './machine-errors.component.html',
  styleUrls: ['./machine-errors.component.css']
})
export class MachineErrorsComponent implements OnInit {
  errors: ErrorMessageDTO[] = [];
  totalErrors: number = 0;
  page: number = 1;
  size: number = 10;

  constructor(private machineService: MachineService, private notifyService: NotificationService) { }

  ngOnInit(): void {
    this.fetchErrors();
  }

  fetchErrors(): void {
    this.machineService.fetchErrors(this.page - 1, this.size).subscribe(
      response => {
        this.errors = response.data.content;
        this.totalErrors = response.data.totalElements;
      },
      error => {
        this.notifyService.showError('An unknown error occurred.');
      }
    );
  }

  pageChanged(event: any): void {
    console.log(event)
    this.page = event;
    this.fetchErrors();
  }

}
