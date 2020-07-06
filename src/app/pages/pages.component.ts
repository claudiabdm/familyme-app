import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { Button } from '../shared/models/button';
import {
  filter,
  takeUntil,
  map,
  switchMap,
  tap,
  take,
  concatMap,
} from 'rxjs/operators';
import { SocketioService } from '../services/socketio.service';
import { UsersService } from '../services/users.service';
import { User } from '../shared/models/user';
import { Group } from '../shared/models/group';
import { GroupsService } from '../services/groups.service';
import { Message } from '../shared/models/message';
import { DataService } from '../services/data.service';
@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
})
export class PagesComponent implements OnInit {
  public navbarVisible: boolean = false;
  public headerVisible: boolean = false;
  public gridActive: boolean = false;
  public gridAll: boolean = false;
  public button: Button;
  public switchVisible: boolean = false;
  private currentRoute: string;
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    public router: Router,
    private socketService: SocketioService,
    private usersService: UsersService,
    private groupsService: GroupsService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.usersService
      .getLoggedUser()
      .pipe(
        concatMap((user: User) => {
          this.dataService.setUser(user);
          return this.groupsService.getGroupByFamilyCode(user.familyCode);
        }),
        switchMap((group: Group) => {
          this.socketService.setupSocketConnection(group._id);
          return this.usersService
            .getUsersByFamilyCode(group.familyCode)
            .pipe(map(() => group));
        }),
        concatMap((group: Group) => {
          this.dataService.setGroup(group);
          return this.socketService.getAllMessages(group._id);
        }),
        switchMap((msgs: Message[]) => {
          this.socketService.setMessages(msgs);
          return this.socketService.getMessage();
        }),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe();
    this.setLayout().subscribe();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  private setLayout(): Observable<any> {
    this.currentRoute = this.router.url;
    this.toggleHeaderNavbar(this.currentRoute);
    this.changeButton(this.currentRoute);
    return this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((res) => {
        this.currentRoute = res.url;
        this.changeButton(this.currentRoute);
        this.toggleHeaderNavbar(this.currentRoute);
      }),
      takeUntil(this.ngUnsubscribe$)
    );
  }

  private toggleHeaderNavbar(currentRoute) {
    if (
      currentRoute === '/pages/home' ||
      currentRoute === '/pages/notifications'
    ) {
      this.headerVisible = false;
      this.navbarVisible = true;
      this.gridActive = true;
      this.gridAll = false;
    } else {
      this.headerVisible = true;
      this.navbarVisible = true;
      this.gridActive = true;
      this.gridAll = true;
    }
  }

  private changeButton(currentRoute): void {
    switch (currentRoute) {
      case '/pages/calendar':
        this.button = {
          id: 'newEventBtn',
          name: 'New event',
          modal: 'newEventModal',
        };
        this.switchVisible = false;
        break;
      case '/pages/locator':
        this.button = {
          id: 'newPlaceBtn',
          name: 'New place',
          modal: 'newPlaceModal',
        };
        this.switchVisible = false;
        break;
      case '/pages/list':
        this.switchVisible = true;
        break;
    }
  }
}
