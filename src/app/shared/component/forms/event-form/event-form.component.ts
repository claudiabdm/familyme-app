import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';

import { CustomValidatorsService } from 'src/app/services/custom-validators.service';
import { DataService } from 'src/app/services/data.service';
import { ModalService } from 'src/app/services/modal.service';
import { ModalComponent } from '../../modal/modal.component';
import { User } from 'src/app/models/user';
import { CalendarEvent } from 'src/app/models/event';
import { GroupsService } from 'src/app/services/groups.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit, OnDestroy {

  @Input() eventInfo: CalendarEvent | any;
  @Input() formBtn: string;

  @Output() onEventListChange = new EventEmitter<CalendarEvent[]>();

  userList: User[] = [];
  inviteeList: User[] = [];
  eventForm: FormGroup;
  isVisible: boolean = false;
  datePickerConfig: {
    pickerType: 'both',
  }

  private ngUnsubscribe$ = new Subject<void>();


  constructor(
    private dataService: DataService,
    private groupsService: GroupsService,
    private formBuilder: FormBuilder,
    private customValidators: CustomValidatorsService,
    private modalService: ModalService,
    private dateTimeAdapter: DateTimeAdapter<any>,
    private spinner: NgxSpinnerService,
  ) {
    this.dateTimeAdapter.setLocale('en-GB');
  }

  ngOnInit(): void {

    this.dataService.userList.forEach(user => {
      if (this.eventInfo.invitees.length > 0 && this.eventInfo.invitees.includes(user.id)) {
        this.inviteeList.push(user);
        user.isSelected = true;
      } else {
        user.isSelected = false;
      }
    });

    this.eventForm = this.formBuilder.group({
      eventName: [this.eventInfo.title, [Validators.required, Validators.minLength(3)]],
      location: this.eventInfo.location,
      startDate: [this.eventInfo.start, Validators.required],
      endDate: [this.eventInfo.end, Validators.required],
      allDay: this.eventInfo.allDay,
      notes: [this.eventInfo.notes]
    },
      {
        validator: this.customValidators.checkDates('startDate', 'endDate'),
      }
    );
  }

  onSubmit(form: FormGroup): void {
    this.spinner.show();
    const eventToSubmit = {
      id: 0,
      modifyAt: new Date(),
      title: form.value.eventName,
      location: form.value.location,
      start: form.value.startDate,
      end: form.value.endDate,
      allDay: form.value.allDay,
      invitees: this.inviteeList.map(user => user.id),
      notes: form.value.notes,
      deleted: false,
    }
    switch (this.formBtn) {
      case 'Add':
        const ids = this.dataService.userGroup.events.map(a => a.id);
        const eventId = this.dataService.userGroup.events.length > 0 ? Math.max(...ids) + 1 : 1;
        eventToSubmit.id = eventId;
        this.dataService.userGroup.events.push(eventToSubmit);
        break;
      case 'Modify':
        const idx = this.dataService.userGroup.events.findIndex(event => event.id === this.eventInfo.id);
        eventToSubmit.id = this.eventInfo.id;
        this.dataService.userGroup.events.splice(idx, 1, eventToSubmit);
        break;
    }
    this.groupsService.updateGroup(this.dataService.userGroup).pipe(takeUntil(this.ngUnsubscribe$)).subscribe(
      group => {
        this.onEventListChange.emit(group.events)
        this.spinner.hide();
      });
  }

  deleteEvent() {
    const idx = this.dataService.userGroup.events.findIndex(event => event.id === this.eventInfo.id);
    this.eventInfo.deleted = true;
    this.dataService.userGroup.events.splice(idx, 1, this.eventInfo);
    this.groupsService.updateGroup(this.dataService.userGroup).pipe(takeUntil(this.ngUnsubscribe$)).subscribe(
      group => this.onEventListChange.emit(group.events));
  }

  onAddInvitee(modal) {
    this.inviteeList = this.userList.filter(user => user.isSelected === true);
    this.toggleModal(modal);
  }

  toggleModal(targetModal: ModalComponent): void {
    if (!targetModal.modalVisible) {
      this.modalService.openModal(targetModal);
    } else {
      this.modalService.closeModal(targetModal);
      this.userList.forEach(user => user.isSelected = this.inviteeList.includes(user));
    }
  }

  ngOnDestroy(): void {
    this.eventForm.reset();
    this.eventInfo = {};
    this.userList = [];
    this.inviteeList = [];
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

}
