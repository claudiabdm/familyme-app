import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from '../models/user';
import { environment } from 'src/environments/environment';
import { Group } from '../models/group';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private url = `${environment.apiUrl}users`;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  getUsersByGroupId(group): Observable<User[]> {
    return this.http.get<User[]>(`${this.url}/${group.id}`);
  }

  // getUserById(id: number): Observable<User> {
  //   const url = `${this.url}/${id}`;
  //   return this.http.get<User>(url);
  // }

  createUser(user: User, group: string, role: string): Observable<User> {
    const newUser = Object.assign(user, { role: role, groupToken: group });
    return this.http.post<User>(this.url, newUser);
  }

  searchUserByEmail(user: User): Observable<User> {
    const url = `${this.url}?search=${user.email}`;
    return this.http.get<User>(url).pipe(
      map(users => users[0]),
    );
  }

}
