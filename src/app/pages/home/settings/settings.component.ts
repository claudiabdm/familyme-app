import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, pipe } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { User } from 'src/app/shared/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { ModalService } from 'src/app/services/modal.service';
import { DataService } from 'src/app/services/data.service';
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

  @Output() modify = new EventEmitter();

  user: Observable<User>;
  locationOn: Observable<User['locationOn']>;
  notificationsOn: Observable<User['notificationsOn']>;
  targetModalInfo: { title: string; id: string; label: string; function?: () => void };
  changeNameForm: FormGroup;


  constructor(
    private authService: AuthService,
    private dataService: DataService,
    private modalService: ModalService,
    private usersService: UsersService,
    private groupsService: GroupsService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.user = this.dataService.userData$;
    this.locationOn = this.dataService.userData$.pipe(map(user => user?.locationOn));
    this.notificationsOn = this.dataService.userData$.pipe(map(user => user?.notificationsOn));
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
    const currUser = this.dataService.getUser();
    currUser.locationOn = !currUser.locationOn;
    if (currUser.locationOn === false) {
      currUser.location = {lat:'', lng:''};
    }
    this.usersService.updateUserData(currUser).pipe(take(1)).subscribe();
  }

  onNotificationsSwitch() {
    const currUser = this.dataService.getUser();
    currUser.notificationsOn = !currUser.notificationsOn;
    this.usersService.updateUserData(currUser).pipe(take(1)).subscribe();
  }

  onModify(form: FormGroup): void {
    const newValue = form.value.inputName;
    const currUser = this.dataService.getUser();
    currUser.name = newValue;
    this.usersService.updateUserData(currUser).pipe(take(1)).subscribe(
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
