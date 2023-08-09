import {Injectable, OnDestroy} from '@angular/core';
import {Client, Frame, Message} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {BehaviorSubject, from, Subject} from 'rxjs';
import {takeUntil} from "rxjs/operators";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class WebsocketService implements OnDestroy {
  private client: Client;
  public messages: BehaviorSubject<any> = new BehaviorSubject(null);
  private connectionErrors = new Subject<Error | CloseEvent>();
  private ngUnsubscribe = new Subject<void>();

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${environment.appURL}/ws`),
    });

    this.client.onWebSocketClose = (event: CloseEvent) => {
      if (!event.wasClean) {
        this.connectionErrors.next(new Error(`WebSocket connection closed ${event.code ? `(code: ${event.code})` : ''}`));
      }
    };

    this.client.onStompError = (frame: Frame) => {
      this.connectionErrors.next(new Error(`STOMP error: ${frame.headers['message']}`));
    };
  }

  public connect(token?: string): void {
    this.client.onConnect = () => {
      this.client.subscribe('/topic/machine-status', (message: Message) => {
        this.messages.next(JSON.parse(message.body));
      });
    };

    if (token) {
      this.client.connectHeaders = {Authorization: `Bearer ${token}`};
    }

    this.client.activate();
  }

  public disconnect(): void {
    from(this.client.deactivate())
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe();
  }

  public sendMessage(destination: string, body: any): void {
    this.client.publish({destination, body: JSON.stringify(body)});
  }

  public getErrors() {
    return this.connectionErrors.asObservable();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
    this.disconnect();
  }
}
