import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @Input() onlyImage: boolean;

  public userList: User[];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.userList = this.authService.userGroup.members;
  }

}
