import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignupComponent } from './signup.component';

const signupRoute: Routes = [
  { path: '', component: SignupComponent }
];

@NgModule({
  imports: [RouterModule.forChild(signupRoute)],
  exports: [RouterModule]
})

export class SignupRoutingModule { }
