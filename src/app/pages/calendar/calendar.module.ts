import { NgModule } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from '@danielmoncada/angular-datetime-picker';

import { SharedModule } from '../../shared/shared.module';
import { CalendarComponent } from './calendar.component';
import { CalendarRoutingModule } from './calendar-routing.module';
import { EventFormComponent } from './event-form/event-form.component';


@NgModule({
  declarations: [CalendarComponent, EventFormComponent],
  imports: [
    SharedModule,
    CalendarRoutingModule,
    FullCalendarModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule
  ],
  exports: [
    CalendarComponent,
    EventFormComponent
  ]
})
export class CalendarModule { }
