import { Component, OnInit, ViewChild } from '@angular/core';
import { takeUntil, map, tap, switchMap, take } from 'rxjs/operators';
import { Subject, Observable, pipe } from 'rxjs';

import dayGridPlugin from '@fullcalendar/daygrid';
import listGridPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';

import { CalendarEvent } from 'src/app/shared/models/event';
import { ModalService } from 'src/app/services/modal.service';
import { DataService } from 'src/app/services/data.service';
import { GroupsService } from 'src/app/services/groups.service';
import { ModalComponent } from 'src/app/shared/component/modal/modal.component';
import { Group } from 'src/app/shared/models/group';
import { User } from 'src/app/shared/models/user';
import { UsersService } from 'src/app/services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('newEventModal') newEventModal: ModalComponent;


  private ngUnsubscribe$ = new Subject<void>();

  calendarEvents: Observable<Group['events']>;
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
    private modalService: ModalService,
    private usersService: UsersService,
    private groupsService: GroupsService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.usersService.getLoggedUser().pipe(
      switchMap((user: User) => {
        return this.groupsService.getGroupByFamilyCode(user.familyCode);
      }),
      switchMap((group: Group) => {
        return this.usersService.getUsersByFamilyCode(group.familyCode);
      }),
      tap(() => {
        this.calendarEvents = this.dataService.groupData$.pipe(map(group => group.events));
      }),
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(() => this.spinner.hide());

    const newEventBtn = document.getElementById('newEventBtn');
    newEventBtn?.addEventListener('click', () => this.toggleModal(this.newEventModal))
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

  onReset() {
    this.groupsService.getGroupByFamilyCode(this.dataService.familyCode).pipe(take(1)).subscribe();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

}
