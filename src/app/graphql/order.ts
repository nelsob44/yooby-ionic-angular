import { gql } from 'apollo-angular';

export const GET_MY_ORDERS = gql`
  query getMyOrders($offset: Int, $limit: Int) {
    getMyOrders(myOrderQuery: { offset: $offset, limit: $limit }) {
      totalItems
      order {
        id
        itemName
        unitPrice
        itemQuantity
        amount
        finalAmount
        transactionReference
        buyerEmail
        sellerEmail
        buyerName
        sellerName
        sellerEmail
        isPaidFor
        isDispatched
        isCompleteTransaction
        shippingDetails
        createdAt
      }
    }
  }
`;

export const RELEASE_FUNDS = gql`
  mutation releaseFunds($orderId: ID!, $transactionReference: String!) {
    releaseFunds(
      orderId: $orderId
      transactionReference: $transactionReference
    ) {
      id
      amount
      recepientName
      recepientEmail
      bankName
      bankAccountNumber
      transactionReference
      createdAt
    }
  }
`;
