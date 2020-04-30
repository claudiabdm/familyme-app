import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { SignupRoutingModule } from './signup-routing.module';
import { SignupComponent } from './signup.component';
import { SignupFormComponent } from './signup-form/signup-form.component';


@NgModule({
  declarations: [SignupComponent, SignupFormComponent],
  imports: [
    SharedModule,
    SignupRoutingModule,
  ],
  exports: [
    SignupComponent,
    SignupFormComponent,
  ]
})
export class SignupModule { }
