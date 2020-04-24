import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SocketioService } from 'src/app/services/socketio.service';
import { DataService } from 'src/app/services/data.service';
import { Message } from 'src/app/models/message';
import { User } from 'src/app/models/user';

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

  constructor(
    private socketService: SocketioService,
    private dataService: DataService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.socketService.setupSocketConnection();
    this.socketService.getMessages().subscribe((msg: Message) => {
      const message: Message = msg;
      this.dataService.userList.some(user => {
        if (user._id === msg.userId) {
          message.userAvatar = user.avatar;
        }
      })
      this.messages.push(message);
      this.scrollToBottom();
      this.autoGrow();
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
    this.autoGrow();
  }

  sendMessage(form: FormGroup) {
    if (this.sendMessageForm.valid) {
      const newMsg: Message = {
        addedBy: this.dataService.user.name,
        userId: this.dataService.user._id,
        userAvatar: '',
        text: form.value.inputText,
        createdAt: new Date(Date.now()),
      };
      this.socketService.sendMessage(newMsg);
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
      behavior: 'smooth'
    })
  }

}
