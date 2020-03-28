import { Component, OnInit, ViewChild } from '@angular/core';
import { Calendar, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import listGridPlugin from '@fullcalendar/list';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { ModalComponent } from 'src/app/shared/component/modal/modal.component';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  @ViewChild('newEventModal') newEventModal: ModalComponent;

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

  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
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

}
