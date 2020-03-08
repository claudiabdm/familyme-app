import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private url = 'https://5e63c7d2782c970014a89dce.mockapi.io/users';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.url);
  }

  /** GET hero by id. Will 404 if id not found */
  getUser(id: number): Observable<User> {
    const url = `${this.url}/${id}`;
    return this.http.get<User>(url);
  }

  searchUser(user: User){
    const url = `${this.url}/?search=${user.email}`;
    return this.http.get<User>(url).pipe(
      map(users => users[0]),
    );
  }

}
