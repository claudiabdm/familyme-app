import { Product } from './product';
import { CalendarEvent } from './event';

export class Group {
  id: number;
  createdAt: Date;
  token: string;
  name: string;
  shoppingList: Product[];
  events: CalendarEvent[];
}
