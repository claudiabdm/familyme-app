import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { ListRoutingModule } from './list-routing.module';
import { SortService } from './sort.service';
import { ListComponent } from './list.component';


@NgModule({
  declarations: [ListComponent],
  imports: [
    SharedModule,
    ListRoutingModule,
  ],
  exports: [
    ListComponent,
  ],
  providers: [SortService]
})
export class ListModule { }
