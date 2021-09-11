import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, take } from 'rxjs/operators';
import Product from '../interfaces/product';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StarWarsService {
  url = environment.baseUrl;
  private productsRetrieved = new BehaviorSubject<Product[]>([]);

  get productsArray() {
    return this.productsRetrieved.asObservable();
  }
  constructor(private http: HttpClient) {}

  fetchProducts() {
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
  }
  getProduct(id: number) {
    return this.productsArray.pipe(
      take(1),
      map((products) => ({ ...products.find((p) => p.id === id) }))
    );
  }
}
