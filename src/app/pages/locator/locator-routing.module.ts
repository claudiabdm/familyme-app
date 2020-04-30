import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocatorComponent } from './locator.component';

const locatorRoute: Routes = [
  { path: '', component: LocatorComponent },
];

@NgModule({
  imports: [RouterModule.forChild(locatorRoute)],
  exports: [RouterModule]
})

export class LocatorRoutingModule { }
