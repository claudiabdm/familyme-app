import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { catchError, map, tap, switchMap } from 'rxjs/operators';

import { User } from '../shared/models/user';
import { environment } from 'src/environments/environment';
import { Group } from '../shared/models/group';
import { DataService } from './data.service';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  userDataSource = new BehaviorSubject(null);
  userData$ = this.userDataSource.asObservable();
  membersDataSource = new BehaviorSubject(null);
  membersData$ = this.membersDataSource.asObservable();

  private url = `${environment.apiUrl}users`;

  constructor(private http: HttpClient, private dataService: DataService) { }

  setUserData(): Observable<User> {
    return this.http.get<User>(`${this.url}/user-logged`)
      .pipe(
        map(user => {
          this.userDataSource.next(user);
          return user;
        })
      );
  }

  createUser(user: User, group: Group, role: string): Observable<User> {
    const newUser = Object.assign(user, { role: role, familyCode: group.familyCode, groupId: group._id });
    return this.http.post<User>(this.url, newUser);
  }

  updateUserData(user: User): Observable<any> {
    return this.http.put<User>(`${this.url}/${user._id}`, user)
      .pipe(
        switchMap(user => {

          this.userDataSource.next(user);
          return this.getUsersByFamilyCode(user.familyCode);
        })
      );
  }

  getUsersByFamilyCode(familyCode: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/search/${familyCode}`)
      .pipe(
        map(users => {
          this.membersDataSource.next(users);
          return users;
        })
      )
  }

  deleteUser(): Observable<any> {
    return this.http.delete(`${this.url}/${this.dataService.user._id}`);
  }

}
