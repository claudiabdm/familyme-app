import { Product } from './product';
import { CalendarEvent } from './event';

export class Group {
  _id: string;
  familyCode: string;
  name: string;
  shoppingList: Product[];
  events: CalendarEvent[];
}
