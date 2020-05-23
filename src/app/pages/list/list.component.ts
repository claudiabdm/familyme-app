import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil, map, tap, switchMap } from 'rxjs/operators';
import { Product } from 'src/app/shared/models/product';
import { GroupsService } from 'src/app/services/groups.service';
import { DataService } from 'src/app/services/data.service';
import { SortService } from './sort.service';
import { Group } from 'src/app/shared/models/group';
import { User } from 'src/app/shared/models/user';
import { UsersService } from 'src/app/services/users.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  addItemElemVisible: boolean = false;
  productList: Observable<Group['shoppingList']> = null;
  private ngUnsubscribe$ = new Subject<void>();

  constructor(
    private dataService: DataService,
    private groupsService: GroupsService,
    private sortService: SortService,
    private usersService: UsersService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.spinner.show();

    this.usersService.getLoggedUser().pipe(
      switchMap((user: User) => {
        return this.groupsService.getGroupByFamilyCode(user.familyCode);
      }),
      switchMap((group: Group) => {
        return this.usersService.getUsersByFamilyCode(group.familyCode);
      }),
      tap(() => {
        this.productList = this.dataService.groupData$.pipe(map(group => group?.shoppingList));
      }),
      takeUntil(this.ngUnsubscribe$)
    ).subscribe(() => this.spinner.hide());

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
        done: false,
      } as Product;
      this.scrollToBottom();
      const group = this.dataService.getGroup();
      group.shoppingList.push(newProduct);
      this.groupsService.updateGroupData(group).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
    }
    this.addItemElemVisible = false;
  }

  doneItem(selectedProduct: Product, check: boolean): void {
    const group = this.dataService.getGroup();
    const idx = group.shoppingList.findIndex((product) => product._id === selectedProduct._id);
    if (idx > -1) {
      selectedProduct.done = check;
      group.shoppingList.splice(idx, 1, selectedProduct);
      this.groupsService.updateGroupData(group).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
    }
  }

  deleteItem(selectedProduct: Product): void {
    const group = this.dataService.getGroup();
    const updatedShoppingList = group.shoppingList.filter((product) => product._id !== selectedProduct._id);
    group.shoppingList = updatedShoppingList;
    this.groupsService.updateGroupData(group).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }

  sortList(sortIcon): void {
    const group = this.dataService.getGroup();
    const productList = group.shoppingList;
    if (sortIcon.id === 'sort-az') {
      group.shoppingList = this.sortService.sortListAz(productList);
    } else {
      group.shoppingList = this.sortService.sortListByDone(productList);
    }
    this.dataService.setGroup(group);
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
