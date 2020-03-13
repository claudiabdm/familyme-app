import { User } from './user';

export class Product {
  id: number;
  createdAt: Date;
  name: string;
  addedBy: User["name"];
}
