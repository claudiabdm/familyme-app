import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable } from 'rxjs';

import { UsersService } from './users.service';
import { User } from '../models/user';
import { GroupsService } from './groups.service';
import { Group } from '../models/group';
import { FormGroup } from '@angular/forms';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: User;
  public userGroup: Group;
  public invalidUser: boolean = false;
  public invalidGroup: boolean = false;
  public invalidPassword: boolean = false;

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private usersService: UsersService,
    private groupsService: GroupsService,
    public router: Router) { }

  public setLocalStorage(): void {
    if (!this.storage.get('user')) {
      this.storage.set('user', this.user);
      this.storage.set('userGroup', this.userGroup);
    } else {
      this.user = this.storage.get('user');
      this.storage.set('user', this.user);
      this.userGroup = this.storage.get('userGroup');
      this.storage.set('userGroup', this.userGroup);
    }
  }

  public updateLocalStorage(item, value) {
    this.storage.set(item, value);
  }

  logIn(currUser: FormGroup["value"]): void {
    this.usersService.searchUserByEmail(currUser)
      .subscribe(user => {
        if (user) {
          this.invalidUser = false;
          if (currUser.password === user.password) {
            this.invalidPassword = false;
            this.groupsService.searchGroupByToken(user.groupToken).pipe(map(group => group[0]))
            .subscribe(group => {
              if (group) {
                this.invalidGroup = false;
                this.user = user;
                this.userGroup = group;
                this.setLocalStorage();
                this.router.navigate(['pages/home']);
              } else {
                this.invalidGroup = true;
              }
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

  signUpCreate(currUser: FormGroup["value"]): void {
    this.usersService.searchUserByEmail(currUser)
      .subscribe(user => {
        if (!user) {
          this.invalidUser = false;
          this.groupsService.createGroup(currUser.group)
            .subscribe(group => {
              delete currUser.group;
              this.usersService.createUser(currUser as User, group.token, 'admin').subscribe(user => {
                this.groupsService.addUserToGroup(user, group).subscribe(group => {
                  this.invalidGroup = false;
                  this.user = user;
                  this.userGroup = group;
                  this.setLocalStorage();
                  this.router.navigate(['pages/home']);
                }
                )
              })
            })
        } else {
          this.invalidUser = true;
        }
      })
  }

  signUpJoin(currUser: FormGroup["value"]): void {
    this.usersService.searchUserByEmail(currUser)
      .subscribe(user => {
        if (!user) {
          this.invalidUser = false;
          this.groupsService.searchGroupByToken(currUser.group).pipe(map(group => group[0]))
          .subscribe(group => {
            if (group) {
              delete currUser.group;
              this.usersService.createUser(currUser as User, group.token, '').subscribe(user => {
                this.groupsService.addUserToGroup(user, group).subscribe(group => {
                  this.invalidGroup = false;
                  this.user = user;
                  this.userGroup = group;
                  this.setLocalStorage();
                  this.router.navigate(['pages/home']);
                })
              })
            } else {
              this.invalidGroup = true;
            }
          })
        } else {
          this.invalidUser = true;
        }

      })
  }

  logOut(): void {
    this.storage.remove('user');
    this.storage.remove('userGroup');
  };
}
