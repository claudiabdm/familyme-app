import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { CustomValidatorsService } from 'src/app/services/custom-validators.service';
import { DataService } from 'src/app/services/data.service';
import { ModalService } from 'src/app/services/modal.service';
import { ModalComponent } from '../../modal/modal.component';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent implements OnInit {

  userList: User[];
  inviteeList: User[];
  eventForm: FormGroup;
  isVisible: boolean = false;

  constructor(
    public authService: AuthService,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private customValidators: CustomValidatorsService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.eventForm = this.formBuilder.group({
      eventName: ['', [Validators.required, Validators.minLength(3)]],
      location: ['', Validators.required],
      startDate: ['', Validators.required],
      startTime: ['', Validators.required],
      endDate: ['', Validators.required],
      endTime: ['', Validators.required],
    },

    {
      validator: this.customValidators.matchPassword('password', 'passwordConfirm'),
    }
    );
    this.eventForm.reset()
  }


  onSubmit(form: FormGroup): void {

  }

  onAdd(modal){
    this.inviteeList = this.userList.filter(user => user.isSelected === true);
    this.toggleModal(modal);
  }

  toggleModal(targetModal: ModalComponent): void {
    if (!targetModal.modalVisible) {
      this.modalService.openModal(targetModal);
    } else {
      this.modalService.closeModal(targetModal);
    }
  }

}
