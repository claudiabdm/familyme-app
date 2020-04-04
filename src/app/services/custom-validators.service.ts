import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CustomValidatorsService {

  constructor() { }

  patternValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return null;
      }
      const regex = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$');
      const valid = regex.test(control.value);
      return valid ? null : { validPassword: false };
    };
  }

  matchPassword(password: string, passwordConfirm: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls.password;
      const passwordConfirmControl = formGroup.controls.passwordConfirm;

      if (!passwordControl || !passwordConfirmControl) {
        return null;
      }

      if (passwordConfirmControl.errors && !passwordConfirmControl.errors.passwordMismatch) {
        return null;
      }

      if (passwordControl.value !== passwordConfirmControl.value) {
        passwordConfirmControl.setErrors({ passwordMismatch: true });
      } else {
        passwordConfirmControl.setErrors(null);
      }
    }
  }

  checkDates(startDate: string, endDate: string) {
    return (formGroup: FormGroup) => {
      const startControl = formGroup.controls.startDate;
      const endControl = formGroup.controls.endDate;

      if (!startControl || !endControl) {
        return null;
      }

      if (endControl.errors && !endControl.errors.datesError) {
        return null;
      }

      if (startControl.value > endControl.value) {
        endControl.setErrors({ datesError: true });
      } else {
        endControl.setErrors(null);
      }
    }
  }

}
