import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable } from 'rxjs';

import { UsersService } from './users.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;
  usersGroup: User[];
  invalidUser: boolean = false;
  invalidPassword: boolean = false;

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private usersService: UsersService,
    public router: Router) {
      if (!storage.get('user')) {
        storage.set('user', this.user);
        storage.set('usersGroup', this.usersGroup);
      } else {
        this.user = storage.get('user');
        this.usersGroup = storage.get('usersGroup');
      }
     }


  logIn(currUser: User) {
    this.usersService.searchUser(currUser)
      .subscribe(user => {
        if (user) {
          this.invalidUser = false;
          if (currUser.password === user.password) {
            this.invalidPassword = false;
            this.user = user;
            this.usersService.getUsersByGroup(user.group).subscribe(res => {
              this.usersGroup = res;
              this.router.navigate(['pages/home']);
            });
          } else {
            this.invalidPassword = true;
          }
        } else {
          this.invalidUser = true;
        }
      }
      );
  }

  signUp(currUser: User) {

  }

}
