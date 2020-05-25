import { Group } from './group';

export class User {
  _id: string;
  name: string;
  email?: string;
  password?: string;
  avatar: string | ArrayBuffer;
  role: string;
  familyCode: Group["familyCode"];
  location: {lat: string | number, lng: string | number};
  isSelected: boolean;
  lastConnection: Date;
  isShopping: boolean;
  notificationsOn: boolean;
  locationOn: boolean;
}
