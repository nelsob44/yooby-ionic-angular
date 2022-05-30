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
  userDeviceType?: string;
  userIpAddress?: string;
  isOnline?: boolean;
  extraUserData?: string;
  lastLoginTime?: string;
  bankCode?: string;
  bankAccountNumber?: number;
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

export interface Recipient {
  id: string;
  userName: string;
  userEmail: string;
}
