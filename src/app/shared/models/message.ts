import { User } from './user';
import { Group } from './group';

export class Message {
  groupId: Group['_id'];
  addedBy:  User['name'];
  userId: User['_id'];
  userAvatar?: User['avatar'];
  text: string;
  createdAt: Date;
}
