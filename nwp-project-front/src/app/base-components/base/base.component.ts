import {Component, OnDestroy, OnInit} from '@angular/core';
import {filter, Observable, Subject, tap, throwError} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {ErrorHandlerService} from "../../errors/service/error-handler.service";
import {NotificationService} from "../../service/impl/notification/notification.service";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export abstract class BaseComponent implements OnInit, OnDestroy {

  // Private Fields
  private ngUnsubscribe = new Subject<void>();

  protected constructor(protected errorService: ErrorHandlerService, protected notifyService: NotificationService) {
  }

  // Lifecycle Hooks
  ngOnInit(): void {
    this._setUpErrorHandling()
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  // Public Methods
  protected isFormControlInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return control!.invalid && (control!.dirty || control!.touched);
  }

  protected get unsubscribeSignal$(): Observable<void> {
    return this.ngUnsubscribe.asObservable();
  }

  // Private Methods
  private _setUpErrorHandling() {
    this.errorService.error$.pipe(
      filter(errorMessage => !!errorMessage),
      takeUntil(this.ngUnsubscribe)
    ).subscribe({
      next: (errorMessage) => {
        this.notifyService.showError(errorMessage);
      },
      error: err => console.error(err)
    });
  }

}
