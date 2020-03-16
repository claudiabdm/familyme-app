import { Component, OnInit, ElementRef, TemplateRef, ViewChild, SimpleChanges, OnChanges, Input } from '@angular/core';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from 'src/app/models/product';
import { TemplateBinding } from '@angular/compiler';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  private ngUnsubscribe$ = new Subject<void>();

  productList : Product[];
  addItemElemVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.shoppingListService.refreshProductList().pipe(takeUntil(this.ngUnsubscribe$)).subscribe( shoppingList => {
      this.productList = shoppingList;
      this.authService.userGroup.shoppingList = shoppingList;
      this.authService.updateLocalStorage('userGroup', this.authService.userGroup);
    }
    );
  }

  addItemElem(): void {
    this.addItemElemVisible = true;
    this.scrollToBottom(document.getElementById('shoppingList'));
  }

  addItem(product: string): void {
    if (product) {
      const productId = this.productList.length > 0 ? this.productList[this.productList.length - 1].id + 1 : 1;
      const newProduct: Product = {
        id: productId,
        createdAt: new Date(),
        name: product,
        addedBy: this.authService.user.name,
        done: false,
      };
      this.productList.push(newProduct);
      this.scrollToBottom(document.getElementById('shoppingList'));
      this.shoppingListService.updateProductList(this.productList).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
    }
    this.addItemElemVisible = false;
  }

  doneItem(product: Product, check: boolean): void {
    const idx = this.productList.findIndex((data) => data.id === product.id);
    product.done = check;
    this.productList.splice(idx, 1, product);
    this.shoppingListService.updateProductList(this.productList).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }

  deleteItem(product: Product): void {
    this.productList = this.productList.filter((data) => data.id !== product.id);
    this.shoppingListService.updateProductList(this.productList).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }

  scrollToBottom(container){
    container.scrollTop = container.scrollHeight;
  }


  ngOnDestroy(): void {
    this.ngUnsubscribe$.next()
    this.ngUnsubscribe$.complete();
  }
}
