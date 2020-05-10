import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SESSION_STORAGE, LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

import { UsersService } from './users.service';
import { User } from '../shared/models/user';
import { GroupsService } from './groups.service';
import { DataService } from './data.service';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { map } from 'rxjs/internal/operators/map';
import { SocketioService } from './socketio.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public invalidUser: boolean = false;
  public invalidGroup: boolean = false;
  public invalidPassword: boolean = false;

  // url = `${environment.authUrl}`;

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private http: HttpClient,
    private usersService: UsersService,
    private groupsService: GroupsService,
    private dataService: DataService,
    private spinner: NgxSpinnerService,
    private socketService: SocketioService,
    public router: Router,
    ) { }

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

  // logIn(user: { email: User['email'], password: User['password'] }): Observable<any> {
  //   return this.http.post<any>(`${this.url}/login`, user);
  // }

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
    this.socketService.socket.disconnect();
  };
}
