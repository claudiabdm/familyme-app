import { Component, OnInit, Input } from '@angular/core';
import { Button } from 'src/app/models/button';
import { DataService } from 'src/app/services/data.service';
import { ModalComponent } from '../modal/modal.component';
import { SocketioService } from 'src/app/services/socketio.service';
import { Message } from 'src/app/models/message';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() button: Button;
  @Input() targetModal: ModalComponent;
  @Input() switchVisible: boolean = false;

  isShopping: boolean = false;

  constructor(
    private dataService: DataService,
    private socketService: SocketioService,
  ) { }

  ngOnInit(): void {

  }

  get userList() {
    return this.dataService.userList;
  }

  onChecked(isShopping: boolean) {
    this.socketService.setupSocketConnection();
    this.isShopping = !isShopping;
    let text = this.isShopping ? "I'm shopping" : "I've finished shopping";
    const newMsg: Message = {
      addedBy: this.dataService.user._id,
      text: text,
      createdAt: new Date(Date.now()),
    } as Message;
    this.socketService.sendMessage(newMsg);
  }

  }
