import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-place-form',
  templateUrl: './place-form.component.html',
  styleUrls: ['./place-form.component.scss'],
})
export class PlaceFormComponent implements OnInit {

  newPlaceForm: FormGroup;
  locations: [] = [];
  categories: string[] = ['Home', 'Restaurant', 'Cafe', 'School'];
  locationOpen: boolean = false;
  categoryOpen: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.newPlaceForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      locationName: ['', [Validators.required]],
      categoryName:  ['', [Validators.required]],
      location: ['', [Validators.required]]
    })
  }

  onSubmit(form: FormGroup) {
    if (form) {
      this.mapService.addNewPlace(form.value);
    }
  }

  searchLocation(locationName: string) {
    const search = locationName;
    if (search) {
      this.locationOpen = true;
      this.mapService.searchPlace(search).subscribe((res: []) => this.locations = res);
    } else {
      this.locations = [];
      this.locationOpen = false;
    }
  }

  selectLocation(location) {
    this.newPlaceForm.controls.locationName.setValue(location.name);
    this.newPlaceForm.controls.location.setValue(location);
    this.locations = []
  }


  toggleCategory() {
    this.categoryOpen = !this.categoryOpen;
  }

  selectCategory(category) {
    this.newPlaceForm.controls.categoryName.setValue(category);
    this.categoryOpen = false;
  }

  onClickOutside(e) {
    if (this.locationOpen) {
      this.locationOpen = false;
    }

    if (this.categoryOpen) {
      this.categoryOpen = false;
    }
  }

}
