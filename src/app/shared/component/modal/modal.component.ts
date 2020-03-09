import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() public modalVisible: boolean;

  @Input() public title: string;

  @Input() public modalId: string;

  @Output() public close = new EventEmitter();

  constructor(private modal: ElementRef) { }

  ngOnInit(): void {

  }

  ngOnChanges(): void {
    if (this.modalVisible) {
      this.modal.nativeElement.children[0].classList.add('modal--show');
    } else {
      this.modal.nativeElement.children[0].classList.remove('modal--show');
    }
  }

  onClose() {
    this.close.emit(this.modal);
  }

}
