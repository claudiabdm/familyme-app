import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CustomValidatorsService } from 'src/app/services/custom-validators.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

  eventForm: FormGroup;
  isVisible: boolean = false;

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private customValidators: CustomValidatorsService
  ) { }

  ngOnInit(): void {

    this.eventForm = this.formBuilder.group({
      eventName: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', Validators.required],
    },
    {
      validator: this.customValidators.matchPassword('password', 'passwordConfirm'),
    }
    );
    this.eventForm.reset()
  }

  get userList(){
    return this.dataService.userList;
  }



  onSubmit(form: FormGroup): void {

  }

}
