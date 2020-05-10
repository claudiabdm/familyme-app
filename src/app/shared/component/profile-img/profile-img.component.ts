import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

import { User } from 'src/app/shared/models/user';
import { ModalService } from 'src/app/services/modal.service';
import { DataService } from 'src/app/services/data.service';
import { ImageProcessorService } from 'src/app/shared/component/profile-img/image-processor.service';
import { UsersService } from 'src/app/services/users.service';
import { takeUntil } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-profile-img',
  templateUrl: './profile-img.component.html',
  styleUrls: ['./profile-img.component.scss']
})
export class ProfileImgComponent implements OnInit, OnDestroy {


  @Input() imageUrl: string | ArrayBuffer;
  @Output() update = new EventEmitter();

  public isDisabled: boolean = true;
  public defaultImg = '../../../../assets/img/profile-photo-round.svg';

  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private usersService: UsersService,
    private modalService: ModalService,
    private imageProcessor: ImageProcessorService,
    private spinner: NgxSpinnerService, ) { }

  ngOnInit(): void {

  }

  get user(): User {
    return this.dataService.user;
  }

  toggleModal(targetModal): void {
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
    this.dataService.user.avatar = file;
    this.usersService.updateUser(this.dataService.user).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
    this.update.emit();
  }

  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

}


