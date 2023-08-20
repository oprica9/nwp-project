import {Injectable} from '@angular/core';
import {Client, Frame, Message} from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import {BehaviorSubject, Subject} from 'rxjs';
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private client: Client;
  public messages: BehaviorSubject<any> = new BehaviorSubject(null);
  private connectionErrors = new Subject<Error | CloseEvent>();

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
    this.client.deactivate()
      .catch(error => {
        console.error('Error disconnecting from WebSocket:', error);
      });
  }

}
