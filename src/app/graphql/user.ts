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
    }
  }
`;

export const SEND_RESET_LINK = gql`
  mutation sendResetLink($email: String!) {
    sendResetLink(email: $email)
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
