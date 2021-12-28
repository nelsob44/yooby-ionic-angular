import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { map, take, catchError, mapTo, tap, switchMap } from 'rxjs/operators';
import { Product } from '../interfaces/product';
import {
  SAVE_PRODUCT,
  GET_MY_PRODUCTS,
  GET_AVAILABLE_PRODUCTS,
  DELETE_MY_PRODUCT,
} from '../graphql/product';
import BasketItem from 'src/app/interfaces/basketItem';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  url = environment.baseUrl;
  myProducts = new BehaviorSubject<Product[]>([]);
  productsRetrieved = new BehaviorSubject<Product[]>([]);
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
  constructor(
    private authService: AuthService,
    private apollo: Apollo,
    private http: HttpClient
  ) {}

  getProduct(id: string | number) {
    return this.productsArray.pipe(
      take(1),
      map((products) => ({ ...products.find((p) => p.id === id) }))
    );
  }

  getMyProduct(id: string) {
    return this.myProducts.pipe(
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

  addProduct(productData: any, filesToUpload: [File]) {
    return this.uploadImage(filesToUpload).pipe(
      take(1),
      switchMap((paths) => {
        const imageArray = [];
        paths.imagePath.map((img) => {
          let newImg = '';
          newImg = img.key + ',' + img.url;
          imageArray.push(newImg);
        });
        return this.apollo
          .mutate({
            mutation: SAVE_PRODUCT,
            variables: {
              category: productData.category,
              description: productData.description,
              price: productData.price,
              title: productData.title,
              minOrder: productData.minOrder,
              sellerLocation: productData.sellerLocation,
              furtherDetails: productData.furtherDetails,
              availableQuantity: productData.availableQuantity,
              discount: productData.discount,
              promoStartDate: productData.promoStartDate,
              promoEndDate: productData.promoEndDate,
              images: imageArray,
            },
            refetchQueries: [
              {
                query: GET_MY_PRODUCTS,
              },
            ],
          })
          .pipe(
            tap((data) => {
              console.log(data);
              return data;
            })
          );
      })
    );
  }

  uploadImage(filesToUpload: [File]) {
    const URL = environment.httpEndPoint + '/images';
    const uploadData = new FormData();
    const filesLength = filesToUpload.length;
    for (let i = 0; i < filesLength; i++) {
      uploadData.append('files[]', filesToUpload[i]);
    }
    //uploadData.append('files', filesToUpload[0]);

    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        console.log(token);
        return this.http
          .post<any>(URL, uploadData, {
            headers: { authorization: 'Bearer ' + token },
          })
          .pipe(
            map((data) => {
              console.log(data);
              return data;
            })
          );
      })
    );
  }

  fetchMyProducts() {
    return this.apollo.watchQuery<any>({
      query: GET_MY_PRODUCTS,
    });
  }

  fetchProducts() {
    return this.apollo.watchQuery<any>({
      query: GET_AVAILABLE_PRODUCTS,
    });
  }

  deleteProduct(id) {
    return this.apollo.mutate<any>({
      mutation: DELETE_MY_PRODUCT,
      variables: {
        id,
      },
      refetchQueries: [
        {
          query: GET_MY_PRODUCTS,
        },
        {
          query: GET_AVAILABLE_PRODUCTS,
        },
      ],
    });
  }
}
