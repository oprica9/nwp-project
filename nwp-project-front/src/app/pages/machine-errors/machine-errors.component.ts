import {Component, OnDestroy, OnInit} from '@angular/core';
import {ErrorMessage} from "../../model/model.machine";
import {MachineService} from "../../service/machine/machine.service";
import {NotificationService} from "../../service/notification/notification.service";
import {Observable, Subject, throwError} from "rxjs";
import {catchError, takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-machine-errors',
  templateUrl: './machine-errors.component.html',
  styleUrls: ['./machine-errors.component.css']
})
export class MachineErrorsComponent implements OnInit, OnDestroy {

  // Public Fields
  errors: ErrorMessage[] = [];
  totalErrors: number = 0;
  page: number = 1;
  size: number = 10;

  // Private Fields
  private ngUnsubscribe = new Subject<void>();

  constructor(private machineService: MachineService, private notifyService: NotificationService) {
  }

  // Lifecycle Hooks
  ngOnInit(): void {
    this.fetchErrors();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Public Methods
  fetchErrors(): void {
    this.machineService.fetchErrors(this.page - 1, this.size).pipe(
      catchError(this.handleError.bind(this, 'An unknown error occurred.')),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: response => {
        this.errors = response.data.content;
        this.totalErrors = response.data.totalElements;
      },
      error: err => console.error(err)
    });
  }

  pageChanged(event: any): void {
    this.page = event;
    this.fetchErrors();
  }

  // Utility methods or handlers
  private handleError(message: string, error: any): Observable<never> {
    this.notifyService.showError(message);
    return throwError(error);
  }

}
