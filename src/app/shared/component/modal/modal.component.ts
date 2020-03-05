import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() public title: string;

  @Input() public modalId: string;

  @Output() public close = new EventEmitter();

  constructor(private modal: ElementRef) { }

  ngOnInit(): void {
  }

  open(){
    this.modal.nativeElement.classList.add('modal--show');
  }


  onClose(){
    this.modal.nativeElement.classList.add('modal--show');
  }

}
