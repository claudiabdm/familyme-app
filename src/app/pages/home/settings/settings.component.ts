import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { take } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { UsersService } from 'src/app/services/users.service';
import { GroupsService } from 'src/app/services/groups.service';
import { ModalComponent } from '../../../shared/component/modal/modal.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  @Input() user: User;
  @Output() modify = new EventEmitter();

  locationOn: User['locationOn'];
  notificationsOn: User['notificationsOn'];
  targetModalInfo: { title: string; id: string; label: string; function?: () => void };
  changeNameForm: FormGroup;


  constructor(
    private authService: AuthService,
    private modalService: ModalService,
    private usersService: UsersService,
    private groupsService: GroupsService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.locationOn = this.user?.locationOn;
    this.notificationsOn = this.user?.notificationsOn;
    this.changeNameForm = this.formBuilder.group({
      inputName: ['', [Validators.required, Validators.minLength(2)]],
    });
    this.changeNameForm.reset();
  }

  logOut() {
    this.spinner.show();
    this.authService.logOut().subscribe(() => this.spinner.hide());
  }

  deleteAccount = () => {
    this.spinner.show();
    this.usersService.deleteUser().pipe(take(1)).subscribe(() => this.spinner.hide());
  }

  deleteGroup = () => {
    this.spinner.show();
    this.groupsService.deleteGroup().pipe(take(1)).subscribe(() => this.spinner.hide());
  }

  onLocationSwitch() {
    this.user.locationOn = !this.user.locationOn;
    if (this.user.locationOn === false) {
      this.user.location = {lat:'', lng:''};
    }
    this.usersService.updateUserData(this.user).pipe(take(1)).subscribe();
  }

  onNotificationsSwitch() {
    this.user.notificationsOn = !this.user.notificationsOn;
    this.usersService.updateUserData(this.user).pipe(take(1)).subscribe();
  }

  onModify(form: FormGroup): void {
    const newValue = form.value.inputName;
    this.user.name = newValue;
    this.usersService.updateUserData(this.user).pipe(take(1)).subscribe(
      () => this.modify.emit()
    );
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
          title: 'Change name',
          id: 'nameModal',
          label: 'Name',
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
