import { Injectable } from '@angular/core';
import { Client, Frame } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private client: Client;
  public messages: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor() {
    this.client = new Client({
      webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
    });
  }

  public connect(token?: string): void {
    // When the client connects, subscribe to a topic
    this.client.onConnect = (frame: Frame) => {
      this.client.subscribe('/topic/machine-status', message => {
        this.messages.next(JSON.parse(message.body));
      });
    };

    // If a token is provided, use it in the connect headers
    if (token) {
      this.client.connectHeaders = { Authorization: `Bearer ${token}` };
    }

    // Activate the client
    this.client.activate();
  }

  public disconnect(): void {
    this.client.deactivate();
  }

  public sendMessage(destination: string, body: any): void {
    this.client.publish({ destination, body: JSON.stringify(body) });
  }
}
