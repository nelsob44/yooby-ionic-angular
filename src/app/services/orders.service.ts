import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GET_MY_ORDERS, RELEASE_FUNDS } from '../graphql/order';
import { Order } from '../interfaces/order';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  myOrders = new BehaviorSubject<Order[]>([]);

  get myOrdersArray() {
    return this.myOrders.asObservable();
  }

  constructor(private authService: AuthService, private apollo: Apollo) {}

  fetchMyOrders(offset: number = 1, limit: number = 3) {
    return this.apollo.watchQuery<any>({
      query: GET_MY_ORDERS,
      variables: {
        offset,
        limit,
      },
      fetchPolicy: 'network-only',
    });
  }

  releasingFunds(paymentData: any) {
    return this.apollo
      .mutate<any>({
        mutation: RELEASE_FUNDS,
        variables: {
          orderId: paymentData.id,
          transactionReference: paymentData.transactionReference,
        },
        refetchQueries: [
          {
            query: GET_MY_ORDERS,
          },
        ],
        fetchPolicy: 'network-only',
      })
      .pipe(
        tap((data) => {
          console.log('');
          return data;
        })
      );
  }
}
