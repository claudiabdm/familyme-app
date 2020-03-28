import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SharedModule } from '../shared/shared.module';

import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import { PagesRoutingModule } from './pages-routing.module';
import { ListComponent } from './list/list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LocatorComponent } from './locator/locator.component';



@NgModule({
  declarations: [HomeComponent, CalendarComponent, LoginComponent, SignupComponent, PagesComponent, ListComponent, PageNotFoundComponent, LocatorComponent,],
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule
  ],
  exports: [
    PagesComponent,
    HomeComponent,
    CalendarComponent,
    PagesRoutingModule,
    SignupComponent,
    LoginComponent,
    ListComponent
  ]
})
export class PagesModule { }
