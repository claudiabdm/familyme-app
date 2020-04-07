import { Group } from './group';

export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  avatar: string | ArrayBuffer;
  role: string;
  familyCode: Group["familyCode"];
  location: google.maps.LatLngLiteral;
  isSelected: boolean;
}
