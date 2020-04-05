import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';


import { ModalComponent } from './component/modal/modal.component';
import { NavbarComponent } from './component/navbar/navbar.component';
import { SignupFormComponent } from './component/forms/signup-form/signup-form.component';
import { LoginFormComponent } from './component/forms/login-form/login-form.component';
import { SettingsComponent } from './component/settings/settings.component';
import { HeaderComponent } from './component/header/header.component';
import { UserListComponent } from './component/user-list/user-list.component';
import { ProfileImgComponent } from './component/profile-img/profile-img.component';
import { MapComponent } from './component/map/map.component';
import { LogoComponent } from './component/logo/logo.component';
import { EventFormComponent } from './component/forms/event-form/event-form.component';


@NgModule({
  declarations: [ModalComponent, NavbarComponent, SignupFormComponent, LoginFormComponent, SettingsComponent, HeaderComponent, UserListComponent, ProfileImgComponent, MapComponent, LogoComponent, EventFormComponent,],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  exports: [
    ModalComponent,
    NavbarComponent,
    SignupFormComponent,
    LoginFormComponent,
    SettingsComponent,
    HeaderComponent,
    UserListComponent,
    ProfileImgComponent,
    MapComponent,
    LogoComponent,
    EventFormComponent,
  ]
})
export class SharedModule { }
