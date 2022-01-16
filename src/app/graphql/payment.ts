import { gql } from 'apollo-angular';

export const SAVE_PAYMENT = gql`
  mutation makePayment(
    $amount: Int!
    $purpose: String
    $transactionReference: String!
    $paymentFrom: String!
    $paymentTo: String!
  ) {
    makePayment(
      payment: {
        amount: $amount
        purpose: $purpose
        transactionReference: $transactionReference
        paymentFrom: $paymentFrom
        paymentTo: $paymentTo
      }
    ) {
      id
      amount
      purpose
      transactionReference
      paymentFrom
      paymentTo
      isCompleteTransaction
      createdAt
    }
  }
`;

export const PAYMENT_ELIGIBILITY = gql`
  mutation checkPaymentEligibility(
    $amount: Int!
    $purpose: String
    $transactionReference: String!
    $paymentFrom: String!
    $paymentTo: String!
  ) {
    checkPaymentEligibility(
      payment: {
        amount: $amount
        purpose: $purpose
        transactionReference: $transactionReference
        paymentFrom: $paymentFrom
        paymentTo: $paymentTo
      }
    )
  }
`;

export const COMPLETE_PAYMENT = gql`
  mutation completePayment($id: ID!, $transactionReference: String!) {
    completePayment(id: $id, transactionReference: $transactionReference) {
      id
      amount
      isCompleteTransaction
      createdAt
    }
  }
`;

export const GET_MY_PAYMENTS = gql`
  query getMyPayments($offset: Int, $limit: Int) {
    getMyPayments(mypaymentsQuery: { offset: $offset, limit: $limit }) {
      totalItems
      payment {
        id
        amount
        purpose
        transactionReference
        paymentFrom
        paymentTo
        isCompleteTransaction
        createdAt
      }
    }
  }
`;
