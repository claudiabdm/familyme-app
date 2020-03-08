import { Component } from '@angular/core';
import { UsersService } from './services/users.service';
import { User } from './models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'personal-project-routing';

  users: User[];

  user: User;
  constructor(private usersService: UsersService) {

  }
}

