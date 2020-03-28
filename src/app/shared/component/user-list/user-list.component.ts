import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { User } from 'src/app/models/user';

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
  @Output() close = new EventEmitter();

  constructor(
    private dataService: DataService,
  ) { }

  get allUsers() {
    return this.dataService.userList;
  }

  ngOnInit(): void {
  }

  onChecked(user, checked) {
    user.isSelected = checked;
    this.userListChange.emit(this.allUsers);
  }
}
