import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { map, tap, take } from 'rxjs/operators';
import { Product } from 'src/app/shared/models/product';
import { GroupsService } from 'src/app/services/groups.service';
import { DataService } from 'src/app/services/data.service';
import { SortService } from './sort.service';
import { Group } from 'src/app/shared/models/group';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  addItemElemVisible: boolean = false;
  productList$: Observable<Group['shoppingList']>;
  private ngUnsubscribe$ = new Subject<void>();
  private group: Group;

  constructor(
    private dataService: DataService,
    private groupsService: GroupsService,
    private sortService: SortService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.spinner.show();
    this.productList$ = this.dataService.groupData$
      .pipe(
        map(group => {
          this.group = group;
          return group?.shoppingList.map(product => {
            product.addedBy = this.dataService.getMembers()?.find(member => member._id === product.addedById)?.name || product.addedBy;
            return product;
          })
        }),
        tap(() => this.spinner.hide())
      );
  }

  get sortIconAZ(): boolean {
    return this.sortService.sortedAtoZ;
  }
  get sortIconDone(): boolean {
    return this.sortService.sortedDone;
  }

  addItemElem(): void {
    this.addItemElemVisible = true;
    this.scrollToBottom();
  }

  addItem(product: Product['name']): void {
    if (product) {
      const newProduct: Product = {
        name: product,
        addedBy: this.dataService.getUser().name,
        addedById: this.dataService.getUser()._id,
        done: false,
      };
      this.scrollToBottom();

      this.group.shoppingList.push(newProduct);
      this.dataService.setGroup(this.group)
      this.groupsService.updateGroupData(this.group).pipe(take(1)).subscribe();
    }
    this.addItemElemVisible = false;
  }

  doneItem(selectedProduct: Product, check: boolean): void {
    const idx = this.group.shoppingList.findIndex((product) => product._id === selectedProduct._id);
    if (idx > -1) {
      selectedProduct.done = check;
      this.group.shoppingList.splice(idx, 1, selectedProduct);
      this.dataService.setGroup(this.group)
      this.groupsService.updateGroupData(this.group).pipe(take(1)).subscribe();
    }
  }

  deleteItem(selectedProduct: Product): void {
    const updatedShoppingList = this.group.shoppingList.filter((product) => product._id !== selectedProduct._id);
    this.group.shoppingList = updatedShoppingList;
    this.dataService.setGroup(this.group)
    this.groupsService.updateGroupData(this.group).pipe(take(1)).subscribe();
  }

  sortList(sortIcon): void {
    const productList = this.group.shoppingList;
    if (sortIcon.id === 'sort-az') {
      this.group.shoppingList = this.sortService.sortListAz(productList);
    } else {
      this.group.shoppingList = this.sortService.sortListByDone(productList);
    }
    this.dataService.setGroup(this.group);
  }

  onReset() {
    this.groupsService.getGroupByFamilyCode(this.dataService.familyCode).pipe(take(1)).subscribe();
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
