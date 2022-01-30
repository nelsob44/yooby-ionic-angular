import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Apollo } from 'apollo-angular';
import { map, take, catchError, mapTo, tap, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import {
  SAVE_PAYMENT,
  COMPLETE_PAYMENT,
  PAYMENT_ELIGIBILITY,
  TOP_UP_CREDIT,
  COMPLETE_TRANSACTION,
  GET_ACCOUNT_BALANCE,
  TRANSFER_CREDIT,
  GET_MY_PAYMENTS,
} from '../graphql/payment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  constructor(private authService: AuthService, private apollo: Apollo) {}

  initializePayment(paymentData: any) {
    return this.apollo
      .mutate<any>({
        mutation: SAVE_PAYMENT,
        variables: {
          amount: paymentData.amount,
          purpose: paymentData.purpose,
          transactionReference: paymentData.transactionReference,
          paymentFrom: paymentData.paymentFrom,
          paymentTo: paymentData.paymentTo,
        },
        // refetchQueries: [
        //   {
        //     query: GET_MY_PAYMENTS,
        //   },
        // ],
        fetchPolicy: 'network-only',
      })
      .pipe(
        tap((data) => {
          console.log('');
          return data;
        })
      );
  }

  initializeAccountCrediting(paymentData: any) {
    return this.apollo
      .mutate<any>({
        mutation: TOP_UP_CREDIT,
        variables: {
          amount: paymentData.amount,
          transactionType: paymentData.transactionType,
          transactionReference: paymentData.transactionReference,
          paymentFrom: paymentData.paymentFrom,
          paymentTo: paymentData.paymentTo,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(
        tap((data) => {
          console.log('');
          return data;
        })
      );
  }

  paymentEligibility(paymentData: any) {
    return this.apollo
      .mutate<any>({
        mutation: PAYMENT_ELIGIBILITY,
        variables: {
          amount: paymentData.amount,
          purpose: paymentData.purpose,
          transactionReference: paymentData.transactionReference,
          paymentFrom: paymentData.paymentFrom,
          paymentTo: paymentData.paymentTo,
        },
        // refetchQueries: [
        //   {
        //     query: GET_MY_PAYMENTS,
        //   },
        // ],
        fetchPolicy: 'network-only',
      })
      .pipe(
        tap((data) => {
          console.log('');
          return data;
        })
      );
  }

  completingPayment(paymentData: any) {
    return this.apollo
      .mutate<any>({
        mutation: COMPLETE_PAYMENT,
        variables: {
          id: paymentData.id,
          transactionReference: paymentData.transactionReference,
        },
        // refetchQueries: [
        //   {
        //     query: GET_MY_PAYMENTS,
        //   },
        // ],
        fetchPolicy: 'network-only',
      })
      .pipe(
        tap((data) => {
          console.log('');
          return data;
        })
      );
  }

  makeCreditTransfer(transferValue: number, recipientEmail: string) {
    return this.apollo
      .mutate<any>({
        mutation: TRANSFER_CREDIT,
        variables: {
          transferValue,
          recipientEmail,
        },
        refetchQueries: [
          {
            query: GET_ACCOUNT_BALANCE,
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

  completingCreditTransaction(paymentData: any) {
    return this.apollo
      .mutate<any>({
        mutation: COMPLETE_TRANSACTION,
        variables: {
          id: paymentData.id,
          transactionReference: paymentData.transactionReference,
        },
        refetchQueries: [
          {
            query: GET_ACCOUNT_BALANCE,
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

  fetchMyAccountBalance() {
    return this.apollo.watchQuery<any>({
      query: GET_ACCOUNT_BALANCE,
      fetchPolicy: 'network-only',
    });
  }
}
