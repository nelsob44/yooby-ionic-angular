export interface User {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  country: string;
  city: string;
  address: string;
}

export interface AuthResponseData {
  accessToken: string;
  email: string;
  firstName: string;
  userId: string;
  expirationTime: number;
  privilege?: string;
}
