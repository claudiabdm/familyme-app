import { Component, OnInit } from '@angular/core';
import { ModalComponent } from 'src/app/shared/component/modal/modal.component';
import { ModalService } from 'src/app/services/modal.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {



  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
  }

  toggleModal(targetModal: ModalComponent): void {
    if (!targetModal.modalVisible) {
      this.modalService.openModal(targetModal);
    } else {
      this.modalService.closeModal(targetModal);
    }
  }

}
