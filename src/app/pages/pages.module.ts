import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { PagesRoutingModule } from './pages-routing.module';

import { PagesComponent } from './pages.component';
import { NotificationsComponent } from './notifications/notifications.component';

@NgModule({
  declarations: [PagesComponent, NotificationsComponent],
  imports: [
    SharedModule,
    PagesRoutingModule
  ],
  exports: [
    PagesComponent,
  ]
})
export class PagesModule { }
