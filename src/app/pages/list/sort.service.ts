import { Injectable } from '@angular/core';
import { Product } from '../../shared/models/product';

@Injectable()
export class SortService {

  sortedAtoZ: boolean = true;
  sortedDone: boolean = true;

  constructor() { }


  sortAtoZ(a: any, b: any): number {
    if (a.name.toLowerCase() < b.name.toLowerCase()) {
      return -1;
    } else if (a.name.toLowerCase() > b.name.toLowerCase()) {
      return 1;
    } else {
      return 0;
    }
  };

  sortByDone(a: any, b: any): number {
    return (b.done ? 1 : 0) - (a.done ? 1 : 0);
  }

  sortListAz(list: Product[]): Product[] {
    if (this.sortedAtoZ) {
      list.sort(this.sortAtoZ).reverse();
      this.sortedAtoZ = false;
    } else {
      list.sort(this.sortAtoZ);
      this.sortedAtoZ = true;
    }
    return list;
  }

  sortListByDone(list: Product[]): Product[] {
    if (this.sortedDone) {
      list.sort(this.sortAtoZ).sort(this.sortByDone);
      this.sortedDone = false;
    } else {
      list.sort(this.sortAtoZ).sort(this.sortByDone).reverse();
      this.sortedDone = true;
    }
    return list;
  }

}
