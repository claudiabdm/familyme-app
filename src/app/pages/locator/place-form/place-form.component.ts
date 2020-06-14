import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-place-form',
  templateUrl: './place-form.component.html',
  styleUrls: ['./place-form.component.scss'],
})
export class PlaceFormComponent implements OnInit {
  @Input() categories: string;
  newPlaceForm: FormGroup;
  locations: [] = [];
  locationOpen: boolean = false;
  categoryOpen: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.newPlaceForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required]],
      categoryName: ['', [Validators.required]],
      location: ['', [Validators.required]]
    })
  }

  onSubmit(form: FormGroup): void {
    if (form) {
      this.mapService.addNewPlace(form.value);
    }
    form.reset();
  }

  searchLocation(address: string): void {
    const search = address;
    if (search) {
      this.locationOpen = true;
      this.mapService.searchPlace(search).subscribe((res: []) => this.locations = res);
    } else {
      this.locations = [];
      this.locationOpen = false;
    }
  }

  selectLocation(location): void {
    this.newPlaceForm.controls.address.setValue(location.name);
    this.newPlaceForm.controls.location.setValue(location);
    this.locations = []
  }

  toggleCategory(): void {
    this.categoryOpen = !this.categoryOpen;
  }

  selectCategory(category): void {
    this.newPlaceForm.controls.categoryName.setValue(category);
    this.categoryOpen = false;
  }

  onClickOutside(e): void {
    if (this.locationOpen) {
      this.locationOpen = false;
    }

    if (this.categoryOpen) {
      this.categoryOpen = false;
    }
  }

}
