import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModalComponent } from './component/modal/modal.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { SignupFormComponent } from './component/forms/signup-form/signup-form.component';
import { LoginFormComponent } from './component/forms/login-form/login-form.component';
import { SettingsComponent } from './component/settings/settings.component';
import { HeaderComponent } from './component/header/header.component';
import { UserListComponent } from './component/user-list/user-list.component';
import { ScrollBottomDirective } from './directive/scroll-bottom.directive';


@NgModule({
  declarations: [ModalComponent, NavbarComponent, SignupFormComponent, LoginFormComponent, SettingsComponent, HeaderComponent, UserListComponent, ScrollBottomDirective,],
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
    LoginFormComponent,
    SettingsComponent,
    HeaderComponent,
    UserListComponent
  ]
})
export class SharedModule { }
