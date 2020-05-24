import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { User } from 'src/app/shared/models/user';
import { MapService } from 'src/app/services/map.service';
import { Router } from '@angular/router';

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
  public img = '/assets/img/profile-photo-round.svg';

  constructor(
    private dataService: DataService,
    private mapService: MapService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.allUsers = this.dataService.getMembers();
  }

  onChecked(user, checked) {
    user.isSelected = checked;
    this.userListChange.emit(this.allUsers);
  }

  onClick(userId: string) {
    if (this.router.url === '/pages/locator') {
      const selectedUser = this.mapService.markers.find(marker => marker.id === userId);
      this.mapService.map.flyTo({
        center: selectedUser.marker.getLngLat(),
      })
    }
  }

}

