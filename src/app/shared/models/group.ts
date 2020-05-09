import { Product } from './product';
import { CalendarEvent } from './event';
import { Message } from './message';

export class Group {
  _id: string;
  familyCode: string;
  name: string;
  shoppingList: Product[];
  events: CalendarEvent[];
}
