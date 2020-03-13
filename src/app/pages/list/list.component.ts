import { Component, OnInit, OnDestroy } from '@angular/core';
import { ShoppingListService } from 'src/app/services/shopping-list.service';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit, OnDestroy {

  addItemVisible: boolean = false;

  private ngUnsubscribe$ = new Subject<void>();

  constructor(private shoppingList: ShoppingListService, private authService: AuthService) { }

  get productList() {
    return this.shoppingList.productList;
  }

  ngOnInit(): void {
    this.shoppingList.getProducts()
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(res => {
      this.shoppingList.productList = res;
      this.shoppingList.setLocalStorage();
    });
  }


  addItem(): void {
    this.addItemVisible = true;
  }

  saveItem(product: string): void {
    this.addItemVisible = false;
    const newProduct: Product = {
      id: this.shoppingList.productList.length+1,
      createdAt: new Date(),
      name: product,
      addedBy: this.authService.user
    };
    this.shoppingList.productList.push(newProduct);
    this.authService.setLocalStorage();
    this.shoppingList.createProduct(newProduct).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }

  deleteItem(product: Product): void {
    this.shoppingList.deleteProduct(product).pipe(takeUntil(this.ngUnsubscribe$)).subscribe();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next()
    this.ngUnsubscribe$.complete();
  }

}
