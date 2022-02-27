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

export const GET_ORDER = gql`
  query getOrder($orderId: ID!) {
    getOrder(orderId: $orderId) {
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

export const SEND_BUYER_NOTIFICATION = gql`
  mutation sendBuyerNotification(
    $orderId: ID!
    $transactionReference: String!
    $buyerName: String!
    $buyerEmail: String!
    $itemName: String!
    $itemQuantity: Int!
    $sellerName: String!
  ) {
    sendBuyerNotification(
      notification: {
        orderId: $orderId
        transactionReference: $transactionReference
        buyerName: $buyerName
        buyerEmail: $buyerEmail
        itemName: $itemName
        itemQuantity: $itemQuantity
        sellerName: $sellerName
      }
    )
  }
`;

export const UPDATE_REGULAR_COMMISSION = gql`
  mutation updateRegularCommission($percentage: Int!) {
    updateRegularCommission(percentage: $percentage)
  }
`;

export const UPDATE_PREMIUM_COMMISSION = gql`
  mutation updatePremiumCommission($percentage: Int!) {
    updatePremiumCommission(percentage: $percentage)
  }
`;

export const GET_COMMISSIONS = gql`
  query getCommissions($status: String) {
    getCommissions(status: $status) {
      regularRate
      premiumRate
      lastUpdatedBy
      updatedAt
    }
  }
`;
