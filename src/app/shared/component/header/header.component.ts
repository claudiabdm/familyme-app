import { Component, OnInit, Input } from '@angular/core';
import { Button } from 'src/app/shared/models/button';
import { DataService } from 'src/app/services/data.service';
import { ModalComponent } from '../modal/modal.component';
import { SocketioService } from 'src/app/services/socketio.service';
import { Message } from 'src/app/shared/models/message';
import { User } from 'src/app/shared/models/user';
import { Observable } from 'rxjs/internal/Observable';
import { map } from 'rxjs/internal/operators/map';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() button: Button;
  @Input() targetModal: ModalComponent;
  @Input() switchVisible: boolean = false;

  userList: Observable<User[]>;
  isShopping: Observable<boolean>;

  constructor(
    private dataService: DataService,
    private socketService: SocketioService,
  ) { }

  ngOnInit(): void {
    this.userList = this.dataService.membersData$;
    this.isShopping = this.dataService.userData$.pipe(map(user => user.isShopping));
  }

  onChecked() {
    const user = this.dataService.getUser();
    user.isShopping = !user.isShopping;
    const text = user.isShopping ? "I'm shopping" : "I've finished shopping";
    this.dataService.setUser(user);
    this.socketService.sendMessage(text);
  }

}
