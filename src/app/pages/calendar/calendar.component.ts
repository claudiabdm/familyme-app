import { Component, OnInit, ViewChild, Input } from '@angular/core';

import { Calendar, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listGridPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';


import { ModalComponent } from 'src/app/shared/component/modal/modal.component';
import { ModalService } from 'src/app/services/modal.service';
import { CalendarEvent } from 'src/app/models/event';
import { DataService } from 'src/app/services/data.service';
import { Evented } from 'mapbox-gl';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('newEventModal') newEventModal: ModalComponent;

  calendarPlugins = [dayGridPlugin, listGridPlugin, interactionPlugin];
  header = {
    left: 'dayGridMonth,listWeek,today',
    right: 'prev,next',
    center: 'title',
  }
  eventTimeFormat = {
    hour: 'numeric',
    minute: '2-digit',
    meridiem: false
  }
  calendarEvents: CalendarEvent[];
  selectedEvent: CalendarEvent;
  selectedDay = {
    title: '',
    location: '',
    start: new Date(),
    end: new Date(),
    allDay: true,
    invitees: [],
    notes: ''
  }

  constructor(
    private dataService: DataService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.calendarEvents = this.dataService.userGroup.events;
    const newEventBtn = document.getElementById('newEventBtn');
    newEventBtn.addEventListener('click', () => this.toggleModal(this.newEventModal))
  }

  toggleModal(targetModal: ModalComponent): void {
    if (!targetModal.modalVisible) {
      this.modalService.openModal(targetModal);
    } else {
      this.modalService.closeModal(targetModal);
    }
  }

  selectEvent(event, modal: ModalComponent): void {
    this.selectedEvent = {
      id: event.event.id,
      modifyAt: event.event.extendedProps.modifyAt,
      title: event.event.title,
      start: event.event.start,
      end: event.event.allDay ? event.event.start : event.event.end ,
      allDay: event.event.allDay,
      location: event.event.extendedProps.location,
      invitees: event.event.extendedProps.invitees,
      notes: event.event.extendedProps.notes,
    }
    this.toggleModal(modal);
  }

  selectDay(event, modal): void {
    this.selectedDay.start = event.date;
    this.selectedDay.end = event.date;
    this.toggleModal(modal);
  }
}
