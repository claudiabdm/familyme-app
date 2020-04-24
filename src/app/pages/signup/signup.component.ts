import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ModalService } from 'src/app/services/modal.service';
import { ModalComponent } from 'src/app/shared/component/modal/modal.component';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  targetModalInfo: { title: string; id: string; label: string; placeholder: string; };

  constructor(
    private router: Router,
    private modalService: ModalService) { }

  ngOnInit(): void {
  }


  goBack(): void {
    this.router.navigate(['pages/login'])
  }


  toggleModal(targetModal: ModalComponent): void {
    if (!targetModal.modalVisible) {
      this.modalService.openModal(targetModal);
    } else {
      this.modalService.closeModal(targetModal);
    }
  }

  selectedModalInfo(targetModal: ModalComponent, targetModalName:string): void {
    if (targetModalName === 'createModal') {
      this.targetModalInfo = {
        title: 'Sign up - Create',
        id: 'createModal',
        label: 'Name',
        placeholder: 'Smith Sánchez',
      }
    } else {
      this.targetModalInfo = {
        title: 'Sign up - Join',
        id: 'joinModal',
        label: 'Code',
        placeholder: 'xxx123',
      }
    }
    this.toggleModal(targetModal);
  }


}
