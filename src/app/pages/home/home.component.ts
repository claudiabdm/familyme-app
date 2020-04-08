import { Component, OnInit, ElementRef } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { ModalService } from 'src/app/services/modal.service';
import { ModalComponent } from 'src/app/shared/component/modal/modal.component';
import { DataService } from 'src/app/services/data.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private ngUnsubscribe$ = new Subject<void>();

  public img = '../../../assets/img/profile-photo-round.svg';

  constructor(
    private dataService: DataService,
    private modalService: ModalService,
    private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.getUsersByGroupToken(this.dataService.user.familyCode).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }

  get user() {
    return this.dataService.user;
  }

  get userGroup() {
    return this.dataService.userGroup;
  }

  get userList() {
    return this.dataService.userList;
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

  copyMyText(textToCopy): void {
    textToCopy.select();
    document.execCommand("copy");
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

}
