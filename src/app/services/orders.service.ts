import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import {
  GET_MY_ORDERS,
  RELEASE_FUNDS,
  SEND_BUYER_NOTIFICATION,
  UPDATE_REGULAR_COMMISSION,
  UPDATE_PREMIUM_COMMISSION,
  GET_COMMISSIONS,
  GET_ORDER,
} from '../graphql/order';
import { Order } from '../interfaces/order';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  myOrders = new BehaviorSubject<Order[]>([]);

  get myOrdersArray() {
    return this.myOrders.asObservable();
  }

  constructor(private apollo: Apollo) {}

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

  fetchOrder(orderId: string) {
    return this.apollo.watchQuery<any>({
      query: GET_ORDER,
      variables: {
        orderId,
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

  sendBuyerNotification(notificationData: any) {
    return this.apollo
      .mutate<any>({
        mutation: SEND_BUYER_NOTIFICATION,
        variables: {
          orderId: notificationData.orderId,
          transactionReference: notificationData.transactionReference,
          buyerName: notificationData.buyerName,
          buyerEmail: notificationData.buyerEmail,
          itemName: notificationData.itemName,
          itemQuantity: notificationData.itemQuantity,
          sellerName: notificationData.sellerName,
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
  updateRegularCommission(percentage: any) {
    return this.apollo
      .mutate<any>({
        mutation: UPDATE_REGULAR_COMMISSION,
        variables: {
          percentage,
        },
        refetchQueries: [
          {
            query: GET_COMMISSIONS,
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

  updatePremiumCommission(percentage: any) {
    return this.apollo
      .mutate<any>({
        mutation: UPDATE_PREMIUM_COMMISSION,
        variables: {
          percentage,
        },
        refetchQueries: [
          {
            query: GET_COMMISSIONS,
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

  fetchCommissions(status?: string) {
    return this.apollo.watchQuery<any>({
      query: GET_COMMISSIONS,
      variables: {
        status,
      },
      fetchPolicy: 'network-only',
    });
  }
}
