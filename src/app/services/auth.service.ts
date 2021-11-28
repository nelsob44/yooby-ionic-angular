import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { of } from 'rxjs';
import { catchError, mapTo, tap } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { SAVE_USER, LOGIN_USER } from '../graphql/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apollo: Apollo) {}

  signup(userData: User) {
    return this.apollo
      .mutate({
        mutation: SAVE_USER,
        variables: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          phoneNumber: userData.phoneNumber,
          country: userData.country,
          city: userData.city,
          address: userData.address,
        },
      })
      .pipe(
        tap((data) => console.log(data)),
        mapTo(true),
        catchError((error) => {
          alert(error.error);
          return of(false);
        })
      );
  }

  login(userData: User) {
    return this.apollo
      .mutate({
        mutation: LOGIN_USER,
        variables: {
          email: userData.email,
          password: userData.password,
        },
      })
      .pipe(
        tap((data) => console.log(data)),
        mapTo(true),
        catchError((error) => {
          alert(error.error);
          return of(false);
        })
      );
  }
}
