import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { FormGroup } from '@angular/forms';

import { UsersService } from './users.service';
import { User } from '../shared/models/user';
import { GroupsService } from './groups.service';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { SocketioService } from './socketio.service';
import { switchMap, take, tap, map } from 'rxjs/operators';
import { Group } from '../shared/models/group';
import { DataService } from './data.service';
import { SignUpType } from '../shared/models/signup';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  url = `${environment.authUrl}`;

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private http: HttpClient,
    private dataService: DataService,
    private usersService: UsersService,
    private groupsService: GroupsService,
    private socketService: SocketioService,
    public router: Router,
  ) { }

  logIn(user: { email: User['email'], password: User['password'] }): Observable<boolean> {
    return this.http.post<any>(`${this.url}/login`, user)
      .pipe(
        tap((res: { token: string }) => this.storage.set('user-token', res.token)),
        switchMap(() => {
          return this.usersService.getLoggedUser();
        }),
        switchMap((user: User) => {
          return this.groupsService.getGroupByFamilyCode(user.familyCode);
        }),
        switchMap((group: Group) => {
          return this.usersService.getUsersByFamilyCode(group.familyCode);
        }),
        map((users: User[]) => {
          return users ? true : false;
        }),
        tap((res: boolean) => {if(res){this.router.navigate(['pages/home'])}})
      );
  }

  signUp(signUpType: SignUpType['id'], user: FormGroup['value']): Observable<boolean> {
    switch (signUpType) {
      case 'createModal':
        return this.signUpCreate(user);
      case 'joinModal':
        return this.signUpJoin(user);
    }
  }

  signUpCreate(user: FormGroup['value']): Observable<any> {
    return this.http.post(`${this.url}/sign-up-create`, user).pipe(
      tap(() => this.router.navigate(['/login'])),
    );
  }

  signUpJoin(user: FormGroup['value']): Observable<any> {
    return this.http.post(`${this.url}/sign-up-join`, user).pipe(
      tap(() => this.router.navigate(['/login']))
    );
  }

  logOut(): void {
    const user = this.dataService.getUser();
    user.lastConnection = new Date();
    this.usersService.updateUserData(user).pipe(take(1)).subscribe(
      () => {
        this.socketService.socket.disconnect();
        this.storage.clear();
        this.router.navigate(['']);
      }
    );
  };
}
