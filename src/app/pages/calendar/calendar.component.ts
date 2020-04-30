import { Component, OnInit, ViewChild } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import dayGridPlugin from '@fullcalendar/daygrid';
import listGridPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';

import { CalendarEvent } from 'src/app/shared/models/event';
import { ModalService } from 'src/app/services/modal.service';
import { DataService } from 'src/app/services/data.service';
import { GroupsService } from 'src/app/services/groups.service';
import { ModalComponent } from 'src/app/shared/component/modal/modal.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('newEventModal') newEventModal: ModalComponent;


  private ngUnsubscribe$ = new Subject<void>();

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
    private groupsService: GroupsService,
    private modalService: ModalService
  ) { }

  get calendarEvents() {
    return this.dataService.userGroup.events;
  }

  ngOnInit(): void {
    this.groupsService.searchGroupByToken(this.dataService.user.familyCode)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(group => { this.dataService.userGroup.events = group.events });

    const newEventBtn = document.getElementById('newEventBtn');
    newEventBtn.addEventListener('click', () => this.toggleModal(this.newEventModal))
  }


  selectEvent(event, targetModal: ModalComponent): void {
    this.selectedEvent = {
      _id: event.event.extendedProps._id,
      title: event.event.title,
      start: event.event.start,
      end: event.event.end ? event.event.end : event.event.start,
      allDay: event.event.allDay,
      location: event.event.extendedProps.location,
      invitees: event.event.extendedProps.invitees,
      notes: event.event.extendedProps.notes,
    }
    this.toggleModal(targetModal);
  }


  selectDay(event, targetModal: ModalComponent): void {
    this.selectedDay.start = event.date;
    this.selectedDay.end = event.date;
    this.toggleModal(targetModal);
  }

  toggleModal(targetModal: ModalComponent): void {
    if (!targetModal.modalVisible) {
      this.modalService.openModal(targetModal);
    } else {
      this.modalService.closeModal(targetModal);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

}
