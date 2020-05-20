import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { User } from 'src/app/shared/models/user';
import { ModalService } from 'src/app/services/modal.service';
import { DataService } from 'src/app/services/data.service';
import { UsersService } from 'src/app/services/users.service';
import { ImageProcessorService } from 'src/app/shared/component/profile-img/image-processor.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-profile-img',
  templateUrl: './profile-img.component.html',
  styleUrls: ['./profile-img.component.scss']
})
export class ProfileImgComponent implements OnInit, OnDestroy {

  @Input() imageUrl: string | ArrayBuffer;
  @Output() update = new EventEmitter();

  user: Observable<User>;
  isDisabled: boolean = true;
  defaultImg = '../../../../assets/img/profile-photo-round.svg';

  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private usersService: UsersService,
    private modalService: ModalService,
    private imageProcessor: ImageProcessorService,
    private spinner: NgxSpinnerService, ) { }

  ngOnInit(): void {
    this.user = this.dataService.userData$;
  }

  toggleModal(targetModal: ModalComponent): void {
    if (!targetModal.modalVisible) {
      this.modalService.openModal(targetModal);
    } else {
      this.modalService.closeModal(targetModal);
    }
  }

  onChangePhoto(file: File): void {
    this.spinner.show();
    this.imageProcessor.compressImg(file).pipe(takeUntil(this.ngUnsubscribe$)).subscribe(res => {
      this.imageUrl = res;
      this.isDisabled = false;
      this.spinner.hide();
    });
  }

  onUpdatePhoto(file: string | ArrayBuffer) {
    const userToBeUpdated = this.dataService.getUser();
    userToBeUpdated.avatar = file;
    this.usersService.updateUserData(userToBeUpdated).pipe(take(1)).subscribe();
    this.update.emit();
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

}


