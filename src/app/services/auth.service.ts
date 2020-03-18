import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Observable } from 'rxjs';

import { UsersService } from './users.service';
import { User } from '../models/user';
import { GroupsService } from './groups.service';
import { Group } from '../models/group';
import { FormGroup } from '@angular/forms';
import { map, takeUntil } from 'rxjs/operators';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public invalidUser: boolean = false;
  public invalidGroup: boolean = false;
  public invalidPassword: boolean = false;

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private usersService: UsersService,
    private groupsService: GroupsService,
    private dataService: DataService,
    public router: Router) { }

  logIn(currUser: FormGroup["value"]): void {
    this.storage.clear();
    this.usersService.searchUserByEmail(currUser)
      .subscribe(user => {
        if (user) {
          this.invalidUser = false;
          if (currUser.password === user.password) {
            this.invalidPassword = false;
            this.groupsService.searchGroupByToken(user.groupToken)
            .subscribe(group => {
              if (group) {
                this.invalidGroup = false;
                this.usersService.getUsersByGroupToken(user.groupToken).subscribe(users => {
                  this.dataService.setData(user, group, users);
                  this.router.navigate(['pages/home']);
                })
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
    this.storage.clear();
    this.usersService.searchUserByEmail(currUser)
      .subscribe(user => {
        if (!user) {
          this.invalidUser = false;
          this.groupsService.createGroup(currUser.group)
            .subscribe(newGroup => {
              delete currUser.group;
              this.usersService.createUser(currUser as User, newGroup, 'admin').subscribe(user => {
                this.groupsService.addUserToGroup(user, newGroup).subscribe(group => {
                  this.invalidGroup = false;
                  this.usersService.getUsersByGroupToken(user.groupToken).subscribe(users => {
                    this.dataService.setData(user, group, users);
                    this.router.navigate(['pages/home']);
                  })
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
    this.storage.clear();
    this.usersService.searchUserByEmail(currUser)
      .subscribe(user => {
        if (!user) {
          this.invalidUser = false;
          this.groupsService.searchGroupByToken(currUser.group).pipe(map(group => group[0]))
            .subscribe(group => {
              if (group) {
                delete currUser.group;
                this.usersService.createUser(currUser as User, group, '').subscribe(user => {
                  this.groupsService.addUserToGroup(user, group).subscribe(group => {
                    this.invalidGroup = false;
                    this.usersService.getUsersByGroupToken(user.groupToken).subscribe(users => {
                      this.dataService.setData(user, group, users);
                      this.router.navigate(['pages/home']);
                    })
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
    this.storage.clear();
  };
}
