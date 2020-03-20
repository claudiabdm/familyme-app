import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { Button } from '../models/button';
import { filter, takeUntil } from 'rxjs/operators';

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
  private ngUnsubscribe$ = new Subject<void>();


  constructor(public router: Router) {
  }

  ngOnInit(): void {
    this.currentRoute = this.router.url;
    this.toggleHeaderNavbar(this.currentRoute);
    this.changeButton(this.currentRoute);

    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd), takeUntil(this.ngUnsubscribe$))
    .subscribe(res => {
      this.currentRoute = res.url;
      this.changeButton(this.currentRoute);
      this.toggleHeaderNavbar(this.currentRoute);
      })
  }

  toggleHeaderNavbar(currentRoute) {
    if (['/pages/login', '/pages/signup'].includes(currentRoute)) {
      this.headerVisible = false;
      this.navbarVisible = false;
    } else if (currentRoute === '/pages/home') {
      this.headerVisible = false;
      this.navbarVisible = true;
    } else {
      this.headerVisible = true;
      this.navbarVisible = true;
    }
  }

  changeButton(currentRoute): void {

    switch (currentRoute) {
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

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next()
    this.ngUnsubscribe$.complete();
  }

}
