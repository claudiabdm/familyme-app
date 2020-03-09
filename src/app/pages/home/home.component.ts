import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private _user: User = this.authService.user;
  private _usersGroup: User[] = this.authService.usersGroup;

  constructor(private authService: AuthService, private usersService: UsersService) {

  }

  ngOnInit(): void {
  }

  get user() {
    return this._user;
  }

  get usersGroup() {
    return this._usersGroup;
  }

}
