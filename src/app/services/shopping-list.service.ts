import { Injectable, Inject } from '@angular/core';
import { Product } from '../models/product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { User } from '../models/user';
import { GroupsService } from './groups.service';
import { Group } from '../models/group';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private authService: AuthService,
    private groupsService: GroupsService,
  ) { }

  getProductList() {
    return this.authService.userGroup.shoppingList;
  }

  updateProductList(productList: Product[]): void {
    this.authService.userGroup.shoppingList = productList;
    this.groupsService.updateGroup(this.authService.userGroup).subscribe(group => {
      this.authService.userGroup = group;
      this.authService.updateLocalStorage('userGroup', group);
      this.groupsService.deleteGroup(group.apiId - 1).subscribe();
    })
  }
}

