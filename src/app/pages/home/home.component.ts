import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from 'src/app/models/user';
import { Group } from 'src/app/models/group';
import { UsersService } from 'src/app/services/users.service';
import { ModalService } from 'src/app/services/modal.service';
import { DataService } from 'src/app/services/data.service';
import { ModalComponent } from 'src/app/shared/component/modal/modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  img = '../../../assets/img/profile-photo-round.svg';

  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private modalService: ModalService,
    private usersService: UsersService) { }

  ngOnInit(): void {
    this.usersService.getUsersByGroupToken(this.dataService.user.familyCode).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }

  get user(): User {
    return this.dataService.user;
  }

  get userGroup(): Group {
    return this.dataService.userGroup;
  }

  get userList(): User[] {
    return this.dataService.userList;
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
