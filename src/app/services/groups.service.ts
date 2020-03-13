import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Group } from '../models/group';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private url = `${environment.apiUrl}groups`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http:HttpClient) { }

  createGroup(group: string): Observable<Group> {
    const newGroup = {
      name: group,
      createdAt: new Date(),
    }
    return this.http.post<Group>(this.url, newGroup);
  }

  updateGroup(group: Group): Observable<Group> {
    return this.http.post<Group>(this.url, group);
  }

  deleteGroup(id: Group["id"]): Observable<Group> {
    return this.http.delete<Group>(`${this.url}/${id}`);
  }

  searchGroupByToken(group: string): Observable<Group> {
    return this.http.get<Group>(`${this.url}?search=${group}`, this.httpOptions);
  }

  addUserToGroup(user: User, group: Group): Observable<Group> {
    user.groupToken = group.token;
    group.members.push(user);
    return this.http.put<Group>(`${this.url}/${group.apiId}`, group, this.httpOptions);
  }
}
