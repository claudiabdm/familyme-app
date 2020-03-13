import { Group } from './group';

export class User {
  id: number;
  token: number;
  createdAt: Date;
  name: string;
  email: string;
  password: string;
  avatar: string;
  role: string;
  groupToken: Group["token"];
}
