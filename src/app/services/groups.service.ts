import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Group } from '../shared/models/group';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../shared/models/user';
import { map } from 'rxjs/operators';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  groupDataSource = new BehaviorSubject(null);
  groupData$ = this.groupDataSource.asObservable();
  private url = `${environment.apiUrl}groups`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient, private dataService: DataService) { }

  createGroup(name: string): Observable<Group> {
    const newGroup = {
      name: name,
    }
    return this.http.post<Group>(this.url, newGroup);
  }

  updateGroup(group: Group): Observable<Group> {
    return this.http.put<Group>(`${this.url}/${group._id}`, group).pipe(map(group => {
      this.dataService.updateUserGroup(group);
      return group;
    }));
  }

  getGroupByFamilyCode(familyCode: string): Observable<Group> {
    return this.http.get<Group>(`${this.url}/search/${familyCode}`, this.httpOptions)
      .pipe(
        map(group => {
          this.groupDataSource.next(group);
          return group; })
      );
  }

  addUserToGroup(user: User, group: Group): Observable<Group> {
    user.familyCode = group.familyCode;
    return this.http.put<Group>(`${this.url}/${group._id}`, group, this.httpOptions);
  }

  deleteGroup(): Observable<any> {
    return this.http.delete(`${this.url}/${this.dataService.userGroup._id}/${this.dataService.user._id}`);
  }
}
