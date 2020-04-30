import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pswdreset-form',
  templateUrl: './pswdreset-form.component.html',
  styleUrls: ['./pswdreset-form.component.scss']
})
export class PswdresetFormComponent implements OnInit {

  pswdResetForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.pswdResetForm = this.formBuilder.group({
      inputEmail: ['', Validators.required],
    });
    this.pswdResetForm.reset();
  }

  sendEmail(form: FormGroup){

  }


}
