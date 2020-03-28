import { Product } from './product';

export class Group {
  id: number;
  createdAt: Date;
  token: string;
  name: string;
  shoppingList: Product[];
}
