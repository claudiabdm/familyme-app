import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, Observer, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/internal/operators/map';
import * as io from 'socket.io-client';

import { Message } from '../shared/models/message';
import { DataService } from './data.service';
import { take } from 'rxjs/operators';
import { Group } from '../shared/models/group';

@Injectable({
  providedIn: 'root',
})
export class SocketioService {
  socket: any;
  private _notificationsCounter: BehaviorSubject<number> = new BehaviorSubject(
    0
  );
  notificationsCounter$: Observable<
    number
  > = this._notificationsCounter.asObservable();
  private _messagesSource: BehaviorSubject<Message[]> = new BehaviorSubject(
    null
  );
  messages$: Observable<Message[]> = this._messagesSource.asObservable();

  constructor(private http: HttpClient, private dataService: DataService) {}

  setupSocketConnection(groupId: Group['_id']) {
    this.socket = io(environment.SOCKET_ENDPOINT);
    this.socket.emit('join', groupId);
  }

  setMessages(msgs: Message[]) {
    this._messagesSource.next(msgs);
  }

  addMessage(msg: Message) {
    const current = this._messagesSource.getValue();
    current.push(msg);
    this._messagesSource.next(current);
  }

  resetNotifications(): void {
    this._notificationsCounter.next(0);
  }

  sendMessage(msg: string): void {
    const newMsg: Message = {
      groupId: this.dataService.getGroup()._id,
      addedBy: this.dataService.getUser().name,
      userId: this.dataService.getUser()._id,
      text: msg,
      createdAt: new Date(Date.now()),
    };
    this.socket.emit('chat', newMsg);
  }

  getMessage(): Observable<Message> {
    return Observable.create((observer: Observer<Message>) => {
      this.socket.on('received', (msg: Message) => {
        if (
          this.dataService.getUser()?.notificationsOn &&
          msg.userId !== this.dataService.getUser()._id
        ) {
          const total = this._notificationsCounter.getValue() + 1;
          this._notificationsCounter.next(total);
          this.getBrowserNotification(msg);
        }
        this.dataService.getMembers().some((user) => {
          if (user._id === msg.userId) {
            msg.userAvatar = user.avatar;
          }
        });
        observer.next(msg);
      });
    });
  }

  getAllMessages(groupId: Group['_id']): Observable<Message[]> {
    return this.http
      .get<Message[]>(`${environment.apiUrl}messages/${groupId}`)
      .pipe(
        map((messages: Message[]) => {
          messages.map((msg) => {
            if (
              this.dataService.getUser()?.notificationsOn &&
              msg.createdAt > this.dataService.getUser().lastConnection &&
              msg.userId !== this.dataService.getUser()?._id
            ) {
              const total = this._notificationsCounter.getValue() + 1;
              this._notificationsCounter.next(total);
            }
            this.dataService.getMembers().some((user) => {
              if (user._id === msg.userId) {
                msg.userAvatar = user.avatar;
              }
            });
          });
          return messages;
        }),
        take(1)
      );
  }

  private getBrowserNotification(msg: Message): void {
    const notification = new Notification('FamilyMe', {
      icon: '/assets/icons/favicon-96x96.png',
      body: `${msg.addedBy}: ${msg.text}`,
    });
    notification.addEventListener(
      'click',
      (event) => {
        event.preventDefault();
        window.open(`${environment.siteUrl}pages/notifications`, '_blank');
        notification.close();
        this.resetNotifications();
      },
      { once: true }
    );
  }
}
