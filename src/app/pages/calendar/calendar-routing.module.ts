import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarComponent } from './calendar.component';

const calendarRoute: Routes = [
  { path: '', component: CalendarComponent },
];

@NgModule({
  imports: [RouterModule.forChild(calendarRoute)],
  exports: [RouterModule]
})

export class CalendarRoutingModule { }
