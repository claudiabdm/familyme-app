import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup.component';
import { SignupSuccessComponent } from './signup-success/signup-success.component';

const signupRoute: Routes = [
  { path: '', component: SignupComponent },
  { path: 'signup-success', component: SignupSuccessComponent }
];

@NgModule({
  imports: [RouterModule.forChild(signupRoute)],
  exports: [RouterModule]
})

export class SignupRoutingModule { }
