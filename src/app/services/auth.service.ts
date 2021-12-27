import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { asapScheduler, BehaviorSubject, from, of, scheduled } from 'rxjs';
import { catchError, map, mapTo, tap } from 'rxjs/operators';
import { User, AuthResponseData } from '../interfaces/user';
import { SAVE_USER, LOGIN_USER } from '../graphql/user';
import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';
import {
  AlertController,
  IonicSafeString,
  LoadingController,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userData = new BehaviorSubject<AuthResponseData>(null);
  private activeLogoutTimer: any;

  get userAuthenticated() {
    return this.userData.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user.accessToken;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this.userData.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.userId;
        } else {
          return null;
        }
      })
    );
  }

  get firstName() {
    return this.userData.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.firstName;
        } else {
          return null;
        }
      })
    );
  }

  get email() {
    return this.userData.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.email;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this.userData.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.accessToken;
        } else {
          return null;
        }
      })
    );
  }

  constructor(
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private apollo: Apollo,
    private router: Router
  ) {}

  autoLogin() {
    return from(
      Storage.get({
        key: 'authDataMalamino',
      })
    ).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          accessToken: string;
          email: string;
          firstName: string;
          userId: string;
          privilege: string;
          expirationTime: number;
        };
        const currentTime = new Date().getTime();
        const expirationTime = parsedData.expirationTime;
        if (expirationTime <= currentTime) {
          return null;
        }
        const userData = {
          accessToken: parsedData.accessToken,
          email: parsedData.email,
          firstName: parsedData.firstName,
          userId: parsedData.userId,
          privilege: parsedData.privilege,
          expirationTime: parsedData.expirationTime,
        };
        return userData;
      }),
      tap((user) => {
        if (user) {
          this.userData.next(user);
          this.autoLogout(user.expirationTime);
        }
      }),
      map((user) => !!user)
    );
  }

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
          console.log(error);
          this.presentAlert('<p style=color:white;>' + error + '</p>', 'Error');
          return of(false);
        })
      );
  }

  login(userData: User) {
    console.log('login hit');
    return this.apollo
      .mutate({
        mutation: LOGIN_USER,
        variables: {
          email: userData.email,
          password: userData.password,
        },
      })
      .pipe(
        tap((data) => {
          console.log('data hit', data);
          this.setUserData(data.data);
        }),
        mapTo(true),
        catchError((error) => {
          this.presentAlert('<p style=color:white;>' + error + '</p>', 'Error');
          return of(false);
        })
      );
  }

  logout() {
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.userData.next(null);
    const removeName = async () => {
      await Storage.remove({ key: 'authDataMalamino' });
      this.router.navigateByUrl('/auth');
    };
    removeName();
  }

  private setUserData(data: any) {
    const expirationTime = new Date().getTime() + 60 * 60 * 0.5 * 1000;
    const user = {
      accessToken: data.authenticateUser.accessToken,
      email: data.authenticateUser.email,
      firstName: data.authenticateUser.firstName,
      userId: data.authenticateUser.userId,
      privilege: data.authenticateUser.privilege,
      expirationTime,
    };
    console.log('user ', user);
    console.log('expirationTime ', expirationTime);
    this.userData.next(user);
    this.autoLogout(expirationTime);
    const setName = async () => {
      await Storage.set({
        key: 'authDataMalamino',
        value: JSON.stringify(user),
      });
    };
    setName();
  }

  private autoLogout(duration: number) {
    const currentTime = new Date().getTime();
    const timeDuration = duration - currentTime;
    if (this.activeLogoutTimer) {
      clearTimeout(this.activeLogoutTimer);
    }
    this.activeLogoutTimer = setTimeout(() => {
      this.logout();
    }, timeDuration);
  }

  private async presentAlert(alertMessage: string, head: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: head,
      message: new IonicSafeString(alertMessage),
      translucent: true,
      buttons: ['OK'],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }
}
