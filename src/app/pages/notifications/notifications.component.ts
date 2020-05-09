import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';

import { SocketioService } from 'src/app/services/socketio.service';
import { DataService } from 'src/app/services/data.service';
import { Message } from 'src/app/shared/models/message';
import { User } from 'src/app/shared/models/user';
import { first } from 'rxjs/internal/operators/first';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('inputTextElem') private myInputText: ElementRef;

  loggedUserId: User['_id'] = this.dataService.user._id;
  messages: Message[] = [];

  sendMessageForm = this.formBuilder.group({
    inputText: ['', Validators.required],
  })

  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private socketService: SocketioService,
    private dataService: DataService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.socketService.getAllMessages().pipe(first()).subscribe((msgs: Message[]) => {
      this.messages = msgs;
      this.scrollToBottom();
      this.autoGrow();
      this.socketService.notificationsCounter = 0;
    });
    this.socketService.getMessage().pipe(takeUntil(this.ngUnsubscribe$)).subscribe((msg: Message) => {
      this.messages.push(msg);
      this.socketService.notificationsCounter = 0;
    });
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

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
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
      behavior: 'smooth'
    })
  }

}
