import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import * as io from 'socket.io-client';

import { Message } from '../shared/models/message';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {

  socket: any;

  notificationsCounter: number = 0;

  constructor(
    private http: HttpClient,
    private dataService: DataService
  ) { }

  setupSocketConnection() {
    this.socket = io(environment.SOCKET_ENDPOINT);
  }

  sendMessage(msg: string): void {
    const newMsg: Message = {
      groupId: this.dataService.userGroup._id,
      addedBy: this.dataService.user.name,
      userId: this.dataService.user._id,
      text: msg,
      createdAt: new Date(Date.now()),
    };
    this.socket.emit('chat', newMsg);
  }

  getMessage(): Observable<Message> {
    return Observable.create((observer: Observer<Message>) => {
      this.socket.on('received', (msg: Message) => {
        this.dataService.userList.some(user => {
          if (user._id === msg.userId) {
            msg.userAvatar = user.avatar;
          };
        });
        observer.next(msg);
      })
    })
  }

  getAllMessages(): Observable<Message[]> {
    return this.http.get<Message[]>(`${environment.apiUrl}messages/${this.dataService.userGroup._id}`)
      .pipe(
        map(messages => {
          messages.map(msg => {
            this.dataService.userList.some(user => {
              if (user._id === msg.userId) {
                msg.userAvatar = user.avatar;
              }
            });
          });
        return messages;
        })
      );
  }
}
