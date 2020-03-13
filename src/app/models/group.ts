import { Product } from './product';
import { User } from './user';

export class Group {
  apiId: number;
  id: number;
  createdAt: Date;
  token: string;
  name: string;
  members: User[];
  shoppingList: Product[];
}
