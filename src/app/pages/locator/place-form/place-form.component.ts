import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MapService } from 'src/app/services/map.service';

@Component({
  selector: 'app-place-form',
  templateUrl: './place-form.component.html',
  styleUrls: ['./place-form.component.scss'],
  host: {
    "(window:click)": "onClickOutside()"
  }
})
export class PlaceFormComponent implements OnInit {

  newPlaceForm: FormGroup;
  locations: [] = [];
  categories: string[] = ['Home', 'Restaurant', 'Cafe', 'High School', 'University'];
  filteredCategories: string[];
  locationOpen: boolean = false;
  categoryOpen: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private mapService: MapService
  ) { }

  ngOnInit(): void {
    this.filteredCategories = this.categories;
    this.newPlaceForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      locationName: '',
      categoryName: '',
      location: {}
    })
  }

  onSubmit(form: FormGroup){
    console.log(form.controls.location);
  }

  searchLocation(locationName: string) {
    const search = locationName;
    if (search) {
      this.locationOpen = true;
      this.mapService.searchPlace(search).subscribe((res: []) => this.locations = res);
    } else {
      this.locations = [];
      this.locationOpen = false;
    }
  }

  searchCategory(categoryName: string) {
    if (categoryName) {
      this.categoryOpen = true;
      const searchRegex = new RegExp(categoryName, 'i');
      this.filteredCategories = this.categories.filter(category => searchRegex.test(category.toLowerCase()));
    } else {
      this.filteredCategories = this.categories;
      this.newPlaceForm.controls.categoryName.setValue('');
      this.categoryOpen = false;

    }
  }

  selectLocation(location) {
    this.newPlaceForm.controls.locationName.setValue(location.name);
    this.newPlaceForm.controls.location.setValue(location);
    console.log(location)
    this.locations = []
  }

  selectCategory(category) {
    this.newPlaceForm.controls.categoryName.setValue(category);
    console.log(category)
    this.filteredCategories = []
  }

  onClickOutside() {
    this.categoryOpen = false;
    this.locationOpen = false;
  }

}
