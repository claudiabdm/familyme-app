import { Product } from './product';
import { User } from './user';

export class group {
  id: number;
  createdAt: Date;
  name: string;
  members: User[];
  shoppingList: Product[];
}
