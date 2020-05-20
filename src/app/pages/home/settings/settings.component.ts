import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { DataService } from 'src/app/services/data.service';
import { UsersService } from 'src/app/services/users.service';
import { first } from 'rxjs/internal/operators/first';
import { NgxSpinnerService } from 'ngx-spinner';
import { MethodCall } from '@angular/compiler';
import { GroupsService } from 'src/app/services/groups.service';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  user: Observable<User>;
  targetModalInfo: { title: string; id: string; label: string; function: () => void };

  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private modalService: ModalService,
    private usersService: UsersService,
    private groupsService: GroupsService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.user = this.dataService.userData$;
  }

  logOut() {
    this.spinner.show();
    this.authService.logOut();
    this.spinner.hide();
  }

  deleteAccount = () => {
    this.spinner.show();
    this.usersService.deleteUser().pipe(first()).subscribe(res => {
      this.authService.logOut();
      this.spinner.hide();
    });
  }

  deleteGroup = () => {
    this.spinner.show();
    this.groupsService.deleteGroup().pipe(first()).subscribe(res => {
      this.authService.logOut();
      this.spinner.hide();
    });
  }

  locationOn() {
  }

  notificationsOn() {
  }

  onModify(): void {

  }


  toggleModal(targetModal: ModalComponent): void {
    if (!targetModal.modalVisible) {
      this.modalService.openModal(targetModal);
    } else {
      this.modalService.closeModal(targetModal);
    }
  }

  selectedModalInfo(targetModal: ModalComponent, targetModalName: string): void {
    switch (targetModalName) {
      case 'passwordModal':
        this.targetModalInfo = {
          title: 'Change password',
          id: 'passwordModal',
          label: 'Password',
          function: this.onModify,
        };
        break;
      case 'emailModal':
        this.targetModalInfo = {
          title: 'Change email',
          id: 'emailModal',
          label: 'Email',
          function: this.onModify,
        };
        break;
      case 'nameModal':
        this.targetModalInfo = {
          title: 'Edit name',
          id: 'namelModal',
          label: 'Name',
          function: this.onModify,
        };
        break;
      case 'deleteAccountModal':
        this.targetModalInfo = {
          title: 'Delete Account',
          id: 'deleteModal',
          label: 'your account',
          function: this.deleteAccount,
        };
        break;
      case 'deleteGroupModal':
        this.targetModalInfo = {
          title: 'Delete Group',
          id: 'deleteModal',
          label: 'the family group and related accounts',
          function: this.deleteGroup,
        };
        break;
    }
    this.toggleModal(targetModal);
  }

}