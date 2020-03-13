import { Injectable, Inject } from '@angular/core';
import { Product } from '../models/product';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { LOCAL_STORAGE, StorageService } from 'ngx-webstorage-service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {
  public productList: Product[];
  private url = `${environment.apiUrl}shopping-list`;
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    @Inject(LOCAL_STORAGE) private storage: StorageService,
    private http: HttpClient,
    private authService: AuthService) {
  }


  setLocalStorage(): void {
    if (!this.storage.get('productList')) {
      this.storage.set('productList', this.productList);
    } else {
      this.storage.remove('productList');
      this.storage.set('productList', this.productList);
    }
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.url);
  }

  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.url, product);
  }

  deleteProduct(product: Product): Observable<Product> {
    const productId = product.id;
    const url = `${this.url}/${productId}`;
    this.productList = this.productList.filter((data) => data.id !== product.id);
    this.setLocalStorage();
    return this.http.delete<Product>(url, this.httpOptions);
  }

}
