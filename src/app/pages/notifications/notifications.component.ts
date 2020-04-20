import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { SocketioService } from 'src/app/services/socketio.service';
import { DataService } from 'src/app/services/data.service';
import { Message } from 'src/app/models/message';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, AfterViewChecked {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  @ViewChild('inputTextElem') private myInputText: ElementRef;

  currentUser: boolean;
  loggedUserId: User['_id'] = this.dataService.user._id;
  messages: Message[] = [];


  sendMessageForm = this.formBuilder.group({
    inputText: ['', Validators.required],
  })

  constructor(
    private socketService: SocketioService,
    private dataService: DataService,
    private usersService: UsersService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.socketService.setupSocketConnection();
    this.socketService.getMessages().subscribe((msg: Message) => {
      this.usersService.getUserById(msg.addedBy).subscribe(user => {
        const message: Message = {
          addedBy: user.name,
          userId: msg.addedBy,
          userAvatar: user.avatar,
          text: msg.text,
          createdAt: msg.createdAt,
        } as Message;
        this.messages.push(message);
        this.scrollToBottom();
        this.autoGrow();
      });
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  sendMessage(form: FormGroup) {
    if (this.sendMessageForm.valid) {
      const newMsg: Message = {
        addedBy: this.dataService.user._id,
        text: form.value.inputText,
        createdAt: new Date(Date.now()),
      } as Message;
      this.socketService.sendMessage(newMsg);
      this.sendMessageForm.value.inputText = '';
      form.reset();
    }
  }

  disableNewLine(e) {
    e.preventDefault();
  }

  autoGrow(): void {
    this.sendMessageForm.value.inputText ? this.myInputText.nativeElement.style.setProperty('--text-area-height', this.myInputText.nativeElement.scrollHeight / 16 + 'rem') : this.myInputText.nativeElement.style.setProperty('--text-area-height', 30 / 16 + 'rem');
  }

  private scrollToBottom(): void {
    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    })
  }

}
