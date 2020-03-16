import { Group } from './group';

export class User {
  apiId: number;
  id: number;
  token: number;
  createdAt: Date;
  name: string;
  email: string;
  password: string;
  avatar: string | ArrayBuffer;
  role: string;
  groupToken: Group["token"];
}
