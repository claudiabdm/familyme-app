import { Component, OnInit, Input } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators, AbstractControl} from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CustomValidatorsService } from 'src/app/services/custom-validators.service';


@Component({
  selector: 'app-signup-form',
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.scss']
})
export class SignupFormComponent implements OnInit {

  @Input() singUpType = {
    title: 'Sign in',
    id: 'string',
    label: 'string',
    placeholder: 'string',
  };

  signupForm: FormGroup;
  isVisible: boolean = false;
  type: string = 'password';


  constructor(
    public authService: AuthService,
    private formBuilder: FormBuilder,
    private customValidators: CustomValidatorsService) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', Validators.required],
      group: ['', Validators.required],
      password: ['', [Validators.required, this.customValidators.patternValidator()]],
      passwordConfirm: ['', [Validators.required]],
    },
    {
      validator: this.customValidators.matchPassword('password', 'passwordConfirm'),
    }
    );
    this.signupForm.reset()
  }

  onSubmit(form: FormGroup): void {
    if (form.valid) {
      delete form.value.passwordConfirm;
      if (this.singUpType.id === 'createModal') {
        this.authService.signUpCreate(form.value);
      } else {
        this.authService.signUpJoin(form.value);
      }
    }
    this.signupForm.reset()
  }

  showPswd(): void {
    if (this.isVisible) {
      this.isVisible = false;
      this.type = 'password';
    } else {
      this.isVisible = true;
      this.type = 'text';
    }
  }

}
