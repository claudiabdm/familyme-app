import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  isVisible: boolean = false;
  type: string = 'password';
  loginForm: FormGroup = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  constructor(private formBuilder: FormBuilder, public authService: AuthService) { }

  ngOnInit(): void {
  }

  onSubmit(form: FormGroup) {
    this.authService.logIn(form.value);
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
