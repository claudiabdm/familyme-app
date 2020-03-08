import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { UsersService } from './users.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: User;

  constructor(
    private usersService: UsersService,
    public router: Router) { }


  logIn(currUser: User) {
    this.usersService.searchUser(currUser)
      .subscribe(user => {
        if (user) {
          if (currUser.password === user.password) {
            this.user = user;
            this.router.navigate(['pages/home']);
          } else {
            console.log('Email or password incorrect');
          }
        }
        console.log('user not found')
        return false;
      }
      );
  }


}
