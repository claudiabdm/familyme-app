import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';

import { User } from '../shared/models/user';
import { environment } from 'src/environments/environment';
import { DataService } from './data.service';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Router } from '@angular/router';
import { SocketioService } from './socketio.service';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private url = `${environment.apiUrl}users`;

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private router: Router,
    private http: HttpClient,
    private dataService: DataService,
    private socketService: SocketioService) { }

  getLoggedUser(): Observable<User> {
    return this.http.get<User>(`${this.url}/user-logged`)
      .pipe(
        tap(user => this.dataService.setUser(user))
      )
  }

  updateUserData(user: User): Observable<any> {
    return this.http.put<User>(`${this.url}/${user._id}`, user)
      .pipe(
        tap(user => this.dataService.setUser(user)),
        switchMap(user => this.getUsersByFamilyCode(user.familyCode))
      );
  }

  deleteUser(): Observable<any> {
    return this.http.delete(`${this.url}/${this.dataService.getUser()._id}`)
      .pipe(
        tap(() => {
          this.socketService.socket.disconnect();
          this.storage.clear();
          this.router.navigate(['']);
        })
      );;
  }

  getUsersByFamilyCode(familyCode: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/search/${familyCode}`)
      .pipe(
        tap(users => this.dataService.setMembers(users))
      )
  }

}
