import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { LocatorRoutingModule } from './locator-routing.module';
import { LocatorComponent } from './locator.component';


@NgModule({
  declarations: [LocatorComponent],
  imports: [
    SharedModule,
    LocatorRoutingModule,
  ],
  exports: [
    LocatorComponent,
  ]
})
export class LocatorModule { }
