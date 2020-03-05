import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { LandingRoutingModule } from './landing-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';



@NgModule({
  declarations: [LoginComponent, SignupComponent],
  imports: [
    CommonModule,
    SharedModule,
    LandingRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LandingModule { }
