import { User } from './user';

export class Message {
  addedBy:  User['name'];
  userId: User['_id'];
  userAvatar: User['avatar'] | undefined;
  text: string;
  createdAt: Date;
}
