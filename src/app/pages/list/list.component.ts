import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { GroupsService } from 'src/app/services/groups.service';
import { DataService } from 'src/app/services/data.service';
import { SortService } from 'src/app/services/sort.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  addItemElemVisible: boolean = false;

  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private groupsService: GroupsService,
    private sortService: SortService) { }

  ngOnInit(): void {
    this.groupsService.searchGroupByToken(this.dataService.user.familyCode)
      .pipe(takeUntil(this.ngUnsubscribe$)).subscribe(group =>
        this.dataService.userGroup.shoppingList = group.shoppingList.sort(this.sortService.sortAtoZ));
  }

  get productList(): Product[] {
    return this.dataService.userGroup.shoppingList;
  }

  addItemElem(): void {
    this.addItemElemVisible = true;
    this.scrollToBottom();
  }

  addItem(product: Product['name']): void {
    if (product) {
      const newProduct: Product = {
        name: product,
        addedBy: this.dataService.user.name,
        done: false,
      } as Product;
      this.scrollToBottom();
      this.dataService.userGroup.shoppingList.push(newProduct);
      this.groupsService.updateGroup(this.dataService.userGroup).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
    }
    this.addItemElemVisible = false;
  }

  doneItem(product: Product, check: boolean): void {
    const idx = this.productList.findIndex((data) => data._id === product._id);
    if (idx > -1) {
      product.done = check;
      this.dataService.userGroup.shoppingList.splice(idx, 1, product);
      this.groupsService.updateGroup(this.dataService.userGroup).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
    }
  }

  deleteItem(product: Product): void {
    this.dataService.userGroup.shoppingList = this.productList.filter((data) => data._id !== product._id);
    this.groupsService.updateGroup(this.dataService.userGroup).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }

  sortList(sortIcon): void {
    if (sortIcon.id === 'sort-az') {
      this.sortService.sortListAz(sortIcon, this.productList);
    } else {
      this.sortService.sortListByDone(sortIcon, this.productList);
    }
  }

  private scrollToBottom(): void {
    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
