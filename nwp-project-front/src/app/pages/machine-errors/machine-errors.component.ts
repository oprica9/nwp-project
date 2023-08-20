import {Component} from '@angular/core';
import {ErrorMessage} from "../../model/model.machine";
import {MachineService} from "../../service/impl/machine/machine.service";
import {NotificationService} from "../../service/impl/notification/notification.service";
import {takeUntil} from "rxjs/operators";
import {BaseComponent} from "../../base-components/base/base.component";
import {ErrorHandlerService} from "../../errors/service/error-handler.service";

@Component({
  selector: 'app-machine-errors',
  templateUrl: './machine-errors.component.html',
  styleUrls: ['./machine-errors.component.css']
})
export class MachineErrorsComponent extends BaseComponent {

  // Public Fields
  errors: ErrorMessage[] = [];
  totalErrors: number = 0;
  page: number = 1;
  size: number = 10;

  constructor(private machineService: MachineService,
              protected errorService: ErrorHandlerService,
              protected notifyService: NotificationService
  ) {
    super(errorService, notifyService)
  }

  // Lifecycle Hooks
  ngOnInit(): void {
    super.ngOnInit();
    this.fetchErrors();
  }

  // Public Methods
  fetchErrors(): void {
    this.machineService.fetchErrors(this.page - 1, this.size).pipe(
      takeUntil(this.unsubscribeSignal$)
    ).subscribe({
      next: response => {
        this.errors = response.data.content;
        this.totalErrors = response.data.totalElements;
      }
    });
  }

  pageChanged(event: any): void {
    this.page = event;
    this.fetchErrors();
  }

}
