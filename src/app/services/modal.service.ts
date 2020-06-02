import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  public btnClicked = new EventEmitter();

  constructor() { }

  openModal(targetModal){
    clearTimeout();
    targetModal.modal.nativeElement.firstElementChild.classList.add('modal--show');
    targetModal.modalVisible = true;
  };

  closeModal(targetModal){
    clearTimeout();
    targetModal.modal.nativeElement.firstElementChild.classList.remove('modal--show');
    setTimeout(()=> targetModal.modalVisible = false, 350)
  }


}
