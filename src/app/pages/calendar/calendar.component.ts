import { Component, OnInit, ViewChild } from '@angular/core';
import { Calendar, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listGridPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent; //

  calendarPlugins = [dayGridPlugin, listGridPlugin];
  header = {
    left: 'dayGridMonth,listWeek,today',
    right: 'prev,next',
    center: 'title',
  }
  calendarEvents: EventInput[] = [
    { title: 'Event Now', start: new Date() },
    { title: 'Event LAter', start: "2020-03-24", color: '#ff748b' },
    { title: 'Event Now', start: new Date() },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
