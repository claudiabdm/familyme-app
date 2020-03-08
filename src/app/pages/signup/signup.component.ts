import { Component, OnInit, Output } from '@angular/core';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  cerrar(modal){
    modal.nativeElement.children[0].classList.remove('modal--show');
  }

}
