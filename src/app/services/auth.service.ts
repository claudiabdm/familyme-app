import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { FormGroup } from '@angular/forms';

import { UsersService } from './users.service';
import { User } from '../shared/models/user';
import { GroupsService } from './groups.service';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SocketioService } from './socketio.service';
import { switchMap } from 'rxjs/operators';
import { Group } from '../shared/models/group';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = `${environment.authUrl}`;

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private http: HttpClient,
    private usersService: UsersService,
    private groupsService: GroupsService,
    private socketService: SocketioService,
    public router: Router,
  ) { }

  logIn(user: { email: User['email'], password: User['password'] }): Observable<any> {
    return this.http.post<any>(`${this.url}/login`, user)
      .pipe(
        switchMap((res: {token: string}) => {
          this.storage.set('user-token', res.token);
          return this.usersService.setUserData();
        }),
        switchMap((user: User) => {
          return this.groupsService.getGroupByFamilyCode(user.familyCode);
        }),
        switchMap((group: Group) => {
          return this.usersService.getUsersByFamilyCode(group.familyCode);
        }),
      );
  }

  signUpCreate(user: FormGroup['value']): Observable<any> {
    return this.http.post(`${this.url}/sign-up-create`, user);
  }

  signUpJoin(user: FormGroup['value']): Observable<any> {
    return this.http.post(`${this.url}/sign-up-join`, user);
  }

  logOut(): void {
    this.storage.clear();
    this.socketService.socket.disconnect();
    this.router.navigate(['']);
  };
}
