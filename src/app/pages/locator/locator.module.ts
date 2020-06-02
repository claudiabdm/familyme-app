import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LocatorRoutingModule } from './locator-routing.module';
import { LocatorComponent } from './locator.component';
import { PlaceFormComponent } from './place-form/place-form.component';


@NgModule({
  declarations: [LocatorComponent, PlaceFormComponent],
  imports: [
    SharedModule,
    LocatorRoutingModule,
  ],
  exports: [
    LocatorComponent,
  ]
})
export class LocatorModule { }
