import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  @Input() userList: User[];
  @Input() onlyImage: boolean;
  @Input() isCheckList: boolean = false;
  @Output() userListChange = new EventEmitter<User[]>();

  allUsers: User[];
  public img = '../../../assets/img/profile-photo-round.svg';

  constructor(
    private dataService: DataService,
  ) { }

  ngOnInit(): void {
    this.allUsers = this.dataService.getMembers();
  }

  onChecked(user, checked) {
    user.isSelected = checked;
    this.userListChange.emit(this.allUsers);
  }
}
