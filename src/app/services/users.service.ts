import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { Group } from '../models/group';
import { DataService } from './data.service';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private url = `${environment.apiUrl}users`;

  constructor(private http: HttpClient, private dataService: DataService) { }

  createUser(user: User, group: Group, role: string): Observable<User> {
    const newUser = Object.assign(user, { role: role, familyCode: group.familyCode, groupId: group._id });
    return this.http.post<User>(this.url, newUser);
  }

  updateUser(user: User): Observable<User> {
    return this.http.put<User>(`${this.url}/${user._id}`, user).pipe(map(user => {
      this.dataService.updateUserData(user);
      return user;
    }))
  }

  getUsersByGroupToken(familyCode: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/search/${familyCode}`).pipe(map(users => {
      this.dataService.updateUserList(users);
      return users;
    }))
  }

  searchUserByEmail(user: User): Observable<User> {
    const url = `${this.url}/search/${user.email}`;
    return this.http.get<User>(url).pipe(
      map(users => users[0]),
    );
  }

}
