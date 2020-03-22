import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  @Input() user: User;

  targetModalInfo = {
    title: 'Sign in',
    id: 'string',
    label: 'string',
  };

  constructor(
    public authService: AuthService,
    private modalService: ModalService
    ) { }

  ngOnInit(): void {
  }

  logOut() {
    this.authService.logOut();
  }

  deleteAccount() {

  }

  locationOn() {

  }

  notificationsOn() {

  }


  toggleModal(targetModal):void {
    if (!targetModal.modalVisible) {
      this.modalService.openModal(targetModal);
    } else {
      this.modalService.closeModal(targetModal);
    }
  }

  selectedModalInfo(targetModal, targetModalName): void {
    switch (targetModalName) {

      case 'passwordModal':
        this.targetModalInfo = {
          title: 'Change password',
          id: 'passwordModal',
          label: 'Password',
        };
        break;

      case 'emailModal':
        this.targetModalInfo = {
          title: 'Change email',
          id: 'emailModal',
          label: 'Email',
        };
        break;

      case 'nameModal':
        this.targetModalInfo = {
          title: 'Edit name',
          id: 'namelModal',
          label: 'Name',
        };
        break;
    }
    this.toggleModal(targetModal);
  }


}
