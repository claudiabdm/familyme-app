import { User } from './user';

export class Message {
  addedBy: User['_id'] | User['name'];
  userAvatar: User['avatar'];
  text: string;
  createdAt: Date;
}
