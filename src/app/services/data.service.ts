import { Injectable, Inject } from '@angular/core';
import { Group } from '../models/group';
import { User } from '../models/user';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { UsersService } from './users.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public user: User;
  public userGroup: Group;
  public userList: User[];

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
  ) { }

  public setLocalStorage(): void {
    if (!this.storage.get('user')) {
      this.storage.set('user', this.user);
      this.storage.set('userGroup', this.userGroup);
      this.storage.set('userList', this.userList);
    } else {
      this.user = this.storage.get('user');
      this.storage.set('user', this.user);
      this.userGroup = this.storage.get('userGroup');
      this.storage.set('userGroup', this.userGroup);
      this.userList = this.storage.get('userList');
      this.storage.set('userList', this.userList);
    }
  }

  public setData(user: User, group: Group, users: User[]): void {
    this.user = user;
    this.userGroup = group;
    this.userList = users;
    this.setLocalStorage();
  }

  public updateUserData(user: User): void {
    const idx = this.userList.findIndex(data => data.id === user.id);
    if (idx > -1) {
      this.user = user;
      this.userList.splice(idx, 1, user);
      this.updateLocalStorage('user', this.user);
      this.updateUserList(this.userList);
    }
  }

  public updateUserList(users: User[]): void{
    this.userList = users;
    this.updateLocalStorage('userList', this.userList);
  }

  public updateUserGroup(usersGroup: Group): void{
    this.userGroup = usersGroup;
    this.updateLocalStorage('userGroup', this.userGroup);
  }

  private updateLocalStorage(item, value): void {
    this.storage.set(item, value);
  }
}
