import { Component, OnInit, Input } from '@angular/core';

import { User } from 'src/app/shared/models/user';
import { SocketioService } from 'src/app/services/socketio.service';
import { DataService } from 'src/app/services/data.service';
import { first } from 'rxjs/internal/operators/first';

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

  ngOnInit(): void {
  }

  get notificationsCounter(): number {
    return this.socketService.notificationsCounter;
  }

  get user(): User {
    return this.dataService.user;
  }

}
