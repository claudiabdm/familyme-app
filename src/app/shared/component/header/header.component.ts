import { Component, OnInit, Input } from '@angular/core';
import { Button } from 'src/app/models/button';
import { DataService } from 'src/app/services/data.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() button: Button;
  @Input() targetModal: ModalComponent;
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
