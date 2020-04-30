import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { UsersService } from './users.service';
import { User } from '../shared/models/user';
import { GroupsService } from './groups.service';
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
    private spinner: NgxSpinnerService,
    public router: Router) { }

  logIn(currUser: FormGroup["value"]): void {
    this.storage.clear();
    this.spinner.show();
    this.usersService.searchUserByEmail(currUser)
      .subscribe(user => {
        if (user) {
          this.invalidUser = false;
          if (currUser.password === user.password) {
            this.invalidPassword = false;
            this.groupsService.searchGroupByToken(user.familyCode)
              .subscribe(group => {

                if (group) {
                  this.invalidGroup = false;
                  this.usersService.getUsersByGroupToken(user.familyCode).subscribe(users => {

                    this.dataService.setData(user, group, users);
                    this.spinner.hide();
                    this.router.navigate(['pages/home']);
                  })
                } else {
                  this.spinner.hide();
                  this.invalidGroup = true;
                }
              });
          } else {
            this.spinner.hide();
            this.invalidPassword = true;
          }
        } else {
          this.spinner.hide();
          this.invalidUser = true;
        }
      }
      );
  }

  signUpCreate(currUser: FormGroup["value"]): void {
    this.storage.clear();
    this.spinner.show();
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
                  this.usersService.getUsersByGroupToken(user.familyCode).subscribe(users => {
                    this.dataService.setData(user, group, users);
                    this.spinner.hide();
                    this.router.navigate(['pages/home']);
                  })
                }
                )
              })
            })
        } else {
          this.invalidUser = true;
          this.spinner.hide();
        }
      })
  }

  signUpJoin(currUser: FormGroup["value"]): void {
    this.storage.clear();
    this.spinner.show();
    this.usersService.searchUserByEmail(currUser)
      .subscribe(user => {
        if (!user) {
          this.invalidUser = false;
          this.groupsService.searchGroupByToken(currUser.group)
            .subscribe(group => {
              if (group) {
                delete currUser.group;
                this.usersService.createUser(currUser as User, group, '').subscribe(user => {
                  this.groupsService.addUserToGroup(user, group).subscribe(group => {
                    this.invalidGroup = false;
                    this.usersService.getUsersByGroupToken(user.familyCode).subscribe(users => {
                      this.dataService.setData(user, group, users);
                      this.spinner.hide();
                      this.router.navigate(['pages/home']);
                    })
                  })
                })
              } else {
                this.spinner.hide();
                this.invalidGroup = true;
              }
            })
        } else {
          this.spinner.hide();
          this.invalidUser = true;
        }

      })
  }

  logOut(): void {
    this.storage.clear();
  };
}
