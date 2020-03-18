import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  @Input() user: User;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
  }

  logOut(){
    this.authService.logOut();
  }

  deleteAccount(){

  }

  locationOn(){

  }

  notificationsOn() {

  }

}
