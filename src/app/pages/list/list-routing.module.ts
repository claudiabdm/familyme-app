import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from './list.component';

const listRoute: Routes = [
  { path: '', component: ListComponent },
];

@NgModule({
  imports: [RouterModule.forChild(listRoute)],
  exports: [RouterModule]
})

export class ListRoutingModule { }
