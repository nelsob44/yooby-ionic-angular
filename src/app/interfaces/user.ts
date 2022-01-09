export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  profilePic?: string;
  phoneNumber: string;
  country: string;
  city: string;
  address: string;
  isVerified?: string;
  privilegeLevel?: string;
}

export interface AuthResponseData {
  accessToken: string;
  email: string;
  firstName: string;
  userId: string;
  expirationTime: number;
  privilege: string;
  isVerified: boolean;
}
