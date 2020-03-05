import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
{ path: 'landing',
  loadChildren: () => import('./landing/landing.module')
    .then(m => m.LandingModule) },
{ path: '',   redirectTo: '/landing/login', pathMatch: 'full' },
// { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
