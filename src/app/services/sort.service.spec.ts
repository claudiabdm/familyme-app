import { TestBed } from '@angular/core/testing';

import { SortService } from './sort.service';
import { Product } from '../models/product';

describe('SortService', () => {
  let service: SortService;
  let shoppingList;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortService);
    shoppingList = [
      {
        name: 'Milk',
        done: false
      },
      {
        name: 'Bread',
        done: true
      },
      {
        name: 'Carrot',
        done: false
      }
    ];
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should order A to Z', () => {
    shoppingList = [
      {
        name: 'Milk'
      },
      {
        name: 'Bread'
      },
      {
        name: 'Carrot'
      }
    ];

    expect(shoppingList.sort(service.sortAtoZ)).toEqual([
      {
        name: 'Bread'
      },
      {
        name: 'Carrot'
      },
      {
        name: 'Milk'
      }
    ])
  })

  it('should order by Done', () => {


    expect(shoppingList.sort(service.sortByDone)).toEqual([
      {
        name: 'Bread',
        done: true
      },
      {
        name: 'Milk',
        done: false
      },
      {
        name: 'Carrot',
        done: false
      },
    ])
  })

});
