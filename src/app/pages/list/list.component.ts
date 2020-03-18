import { Component, OnInit, ElementRef, TemplateRef, ViewChild, SimpleChanges, OnChanges, Input } from '@angular/core';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { TemplateBinding } from '@angular/compiler';
import { Group } from 'src/app/models/group';
import { GroupsService } from 'src/app/services/groups.service';
import { DataService } from 'src/app/services/data.service';
import { SortService } from 'src/app/services/sort.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  private ngUnsubscribe$ = new Subject<void>();

  public addItemElemVisible: boolean = false;
  public productList: Product[];

  constructor(
    private dataService: DataService,
    private groupsService: GroupsService,
    private sortService: SortService) { }

  ngOnInit(): void {
    this.groupsService.searchGroupByToken(this.dataService.user.groupToken)
      .pipe(takeUntil(this.ngUnsubscribe$)).subscribe(group => { this.productList = group.shoppingList });
  }

  addItemElem(): void {
    this.addItemElemVisible = true;
    this.scrollToBottom(document.getElementById('container'));
  }

  addItem(product: string): void {
    if (product) {
      const ids = this.productList.map(a => a.id);
      const productId = this.productList.length > 0 ? Math.max(...ids) + 1 : 1;
      const newProduct: Product = {
        id: productId,
        createdAt: new Date(),
        name: product,
        addedBy: this.dataService.user.name,
        done: false,
        deleted: false,
      };
      this.productList.push(newProduct);
      this.dataService.userGroup.shoppingList = this.productList
      this.scrollToBottom(document.getElementById('container'));
      this.groupsService.updateGroup(this.dataService.userGroup).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
    }
    this.addItemElemVisible = false;
  }

  doneItem(product: Product, check: boolean): void {
    const idx = this.productList.findIndex((data) => data.id === product.id);
    if (idx > -1) {
      product.done = check;
      this.productList.splice(idx, 1, product);
      this.dataService.userGroup.shoppingList = this.productList
      this.groupsService.updateGroup(this.dataService.userGroup).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
    }
  }

  deleteItem(product: Product): void {
    const idx = this.productList.findIndex((data) => data.id === product.id);
    if (idx > -1) {
      product.deleted = true; // la api no me deja eliminar de la shopping list, put devuelve 200 OK pero no modifica nada
      this.dataService.userGroup.shoppingList.splice(idx, 1, product);
      this.groupsService.updateGroup(this.dataService.userGroup).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
    }
  }

  sortAtoZ(sortIcon): void {
    this.sortService.sortListAz(sortIcon, this.productList);
  }

  sortByDone(sortIcon): void {
    this.sortService.sortListByDone(sortIcon, this.productList);
  }

  private scrollToBottom(container): void {
    container.scrollTop = container.scrollHeight;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next()
    this.ngUnsubscribe$.complete();
  }
}
