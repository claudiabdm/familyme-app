import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { PagesComponent } from './pages.component';


const routes: Routes = [
  {
    path: 'pages',
    component: PagesComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'calendar', component: CalendarComponent }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
