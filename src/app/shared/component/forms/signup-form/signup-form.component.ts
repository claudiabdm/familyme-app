import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {

  @Input() famField = {
    label: '',
    placeholder: '',
  };

  isVisible: boolean = false;
  type: string = 'password';

  signupForm: FormGroup = this.formBuilder.group({
    email: ['', Validators.required],
    name: ['', Validators.required],
    famField: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(6)]],
    passwordConfirm: ['', [Validators.required, Validators.minLength(6), this.validatePswdConfirm]],
  });

  constructor(private formBuilder: FormBuilder, public authService: AuthService) { }

  ngOnInit(): void {

  }

  onSubmit(form: FormGroup) {
    this.authService.signUp(form.value);
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

  private validatePswdConfirm() {

  }

}
