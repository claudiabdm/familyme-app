import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() modalVisible: boolean = false;

  @Input() isFull: boolean = true;

  @Input() title: string;

  @Input() modalId: string;

  @Output() close = new EventEmitter();

  constructor(private modal: ElementRef) { }

  ngOnInit(): void {

  }

  onClose(): void {
    this.close.emit(this.modal);
  }

}
