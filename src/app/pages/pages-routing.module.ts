import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';
import { NotificationsComponent } from './notifications/notifications.component';

const pagesRoutes: Routes = [
  { path: '',
    component: PagesComponent,
    children: [
      { path: 'notifications', component: NotificationsComponent },
      { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule)},
      { path: 'calendar', loadChildren: () => import('./calendar/calendar.module').then(m => m.CalendarModule)},
      { path: 'locator', loadChildren: () => import('./locator/locator.module').then(m => m.LocatorModule)},
      { path: 'list', loadChildren: () => import('./list/list.module').then(m => m.ListModule)},
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(pagesRoutes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
