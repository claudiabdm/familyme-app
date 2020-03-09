import { Component, OnInit, OnChanges, DoCheck } from '@angular/core';
import { ActivatedRoute, RouterLinkActive, Router } from '@angular/router';
import { Route } from '@angular/compiler/src/core';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit, DoCheck {

  navbarHidden: boolean;

  constructor(public router: Router) {
  }

  ngOnInit(): void {
  }

  ngDoCheck() {
    this.navbarHidden = this.router.url.includes('login') || this.router.url.includes('signup');
  }

}
