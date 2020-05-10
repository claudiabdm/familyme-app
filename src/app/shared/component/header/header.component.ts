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

  constructor(
    private dataService: DataService,
    private socketService: SocketioService,
  ) { }

  ngOnInit(): void {
  }

  get userList(): User[] {
    return this.dataService.userList;
  }

  get isShopping(): boolean {
    return this.dataService.user.isShopping;
  }

  onChecked() {
    this.dataService.user.isShopping = !this.isShopping;
    const text = this.dataService.user.isShopping ? "I'm shopping" : "I've finished shopping";
    this.socketService.sendMessage(text);
  }

}
