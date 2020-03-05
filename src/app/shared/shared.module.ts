import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './component/modal/modal.component';
import { NavbarComponent } from './component/navbar/navbar.component';

@NgModule({
  declarations: [ModalComponent, NavbarComponent],
  imports: [
    CommonModule,
  ],
  exports: [
    ModalComponent,
    NavbarComponent
  ]
})
export class SharedModule { }
