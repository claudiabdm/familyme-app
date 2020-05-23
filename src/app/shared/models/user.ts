import { Group } from './group';

export class User {
  _id: string;
  name: string;
  email?: string;
  password?: string;
  avatar: string | ArrayBuffer;
  role: string;
  familyCode: Group["familyCode"];
  location: google.maps.LatLngLiteral;
  isSelected: boolean;
  lastConnection: Date;
  isShopping: boolean;
  notificationsRead: boolean;
}
