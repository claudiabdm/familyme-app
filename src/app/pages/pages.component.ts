import { Component, OnInit, OnChanges, DoCheck, SimpleChange, Input } from '@angular/core';
import { ActivatedRoute, RouterLinkActive, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs';
import { Button } from '../models/button';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, DoCheck {

  public navbarHidden: boolean;
  public headerHidden: boolean;

  constructor(public router: Router, private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.setLocalStorage();
  }

  ngDoCheck(): void {
    this.navbarHidden = this.router.url.includes('login') || this.router.url.includes('signup');
    this.headerHidden = this.router.url.includes('home') || this.navbarHidden;
    // this.changeButton();
  }

  // changeButton(): void {
  //   if (this.router.url.includes('calendar')) {
  //     this.button = {
  //       id: "newEventButton",
  //       name: "New event"
  //     }
  //     this.switchVisible = false;
  //   } else if (this.router.url.includes('locator')) {
  //     this.button = {
  //       id: "newPlaceButton",
  //       name: "New place"
  //     }
  //     this.switchVisible = false;
  //   } else if (this.router.url.includes('list')) {
  //     this.switchVisible = true;
  //   }
  // }

}
