import { Injectable } from '@angular/core';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class SortService {

  private sortedAtoZ: boolean = true;
  private sortedDone: boolean = false;

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

  sortListAz(iconSort, list: Product[]): void {
    if (this.sortedAtoZ) {
      list.sort(this.sortAtoZ).reverse();
      iconSort.classList.remove('icon--sort-az');
      this.sortedAtoZ = false;
    } else {
      list.sort(this.sortAtoZ);
      iconSort.classList.add('icon--sort-az');
      this.sortedAtoZ = true;
    }
  }

  sortListByDone(iconSort, list: Product[]): void {
    if (this.sortedDone) {
      list.sort(this.sortAtoZ).sort(this.sortByDone);
      this.sortedDone = false;
      iconSort.classList.add('icon--sort-down');
    } else {
      list.sort(this.sortAtoZ).sort(this.sortByDone).reverse();
      this.sortedDone = true;
      iconSort.classList.remove('icon--sort-down');
    }
  }

}
