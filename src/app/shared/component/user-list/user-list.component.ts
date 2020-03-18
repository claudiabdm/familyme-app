import { Component, OnInit, Input } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @Input() onlyImage: boolean;

  constructor(private dataService: DataService, private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.getUsersByGroupToken(this.dataService.user.groupToken).subscribe();
  }

  get userList() {
    return this.dataService.userList;
  }


}
