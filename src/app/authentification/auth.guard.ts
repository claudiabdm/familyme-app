import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { UsersService } from '../services/users.service';
import { DataService } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { take } from 'rxjs/operators';
import { User } from '../shared/models/user';
import { Group } from '../shared/models/group';
import { GroupsService } from '../services/groups.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    @Inject(LOCAL_STORAGE)
    private storage: StorageService,
    private router: Router,
    private dataService: DataService,
    private usersService: UsersService,
    private groupsService: GroupsService,
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.checkLogin();
  }

  checkLogin(): Observable<boolean> | boolean {
    const storageToken = this.storage.get('user-token');
    if (storageToken) {
      return true;
    }
    this.router.navigate(['']);
    return false;
  }

}
