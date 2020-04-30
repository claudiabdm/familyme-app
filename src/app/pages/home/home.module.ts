import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SettingsComponent } from './settings/settings.component';


@NgModule({
  declarations: [HomeComponent, SettingsComponent],
  imports: [
    SharedModule,
    HomeRoutingModule,
  ],
  exports: [
    HomeComponent,
    SettingsComponent
  ]
})
export class HomeModule { }
