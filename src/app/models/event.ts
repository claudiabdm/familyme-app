import { User } from './user';
import { DateInput } from '@fullcalendar/core/datelib/env';

export class CalendarEvent {
  id: number;
  modifyAt: Date;
  title: string;
  start: DateInput;
  end: DateInput;
  allDay: boolean;
  location: '';
  invitees: User["id"][];
  notes:string;
}
