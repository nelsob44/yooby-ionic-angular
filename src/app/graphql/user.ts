import { gql } from 'apollo-angular';

export const SAVE_USER = gql`
  mutation createUser(
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $phoneNumber: String
    $country: String
    $city: String
    $address: String
    $bankName: String
    $bankAccountNumber: Int
    $bankSortCode: Int
  ) {
    createUser(
      user: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
        phoneNumber: $phoneNumber
        country: $country
        city: $city
        address: $address
        bankName: $bankName
        bankAccountNumber: $bankAccountNumber
        bankSortCode: $bankSortCode
      }
    ) {
      id
      email
      firstName
    }
  }
`;

export const UPDATE_USER = gql`
  mutation updateUser(
    $id: ID!
    $firstName: String
    $lastName: String
    $password: String
    $phoneNumber: String
    $country: String
    $city: String
    $address: String
    $profilePic: [String]
  ) {
    updateUser(
      id: $id
      user: {
        firstName: $firstName
        lastName: $lastName
        profilePic: $profilePic
        password: $password
        phoneNumber: $phoneNumber
        country: $country
        city: $city
        address: $address
      }
    ) {
      id
      email
      firstName
    }
  }
`;

export const LOGIN_USER = gql`
  mutation authenticateUser($email: String!, $password: String!) {
    authenticateUser(user: { email: $email, password: $password }) {
      accessToken
      email
      firstName
      userId
      privilege
      isVerified
    }
  }
`;

export const SEND_RESET_LINK = gql`
  mutation sendResetLink($email: String!) {
    sendResetLink(email: $email)
  }
`;

export const VERIFY_USER = gql`
  mutation verifyUser($userId: ID!) {
    verifyUser(userId: $userId)
  }
`;

export const RE_VERIFY = gql`
  mutation resendVerification($userId: ID!) {
    resendVerification(userId: $userId)
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation changePassword(
    $email: String!
    $password: String!
    $resetPasswordToken: String!
  ) {
    changePassword(
      user: {
        email: $email
        password: $password
        resetPasswordToken: $resetPasswordToken
      }
    )
  }
`;

export const GET_USER = gql`
  query getUser($userId: String!) {
    getUser(userId: $userId) {
      id
      email
      firstName
      lastName
      phoneNumber
      country
      city
      address
      isVerified
      privilegeLevel
      profilePic
    }
  }
`;

export const GET_TRANSFER_RECIPIENTS = gql`
  query getRecipients($recipientEmail: String!) {
    getRecipients(recipientEmail: $recipientEmail) {
      id
      userName
      userEmail
    }
  }
`;
