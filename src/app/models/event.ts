import { User } from './user';
import { DateInput } from '@fullcalendar/core/datelib/env';

export class CalendarEvent {
  _id: string;
  title: string;
  start: DateInput;
  end: DateInput;
  allDay: boolean;
  location: '';
  invitees: User["_id"][];
  notes:string;
}
