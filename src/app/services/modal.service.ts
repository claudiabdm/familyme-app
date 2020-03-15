import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  openModal(targetModal){
    targetModal.modal.nativeElement.firstElementChild.classList.add('modal--show');
    targetModal.modalVisible = true;
  };

  closeModal(targetModal){
    targetModal.modal.nativeElement.firstElementChild.classList.remove('modal--show');
    targetModal.modalVisible = false;
  }


}
