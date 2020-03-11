import { Component, OnInit } from '@angular/core';
import { Button } from 'src/app/models/button';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {

  public button: Button = {
    id: "newEventButton",
    name: "New event"
  }

  constructor() { }

  ngOnInit(): void {
  }

}
