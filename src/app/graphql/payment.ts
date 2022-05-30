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
      transactionReference
      paymentFrom
      paymentTo
      isCompleteTransaction
      createdAt
    }
  }
`;

export const TOP_UP_CREDIT = gql`
  mutation createTransaction(
    $amount: Int!
    $transactionType: String
    $transactionReference: String!
    $paymentFrom: String!
    $paymentTo: String!
  ) {
    createTransaction(
      payment: {
        amount: $amount
        transactionType: $transactionType
        transactionReference: $transactionReference
        paymentFrom: $paymentFrom
        paymentTo: $paymentTo
      }
    ) {
      id
      amount
      transactionType
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

export const COMPLETE_TRANSACTION = gql`
  mutation completeTransaction($id: ID!, $transactionReference: String!) {
    completeTransaction(id: $id, transactionReference: $transactionReference) {
      id
      amount
      isCompleteTransaction
      createdAt
    }
  }
`;

export const WITHDRAW_TO_BANK_SINGLE = gql`
  mutation withdrawToBankSingle($amount: Int!) {
    withdrawToBankSingle(amount: $amount)
  }
`;

export const WITHDRAW_TO_BANK_BULK = gql`
  mutation withdrawToBankBulk($message: String) {
    withdrawToBankSingle(message: $message)
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

export const GET_ACCOUNT_BALANCE = gql`
  query getAccountBalance($email: String) {
    getAccountBalance(email: $email) {
      userName
      accountType
      currentBalance
      lastCreditFrom
      lastPaymentTo
      lastTransactionAmount
      updatedAt
    }
  }
`;

export const TRANSFER_CREDIT = gql`
  mutation transferCredit($transferValue: Int!, $recipientEmail: String!) {
    transferCredit(
      transfer: {
        transferValue: $transferValue
        recipientEmail: $recipientEmail
      }
    ) {
      userName
      accountType
      currentBalance
      lastCreditFrom
      lastPaymentTo
      lastTransactionAmount
      updatedAt
    }
  }
`;
