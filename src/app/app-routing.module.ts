import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './authentification/auth.guard';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./authentification/login/login.module').then(m => m.LoginModule) },
  { path: 'signup', loadChildren: () => import('./authentification/signup/signup.module').then(m => m.SignupModule) },
  {
    path: 'pages',
    loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule),
    canActivate: [AuthGuard]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
