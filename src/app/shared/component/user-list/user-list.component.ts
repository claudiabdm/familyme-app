import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { User } from 'src/app/shared/models/user';
import { MapService } from 'src/app/services/map.service';
import { Router } from '@angular/router';
import { Group } from '../../models/group';
import { GroupsService } from 'src/app/services/groups.service';

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
    private groupsService: GroupsService,
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
    switch (this.router.url) {
      case '/pages/locator':
        const selectedUser = this.mapService.markers.find(marker => marker.id === userId);
        if (selectedUser) {
          this.mapService.map.flyTo({
            center: selectedUser.marker.getLngLat(),
          });
        }
        break;
      case '/pages/calendar':
        this.groupsService.getGroupByFamilyCode(this.dataService.familyCode).subscribe((group: Group) => {
          const selectedUserEvents = group.events.filter(event => event.invitees.includes(userId));
          group.events = selectedUserEvents;
          this.dataService.setGroup(group);
        })
        break;
      case '/pages/list':
        this.groupsService.getGroupByFamilyCode(this.dataService.familyCode).subscribe((group: Group) => {
          const selectedUserProducts = group.shoppingList.filter(product => product.addedById === userId);
          group.shoppingList = selectedUserProducts;
          this.dataService.setGroup(group);
        })
        break;
    }
  }

}

