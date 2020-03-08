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

  ngOnInit() {
    this.getUsers();
    this.getUser(33);
  }

  getUsers(): void {
    this.usersService.getUsers()
        .subscribe(users => {
          this.users = users;
          console.log(users);
        });

  };

  getUser(id): void {
    this.usersService.getUser(id)
        .subscribe(user => {
          this.user = user;
          console.log(user);
        });

  }

}

