import { Product } from './product';
import { User } from './user';

export class Group {
  id: number;
  createdAt: Date;
  token: string;
  name: string;
  shoppingList: Product[];
}
