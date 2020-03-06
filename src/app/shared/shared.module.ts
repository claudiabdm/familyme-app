import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { ModalComponent } from './component/modal/modal.component';
import { NavbarComponent } from './component/navbar/navbar.component';

@NgModule({
  declarations: [ModalComponent, NavbarComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    ModalComponent,
    NavbarComponent
  ]
})
export class SharedModule { }
