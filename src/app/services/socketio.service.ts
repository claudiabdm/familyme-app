import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket: any;

  notificationsCounter: number = 0;

  constructor() { }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
  }

  sendMessage(msg: Message): void {
    this.socket.emit('new-message', msg)
  }

  getMessages(): Observable<Message> {
    return Observable.create((observer) => {
      this.socket.on('new-message', (msg) => {
        observer.next(msg)
      })
    })
  }

}
