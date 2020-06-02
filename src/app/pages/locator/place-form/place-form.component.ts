import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-place-form',
  templateUrl: './place-form.component.html',
  styleUrls: ['./place-form.component.scss']
})
export class PlaceFormComponent implements OnInit {

  newPlaceForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.newPlaceForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      location: '',
    })
  }

  onSubmit(form: FormGroup){

  }

}
