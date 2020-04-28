import { Component, OnInit, Input } from '@angular/core';

import { User } from 'src/app/models/user';
import { SocketioService } from 'src/app/services/socketio.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  constructor(
    private socketService: SocketioService,
    private dataService: DataService
  ) {
  }

  get user(): User {
    return this.dataService.user;
  }

  get notificationsCounter(): number {
    return this.socketService.notificationsCounter;
  }

  ngOnInit(): void {
    this.socketService.setupSocketConnection();
    this.socketService.getMessages().subscribe(msg => {
      msg.userId !== this.user._id ? this.socketService.notificationsCounter += 1 : null;
    });
  }

}
