import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesModule } from './pages/pages.module';
import { PagesComponent } from './pages/pages.component';
import { HomeComponent } from './pages/home/home.component';
import { CalendarComponent } from './pages/calendar/calendar.component';

const routes: Routes = [
  {
    path: 'pages',
    component: PagesComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'calendar', component: CalendarComponent }
    ]
  },
  {
    path: 'landing',
    loadChildren: () => import('./landing/landing.module')
      .then(m => m.LandingModule)
  },
  { path: '', redirectTo: '/landing/login', pathMatch: 'full' },
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
