import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UsersService } from './users.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;
  invalidUser: boolean = false;
  invalidPassword: boolean = false;

  constructor(
    private usersService: UsersService,
    public router: Router) { }


  logIn(currUser: User) {
    this.usersService.searchUser(currUser)
      .subscribe(user => {
        if (user) {
          this.invalidUser = false;
          if (currUser.password === user.password) {
            this.invalidPassword = false;
            this.user = user;
            this.router.navigate(['pages/home']);
          } else {
            this.invalidPassword = true;
          }
        } else {
          this.invalidUser = true;
        }
      }
      );
  }


}
