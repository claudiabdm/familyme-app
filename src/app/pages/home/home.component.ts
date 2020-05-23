import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { User } from 'src/app/shared/models/user';
import { Group } from 'src/app/shared/models/group';
import { ModalService } from 'src/app/services/modal.service';
import { DataService } from 'src/app/services/data.service';
import { ModalComponent } from 'src/app/shared/component/modal/modal.component';
import { UsersService } from 'src/app/services/users.service';
import { GroupsService } from 'src/app/services/groups.service';
import { tap } from 'rxjs/internal/operators/tap';
import { takeUntil, switchMap } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  img = '../../../assets/img/profile-photo-round.svg';
  user: Observable<any>;
  userGroup: Observable<Group>;
  userList: Observable<User[]>;

  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private modalService: ModalService,
    private dataService: DataService,
    private usersService: UsersService,
    private groupsService: GroupsService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.usersService.getLoggedUser().pipe(
      switchMap((user: User) => {
        return this.groupsService.getGroupByFamilyCode(user.familyCode);
      }),
      switchMap((group: Group) => {
        return this.usersService.getUsersByFamilyCode(group.familyCode);
      }),
      tap(() => this.setData()),
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(() => this.spinner.hide());
  }

  setData() {
    this.user = this.dataService.userData$;
    this.userGroup = this.dataService.groupData$;
    this.userList = this.dataService.membersData$;
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
