import { Injectable } from '@angular/core';
import { Group } from '../shared/models/group';
import { User } from '../shared/models/user';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { UsersService } from './users.service';
import { GroupsService } from './groups.service';
import { mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private _userDataSource: BehaviorSubject<User> = new BehaviorSubject(null);
  private _membersDataSource: BehaviorSubject<User[]> = new BehaviorSubject(null);
  private _groupDataSource: BehaviorSubject<Group> = new BehaviorSubject(null);
  userData$: Observable<User> = this._userDataSource.asObservable();
  membersData$: Observable<User[]> = this._membersDataSource.asObservable();
  groupData$: Observable<Group> = this._groupDataSource.asObservable();

  constructor() { }


  getUser(): User {
    return this._userDataSource.getValue();
  }

  setUser(user: User) {
    this._userDataSource.next(user);
  }

  getMembers(): User[] {
    return this._membersDataSource.getValue();
  }

  setMembers(members: User[]) {
    this._membersDataSource.next(members);
  }


  getGroup(): Group {
    return this._groupDataSource.getValue();
  }

  setGroup(group: Group) {
    this._groupDataSource.next(group);
  }

}
