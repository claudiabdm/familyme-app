import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';
import { Button } from 'src/app/models/button';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() button: Button;
  @Input() switchVisible: boolean = false;

  constructor(
    private dataService: DataService
  ) { }

  ngOnInit(): void {
  }

  get userList() {
    return this.dataService.userList;
  }

}
