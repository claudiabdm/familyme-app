import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DateTimeAdapter } from '@danielmoncada/angular-datetime-picker';
import { NgxSpinnerService } from 'ngx-spinner';

import { User } from 'src/app/shared/models/user';
import { CalendarEvent } from 'src/app/shared/models/event';
import { CustomValidatorsService } from 'src/app/services/custom-validators.service';
import { DataService } from 'src/app/services/data.service';
import { ModalService } from 'src/app/services/modal.service';
import { GroupsService } from 'src/app/services/groups.service';
import { ModalComponent } from '../../../shared/component/modal/modal.component';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit, OnDestroy {

  @Input() eventInfo: CalendarEvent;
  @Input() formBtn: string;

  @Output() delete = new EventEmitter<CalendarEvent[]>();

  userList: User[] = [];
  inviteeList: User[] = [];
  isVisible: boolean = false;
  eventForm: FormGroup;
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
    this.dataService.getMembers().forEach(user => {
      if (this.eventInfo.invitees.length > 0 && this.eventInfo.invitees.includes(user._id)) {
        this.inviteeList.push(user);
        user.isSelected = true;
      } else {
        user.isSelected = false;
      }
    });

    this.eventForm = this.formBuilder.group({
      title: [this.eventInfo.title, [Validators.required, Validators.minLength(3)]],
      location: this.eventInfo.location,
      start: [this.eventInfo.start, Validators.required],
      end: [this.eventInfo.end, Validators.required],
      allDay: this.eventInfo.allDay,
      invitees: this.inviteeList,
      notes: [this.eventInfo.notes]
    },
      {
        validator: this.customValidators.checkDates('start', 'end'),
      }
    );
  }

  onSubmit(form: FormGroup): void {
    this.spinner.show();
    const group = this.dataService.getGroup();
    form.value.invitees = this.inviteeList.map(user => user._id);

    switch (this.formBtn) {
      case 'Add':
        group.events.push(form.value);
        this.dataService.setGroup(group);
        break;
      case 'Modify':
        const idx = group.events.findIndex(event => event._id === this.eventInfo._id);
        group.events.splice(idx, 1, form.value);
        break;
    }

    this.groupsService.updateGroupData(group).pipe(take(1)).subscribe(() => this.spinner.hide());

  }

  onDeleteEvent() {
    this.spinner.show();
    const group = this.dataService.getGroup();
    const updatedEvents = group.events.filter(event => event._id !== this.eventInfo._id);
    group.events = updatedEvents;
    this.groupsService.updateGroupData(group).pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.spinner.hide(),
      this.delete.emit()
    });
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
    this.userList = [];
    this.inviteeList = [];
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

}
