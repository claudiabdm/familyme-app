import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Group } from '../shared/models/group';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../shared/models/user';
import { map, tap } from 'rxjs/operators';
import { DataService } from './data.service';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Router } from '@angular/router';
import { SocketioService } from './socketio.service';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private url = `${environment.apiUrl}groups`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private router: Router,
    private http: HttpClient,
    private dataService: DataService,
    private socketService: SocketioService) { }

  createGroup(name: string): Observable<Group> {
    const newGroup = {
      name: name,
    }
    return this.http.post<Group>(this.url, newGroup);
  }

  updateGroupData(group: Group): Observable<Group> {
    return this.http.put<Group>(`${this.url}/${group._id}`, group);
  }

  getGroupByFamilyCode(familyCode: string): Observable<Group> {
    return this.http.get<Group>(`${this.url}/search/${familyCode}`, this.httpOptions)
      .pipe(
        tap(group => this.dataService.setGroup(group))
      );
  }

  deleteGroup(): Observable<any> {
    return this.http.delete(`${this.url}/${this.dataService.getGroup()._id}/${this.dataService.getUser()._id}`)
      .pipe(
        tap(() => {
          this.socketService.socket.disconnect();
          this.storage.clear();
          this.router.navigate(['']);
        })
      );
  }
}
