import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';

import { HomeComponent } from './home/home.component';
import { CalendarComponent } from './calendar/calendar.component';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';



@NgModule({
  declarations: [HomeComponent, CalendarComponent, PagesComponent],
  imports: [
    CommonModule,
    SharedModule,
    PagesRoutingModule
  ],
})
export class PagesModule { }
