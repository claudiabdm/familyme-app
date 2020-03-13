import { Component, OnInit, OnChanges, DoCheck, SimpleChange, Input } from '@angular/core';
import { ActivatedRoute, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Button } from '../models/button';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {

  public navbarVisible: boolean = false;
  public headerVisible: boolean = false;
  public button: Button;
  public switchVisible: boolean = false;
  private currentRoute: string;

  constructor(public router: Router, private route: ActivatedRoute, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.setLocalStorage();
    this.currentRoute = this.router.url;
    this.toggleHeaderNavbar(this.currentRoute);
    this.changeButton(this.currentRoute);

    this.router.events
    .pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    )
    .subscribe(res =>
      {
        this.currentRoute = res.url;
        this.changeButton(this.currentRoute);
        this.toggleHeaderNavbar(this.currentRoute);
      })
  }

  toggleHeaderNavbar(currentRoute) {
    if (['/pages/login', '/pages/signup'].includes(currentRoute)) {
      this.headerVisible = false;
      this.navbarVisible = false;
    } else if (currentRoute === '/pages/home'){
      this.headerVisible = false;
      this.navbarVisible = true;
    } else {
      this.headerVisible = true;
      this.navbarVisible = true;
    }
  }

  changeButton(currentRoute): void {

    switch(currentRoute) {
      case '/pages/calendar':
        this.button = {
          id: "newEventButton",
          name: "New event"
        }
        this.switchVisible = false;
        break;
      case '/pages/locator':
        this.button = {
          id: "newPlaceButton",
          name: "New place"
        };
        this.switchVisible = false;
        break;
      case '/pages/list':
        this.switchVisible = true;
        break;
    }

  }

}
