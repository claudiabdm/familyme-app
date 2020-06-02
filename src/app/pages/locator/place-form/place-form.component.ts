import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-place-form',
  templateUrl: './place-form.component.html',
  styleUrls: ['./place-form.component.scss']
})
export class PlaceFormComponent implements OnInit {

  newPlaceForm: FormGroup;
  locations: [] = [];

  constructor(
    private formBuilder: FormBuilder,
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.newPlaceForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      location: '',
    })
  }

  onSubmit(form: FormGroup){

  }

  searchLocation() {
    const search = this.newPlaceForm.controls.location.value;
    if (search) {
      this.mapService.getNearbyPlaces(search).subscribe((res: []) => this.locations = res);
    } else {
      this.locations = [];
    }
  }

}
