import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import { Product } from '../interfaces/product';
import BasketItem from 'src/app/interfaces/basketItem';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  url = environment.baseUrl;
  private productsRetrieved = new BehaviorSubject<Product[]>([]);
  private shoppingBasket = new BehaviorSubject<BasketItem[]>([]);
  private basketItems = new BehaviorSubject<number>(0);

  get productsArray() {
    return this.productsRetrieved.asObservable();
  }
  get shoppingBasketArray() {
    return this.shoppingBasket.asObservable();
  }
  get numberOfItemsInBasket() {
    return this.basketItems.asObservable();
  }
  constructor(private http: HttpClient) {}

  fetchProducts() {
    try {
      return this.http.get<Product[]>(this.url).pipe(
        map((data) => {
          const products = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              products.push(data[key]);
            }
          }
          this.productsRetrieved.next(products);
          return products;
        })
      );
    } catch (error) {
      return error;
    }
  }
  getProduct(id: number) {
    return this.productsArray.pipe(
      take(1),
      map((products) => ({ ...products.find((p) => p.id === id) }))
    );
  }
  getShoppingBasket() {
    return this.shoppingBasketArray.pipe(
      take(1),
      map((items) => {
        const basket = [];
        for (const key in items) {
          if (items.hasOwnProperty(key)) {
            basket.push(items[key]);
          }
        }
        return basket;
      })
    );
  }
  getNumberInBasket() {
    const basket = localStorage.getItem('naijaMartBasket');
    if (basket) {
      const arrayItems = JSON.parse(basket);
      this.shoppingBasket.next(arrayItems);
    }
  }

  updateShoppingBasket(basket) {
    this.shoppingBasket.next(basket);
  }
}
