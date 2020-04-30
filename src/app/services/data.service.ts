import { Injectable, Inject } from '@angular/core';
import { Group } from '../shared/models/group';
import { User } from '../shared/models/user';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  user: User;
  userGroup: Group;
  userList: User[];

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
  ) { }

  setLocalStorage(): void {
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

  setData(user: User, group: Group, users: User[]): void {
    this.user = user;
    this.userGroup = group;
    this.userList = users;
    this.setLocalStorage();
  }

  updateUserData(user: User): void {
    const idx = this.userList.findIndex(data => data._id === user._id);
    if (idx > -1) {
      this.user = user;
      this.userList.splice(idx, 1, user);
      this.updateLocalStorage('user', this.user);
      this.updateUserList(this.userList);
    }
  }

  updateUserList(users: User[]): void{
    this.userList = users;
    this.updateLocalStorage('userList', this.userList);
  }

  updateUserGroup(usersGroup: Group): void{
    this.userGroup = usersGroup;
    this.updateLocalStorage('userGroup', this.userGroup);
  }

  private updateLocalStorage(item, value): void {
    this.storage.set(item, value);
  }
}
