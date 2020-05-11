import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { DataService } from 'src/app/services/data.service';
import { UsersService } from 'src/app/services/users.service';
import { first } from 'rxjs/internal/operators/first';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  targetModalInfo: { title: string; id: string; label: string; };

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private modalService: ModalService,
    private usersService: UsersService,
    private spinner: NgxSpinnerService,
  ) { }

  get roleAdmin(): boolean {
    return this.dataService.user.role === 'admin';
  }

  ngOnInit(): void {
  }

  logOut() {
    this.spinner.show();
    this.authService.logOut();
    this.dataService.user.lastConnection = new Date();
    this.usersService.updateUser(this.dataService.user).pipe(first()).subscribe(res => this.spinner.hide());
  }

  deleteAccount() {
    this.spinner.show();
    this.usersService.deleteUser().pipe(first()).subscribe(res =>{
      this.authService.logOut();
      this.spinner.hide();
    });
  }

  locationOn() {
  }

  notificationsOn() {
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
      case 'deleteAccountModal':
        this.targetModalInfo = {
          title: 'Delete Account',
          id: 'deleteAccountModal',
          label: 'Password',
        };
        break;
    }
    this.toggleModal(targetModal);
  }

}
