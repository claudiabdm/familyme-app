import { Component, OnInit, Output, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { ModalComponent } from 'src/app/shared/component/modal/modal.component';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public modalVisible: boolean = false;
  targetModal:  {
    title: string,
    id: string,
    label: string,
    placeholder: string,
  };
  constructor(private router: Router) { }

  ngOnInit(): void {
  }


  goBack(){
    this.router.navigate(['pages/login'])
  }

  openCreateModal(){
    this.targetModal = {
      title: 'Sign up - Create',
      id: 'createModal',
      label: 'Name',
      placeholder: 'Smith Sánchez',
    }
    console.log(this.modalVisible)
    this.modalVisible = true;
  }

  openJoinModal(){
    this.targetModal = {
      title: 'Sign up - Join',
      id: 'joinModal',
      label: 'Code',
      placeholder: 'xxx123',
    }
    this.modalVisible = true;
  }

  close(modal){
    this.modalVisible = false;
  }


}
