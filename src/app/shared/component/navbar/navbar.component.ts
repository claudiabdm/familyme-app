import { Component, OnInit, Input } from '@angular/core';
import { Route } from '@angular/compiler/src/core';
import { User } from 'src/app/models/user';
import { SocketioService } from 'src/app/services/socketio.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() user: User;


  constructor(
    private socketService: SocketioService
  ) {
  }

  get notificationsCounter() {
    return this.socketService.notificationsCounter;
  }

  ngOnInit(): void {
    this.socketService.setupSocketConnection();
    this.socketService.getMessages().subscribe(msg => {
      msg.userId !== this.user._id ? this.socketService.notificationsCounter += 1 : null;
    });
  }

}
