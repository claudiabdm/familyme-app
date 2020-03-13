import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Group } from 'src/app/models/group';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public modalVisible: boolean = false;
  targetModal =  {
    title: 'Settings',
    id: 'string',
  };

  constructor(private authService: AuthService) {

  }

  ngOnInit(): void {

  }

  get user(): User {
    return this.authService.user;
  }

  get userGroup(): Group {
    return this.authService.userGroup;
  }


  openSettingsModal(){
    this.modalVisible = true;
  };

  close(modal){
    this.modalVisible = false;
  }

}
