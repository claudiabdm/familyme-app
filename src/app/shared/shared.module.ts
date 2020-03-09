import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalComponent } from './component/modal/modal.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { SignupFormComponent } from './component/forms/signup-form/signup-form.component';


@NgModule({
  declarations: [ModalComponent, NavbarComponent, SignupFormComponent,],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    ModalComponent,
    NavbarComponent,
    SignupFormComponent,
  ]
})
export class SharedModule { }
