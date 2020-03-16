import { Component, OnInit, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Group } from 'src/app/models/group';
import { ModalService } from 'src/app/services/modal.service';
import { GroupsService } from 'src/app/services/groups.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private modalService: ModalService,
    private groupsService: GroupsService) { }

  ngOnInit(): void {

  }

  get user(): User {
    return this.authService.user;
  }

  set user(user : User) {
    this.authService.user = user;
  }

  get userGroup(): Group {
    return this.authService.userGroup;
  }



  toggleModal(targetModal) {
    if (!targetModal.modalVisible) {
      this.modalService.openModal(targetModal);
    } else {
      this.modalService.closeModal(targetModal);
    }
  }

  uploadPhoto(event, targetModal) {
    debugger
    this.authService.user.avatar = event;
    const idx = this.authService.userGroup.members.findIndex(user => user.id === this.authService.user.id);
    this.authService.userGroup.members.splice(idx, 1, this.authService.user);
    this.groupsService.updateGroup(this.authService.userGroup).pipe(map(group => {
      this.authService.userGroup = group;
      this.authService.updateLocalStorage('userGroup', group);
      this.groupsService.deleteGroup(group.apiId - 1).subscribe(); // dejar aquí de momento
    })).subscribe();

    this.modalService.closeModal(targetModal);
  }

}
