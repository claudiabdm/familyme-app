import { Component, OnInit, ElementRef } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { ModalService } from 'src/app/services/modal.service';
import { ModalComponent } from 'src/app/shared/component/modal/modal.component';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private dataService: DataService,
    private modalService: ModalService,
    private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.getUsersByGroupToken(this.dataService.user.groupToken).subscribe();
  }

  get user() {
    return this.dataService.user;
  }

  get userGroup() {
    return this.dataService.userGroup;
  }

  uploadPhoto(event, targetModal: ModalComponent): void {
    this.dataService.user.avatar = event;
    this.usersService.updateUser(this.dataService.user).subscribe();
    this.modalService.closeModal(targetModal);
  }

  toggleModal(targetModal: ModalComponent): void {
    if (!targetModal.modalVisible) {
      this.modalService.openModal(targetModal);
    } else {
      this.modalService.closeModal(targetModal);
    }
  }
}
