import { Component, OnInit, ViewChild } from '@angular/core';
import { takeUntil, map, take, tap, mergeMap, delay } from 'rxjs/operators';
import { Subject, Observable, concat } from 'rxjs';

import dayGridPlugin from '@fullcalendar/daygrid';
import listGridPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

import { CalendarEvent } from 'src/app/shared/models/event';
import { ModalService } from 'src/app/services/modal.service';
import { DataService } from 'src/app/services/data.service';
import { GroupsService } from 'src/app/services/groups.service';
import { ModalComponent } from 'src/app/shared/component/modal/modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('newEventModal') newEventModal: ModalComponent;

  private ngUnsubscribe$ = new Subject<void>();

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, listGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    height: 'auto',
    aspectRatio: 2,
    events: undefined, // set in ngOnInit
    // customButtons: false,
    eventTimeFormat: 'eventTimeFormat',
    firstDay: 1,
    dateClick: undefined, // set in ngOnInit
    eventClick: undefined, // set in ngOnInit
  };

  header = {
    left: 'dayGridMonth,listWeek,today',
    right: 'prev,next',
    center: 'title',
  };
  eventTimeFormat = {
    hour: 'numeric',
    minute: '2-digit',
    meridiem: false,
    hour12: false,
  };
  selectedEvent: CalendarEvent;
  selectedDay = {
    title: '',
    location: '',
    start: new Date(),
    end: new Date(),
    allDay: true,
    invitees: [],
    notes: '',
  };

  constructor(
    private dataService: DataService,
    private modalService: ModalService,
    private groupsService: GroupsService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.spinner.show();

    this.dataService.groupData$
      .pipe(
        takeUntil(this.ngUnsubscribe$),
        map((group) => {
          this.calendarOptions.events = group.events;
        }),
        delay(500)
      )
      .subscribe((group) => {
        this.spinner.hide();
      });

    this.modalService.btnClicked
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((res) => {
        if (res === 'newEventBtn') {
          this.toggleModal(this.newEventModal);
          this.calendarOptions.dateClick = this.selectDay.bind(
            this,
            this.newEventModal
          );
        }
        // this.selectEvent.bind(this, this.modifyEventModal);
      });
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
    };
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

  onReset() {
    this.groupsService
      .getGroupByFamilyCode(this.dataService.familyCode)
      .pipe(take(1))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
