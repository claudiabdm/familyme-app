import { Component, OnInit, Input } from '@angular/core';
import { Button } from 'src/app/shared/models/button';
import { DataService } from 'src/app/services/data.service';
import { ModalComponent } from '../modal/modal.component';
import { SocketioService } from 'src/app/services/socketio.service';
import { Message } from 'src/app/shared/models/message';
import { User } from 'src/app/shared/models/user';

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

  get userList(): User[] {
    return this.dataService.userList;
  }

  ngOnInit(): void {

  }

  onChecked(isShopping: boolean) {
    this.socketService.setupSocketConnection();
    this.isShopping = !isShopping;
    let text = this.isShopping ? "I'm shopping" : "I've finished shopping";
    const newMsg: Message = {
      addedBy: this.dataService.user.name,
      userId: this.dataService.user._id,
      userAvatar: '',
      text: text,
      createdAt: new Date(Date.now()),
    };
    this.socketService.sendMessage(newMsg);
  }

}
