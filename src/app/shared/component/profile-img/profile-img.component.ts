import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/user';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-profile-img',
  templateUrl: './profile-img.component.html',
  styleUrls: ['./profile-img.component.scss']
})
export class ProfileImgComponent implements OnInit {

  @Input() user: User;
  @Input() imageUrl: string | ArrayBuffer;

  @Output() save = new EventEmitter();
  @Output() delete = new EventEmitter();

  isDisabled: boolean = true;
  fileName: string = "No file selected";
  file: File;

  constructor(private modalService: ModalService) { }

  ngOnInit(): void {
  }


  toggleModal(targetModal) {
    if (!targetModal.modalVisible) {
      this.modalService.openModal(targetModal);
    } else {
      this.modalService.closeModal(targetModal);
    }
  }

  onChangePhoto(file) {
    this.fileName = file.name;
    this.file = file;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = event => {
      this.imageUrl = reader.result;
      this.isDisabled = false;
    };
  }

  onSave(file) {
    this.user.avatar = file;
    this.save.emit(this.user.avatar);
  }

  onDelete() {
    this.user.avatar = '../../../../assets/img/profile-photo-round.svg';
    this.delete.emit(this.user.avatar);
  }

}


