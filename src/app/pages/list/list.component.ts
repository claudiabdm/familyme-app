import { Component, OnInit, ElementRef, TemplateRef, ViewChild } from '@angular/core';
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
export class ListComponent implements OnInit {

  productList : Product[];
  addItemElemVisible: boolean = false;

  constructor(
    private authService: AuthService,
    private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    this.productList = this.shoppingListService.getProductList();
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
      };
      this.productList.push(newProduct);
      this.scrollToBottom(document.getElementById('shoppingList'));
      this.shoppingListService.updateProductList(this.productList);
    }
    this.addItemElemVisible = false;
  }

  deleteItem(product: Product): void {
    this.productList = this.productList.filter((data) => data.id !== product.id);
    this.shoppingListService.updateProductList(this.productList);
  }

  scrollToBottom(container){
    container.scrollTop = container.scrollHeight;
  }

}
