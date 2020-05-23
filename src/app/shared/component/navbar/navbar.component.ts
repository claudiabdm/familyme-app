import { Component, OnInit, Input } from '@angular/core';

import { User } from 'src/app/shared/models/user';
import { SocketioService } from 'src/app/services/socketio.service';
import { DataService } from 'src/app/services/data.service';
import { Observable, Subject, concat } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { GroupsService } from 'src/app/services/groups.service';
import { takeUntil, switchMap, concatMap } from 'rxjs/operators';
import { Group } from '../../models/group';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  user: Observable<User>;
  notificationsCounter: Observable<number>;
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private socketService: SocketioService,
    private dataService: DataService,
    private usersService: UsersService,
    private groupsService: GroupsService
  ) {
  }

  ngOnInit(): void {
    this.usersService.getLoggedUser().pipe(
      switchMap((user: User) => {
        return this.groupsService.getGroupByFamilyCode(user.familyCode);
      }),
      switchMap((group: Group) => {
        return this.usersService.getUsersByFamilyCode(group.familyCode);
      }),
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(() => { });
    this.user = this.dataService.userData$;
    this.notificationsCounter = this.socketService.notificationsCounter$;
  }

}
