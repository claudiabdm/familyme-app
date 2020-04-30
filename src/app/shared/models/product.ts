import { User } from './user';

export class Product {
  _id: string;
  name: string;
  addedBy: User["name"];
  done: boolean;
}
