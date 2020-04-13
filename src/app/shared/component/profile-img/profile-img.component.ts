import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { User } from 'src/app/models/user';
import { ModalService } from 'src/app/services/modal.service';
import { DataService } from 'src/app/services/data.service';
import { ImageProcessorService } from 'src/app/services/image-processor.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-img',
  templateUrl: './profile-img.component.html',
  styleUrls: ['./profile-img.component.scss']
})
export class ProfileImgComponent implements OnInit, OnDestroy {


  @Input() imageUrl: string | ArrayBuffer;
  @Input() user: User;
  @Output() save = new EventEmitter();
  @Output() delete = new EventEmitter();

  public isDisabled: boolean = true;
  public img = '../../../../assets/img/profile-photo-round.svg';

  private changePhoto: Subscription;

  constructor(
    private dataService: DataService,
    private modalService: ModalService,
    private imageProcessor: ImageProcessorService, ) { }

  ngOnInit(): void {

  }

  toggleModal(targetModal): void {
    if (!targetModal.modalVisible) {
      this.modalService.openModal(targetModal);
    } else {
      this.modalService.closeModal(targetModal);
    }
  }

  onChangePhoto(file: File): void {
   this.changePhoto = this.imageProcessor.compressImg(file).subscribe(res => {
      this.imageUrl = res;
      this.isDisabled = false;
    });
  }

  onSave(file: string | ArrayBuffer) {
    this.user.avatar = file;
    this.save.emit(this.user.avatar);
  }

  onDelete() {
    this.user.avatar = this.img;
    this.delete.emit(this.user.avatar);
  }

  ngOnDestroy() {
    if (this.changePhoto) {
      this.changePhoto.unsubscribe();
    }
  }

}


