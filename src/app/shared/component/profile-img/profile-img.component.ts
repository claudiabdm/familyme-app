import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from 'src/app/models/user';
import { ModalService } from 'src/app/services/modal.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-profile-img',
  templateUrl: './profile-img.component.html',
  styleUrls: ['./profile-img.component.scss']
})
export class ProfileImgComponent implements OnInit {


  @Input() imageUrl: string | ArrayBuffer;
  @Input() user: User;
  @Output() save = new EventEmitter();
  @Output() delete = new EventEmitter();

  public isDisabled: boolean = true;

  fileName: string = "No file selected";
  file: File;

  constructor(private dataService: DataService, private modalService: ModalService) { }

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
    this.fileName = file.name;
    this.file = file;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = event => {
      this.imageUrl = reader.result;
      this.isDisabled = false;
    };
  }

  onSave(file: string | ArrayBuffer) {
    this.user.avatar = file;
    this.save.emit(this.user.avatar);
  }

  onDelete() {
    this.user.avatar = '../../../../assets/img/profile-photo-round.svg';
    this.delete.emit(this.user.avatar);
  }

}


