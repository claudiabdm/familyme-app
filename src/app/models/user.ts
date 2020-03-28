import { Group } from './group';

export class User {
  id: number;
  createdAt: Date;
  name: string;
  email: string;
  password: string;
  avatar: string | ArrayBuffer;
  role: string;
  groupId: Group["id"];
  groupToken: Group["token"];
  location: google.maps.LatLngLiteral;
  isSelected: boolean;
}
