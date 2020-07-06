import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SocketioService } from 'src/app/services/socketio.service';
import { DataService } from 'src/app/services/data.service';
import { Message } from 'src/app/shared/models/message';
import { User } from 'src/app/shared/models/user';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { UsersService } from 'src/app/services/users.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('inputTextElem') private myInputText: ElementRef;

  loggedUser$: Observable<User>;
  messages$: Observable<Message[]>;
  sendMessageForm = this.formBuilder.group({
    inputText: ['', Validators.required],
  })

  img = '/assets/img/profile-photo-round.svg';

  constructor(
    private socketService: SocketioService,
    private dataService: DataService,
    private usersService: UsersService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.loggedUser$ = this.dataService.userData$;
    this.messages$ = this.socketService.messages$.pipe(tap(() => this.socketService.resetNotifications()));
  }

  ngOnDestroy(): void {
    const user = this.dataService.getUser(); 
    user.lastConnection = new Date();
    this.usersService.updateUserData(user).pipe(take(1)).subscribe();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
    this.autoGrow();
  }

  sendMessage(form: FormGroup): void {
    if (this.sendMessageForm.valid) {
      this.socketService.sendMessage(form.value.inputText);
      this.sendMessageForm.value.inputText = '';
      form.reset();
    }
  }

  disableNewLine(e: Event): void {
    e.preventDefault();
  }

  private autoGrow(): void {
    if (this.sendMessageForm.value.inputText) {
      this.myInputText.nativeElement.style.setProperty('--text-area-height', this.myInputText.nativeElement.scrollHeight / 16 + 'rem')
    } else {
      this.myInputText.nativeElement.style.setProperty('--text-area-height', 30 / 16 + 'rem');
    }
  }

  private scrollToBottom(): void {
    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      left: 0,
    })
  }

}
