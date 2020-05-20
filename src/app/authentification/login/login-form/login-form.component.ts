import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

  loginForm: FormGroup;
  isVisible: boolean = false;
  invalidUser: boolean = false;
  type: string = 'password';


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.loginForm.reset();
  }

  onSubmit(form: FormGroup) {
    this.spinner.show();
    if (form.valid) {
      this.authService.logIn(form.value)
        .subscribe(
          res => {
            if (res) {
              this.spinner.hide();
            } else {
              throwError('Something went wrong');
            }
          },
          error => {
            this.spinner.hide();
            this.invalidUser = error.status === 401;
          });
    }
  }

  showPswd() {
    if (this.isVisible) {
      this.isVisible = false;
      this.type = 'password';
    } else {
      this.isVisible = true;
      this.type = 'text';
    }
  }

}
