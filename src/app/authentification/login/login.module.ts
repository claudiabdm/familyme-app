import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { PswdresetFormComponent } from './pswdreset-form/pswdreset-form.component';
import { LoginRoutingModule } from './login-routing.module';


@NgModule({
  declarations: [LoginComponent, LoginFormComponent, PswdresetFormComponent],
  imports: [
    SharedModule,
    LoginRoutingModule
  ],
  exports: [
    LoginComponent,
    LoginFormComponent,
    PswdresetFormComponent,
  ]
})
export class LoginModule { }
