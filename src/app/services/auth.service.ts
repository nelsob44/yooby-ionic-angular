import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { asapScheduler, BehaviorSubject, from, of, scheduled } from 'rxjs';
import { catchError, map, mapTo, switchMap, take, tap } from 'rxjs/operators';
import { User, AuthResponseData } from '../interfaces/user';
import { environment } from 'src/environments/environment';
import {
  SAVE_USER,
  LOGIN_USER,
  SEND_RESET_LINK,
  CHANGE_PASSWORD,
  VERIFY_USER,
  GET_USER,
  UPDATE_USER,
  RE_VERIFY,
  GET_TRANSFER_RECIPIENTS,
} from '../graphql/user';
import { Storage } from '@capacitor/storage';
import { Router } from '@angular/router';
import {
  AlertController,
  IonicSafeString,
  LoadingController,
} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userProfile = new BehaviorSubject<User>(null);
  private userData = new BehaviorSubject<AuthResponseData>(null);
  private activeLogoutTimer: any;

  get myUserProfile() {
    return this.userProfile.asObservable();
  }

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

  get privilege() {
    return this.userData.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.privilege;
        } else {
          return null;
        }
      })
    );
  }

  get isVerified() {
    return this.userData.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.isVerified;
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
    private http: HttpClient,
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
          isVerified: boolean;
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
          isVerified: parsedData.isVerified,
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
          bankName: userData.bankName,
          bankAccountNumber: userData.bankAccountNumber,
          bankSortCode: userData.bankSortCode,
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

  // updateUser(userData: User) {
  //   return this.apollo
  //     .mutate({
  //       mutation: UPDATE_USER,
  //       variables: {
  //         id: userData.id,
  //         firstName: userData.firstName,
  //         lastName: userData.lastName,
  //         email: userData.email,
  //         password: userData.password,
  //         phoneNumber: userData.phoneNumber,
  //         country: userData.country,
  //         city: userData.city,
  //         address: userData.address,
  //       },
  //       fetchPolicy: 'network-only',
  //       refetchQueries: [
  //         {
  //           query: GET_USER,
  //         },
  //       ],
  //     })
  //     .pipe(
  //       tap((data) => console.log(data)),
  //       mapTo(true),
  //       catchError((error) => {
  //         console.log(error);
  //         this.presentAlert('<p style=color:white;>' + error + '</p>', 'Error');
  //         return of(false);
  //       })
  //     );
  // }

  updateUser(userData: any, filesToUpload: [File]) {
    return this.uploadImage(filesToUpload).pipe(
      take(1),
      switchMap((paths) => {
        const imageArray = [];
        paths.imagePath.map((img) => {
          let newImg = '';
          newImg = img.key + ',' + img.url;
          imageArray.push(newImg);
        });
        return this.apollo
          .mutate({
            mutation: UPDATE_USER,
            variables: {
              id: userData.id,
              firstName: userData.firstName,
              lastName: userData.lastName,
              password: userData.password,
              phoneNumber: userData.phoneNumber,
              country: userData.country,
              city: userData.city,
              address: userData.address,
              profilePic: imageArray,
            },
            fetchPolicy: 'network-only',
            refetchQueries: [
              {
                query: GET_USER,
              },
            ],
          })
          .pipe(
            tap((data) => {
              console.log('');
              return data;
            })
          );
      })
    );
  }

  uploadImage(filesToUpload: [File]) {
    const URL = environment.httpEndPoint + '/images';
    const uploadData = new FormData();
    const filesLength = filesToUpload.length;
    for (let i = 0; i < filesLength; i++) {
      uploadData.append('files[]', filesToUpload[i]);
    }
    //uploadData.append('files', filesToUpload[0]);

    return this.token.pipe(
      take(1),
      switchMap((token) => {
        console.log('');
        return this.http
          .post<any>(URL, uploadData, {
            headers: { authorization: 'Bearer ' + token },
          })
          .pipe(
            map((data) => {
              console.log('');
              return data;
            })
          );
      })
    );
  }

  sendPasswordResetLink(email: string) {
    console.log({ email });
    return this.apollo
      .mutate<any>({
        mutation: SEND_RESET_LINK,
        variables: {
          email,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(
        tap((data) => {
          console.log('');
          return data;
        })
      );
  }

  verifyUser(userId: string) {
    console.log('login hit');
    return this.apollo
      .mutate<any>({
        mutation: VERIFY_USER,
        variables: {
          userId,
        },
      })
      .pipe(
        tap((data) => {
          console.log('data hit', data);
          this.presentAlert(
            '<p style=color:white;>' + data.data.verifyUser + '</p>',
            'Verified!'
          );
        }),
        mapTo(true),
        catchError((error) => {
          this.presentAlert('<p style=color:white;>' + error + '</p>', 'Error');
          return of(false);
        })
      );
  }

  resendVerification(userId: string) {
    console.log('login hit');
    return this.apollo
      .mutate<any>({
        mutation: RE_VERIFY,
        variables: {
          userId,
        },
      })
      .pipe(
        tap((data) => {
          console.log('data hit', data);
          this.presentAlert(
            '<p style=color:white;>' + data.data.resendVerification + '</p>',
            'Success!'
          );
        }),
        mapTo(true),
        catchError((error) => {
          this.presentAlert('<p style=color:white;>' + error + '</p>', 'Error');
          return of(false);
        })
      );
  }

  changePassword(email: string, password: string, resetPasswordToken: string) {
    console.log({ email });
    return this.apollo
      .mutate<any>({
        mutation: CHANGE_PASSWORD,
        variables: {
          email,
          password,
          resetPasswordToken,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(
        tap((data) => {
          console.log(data);
          this.presentAlert(
            '<p style=color:white;>' + data.data.changePassword + '</p>',
            'Verified!'
          );
        }),
        mapTo(true),
        catchError((error) => {
          console.log(error);
          this.presentAlert('<p style=color:white;>' + error + '</p>', 'Error');
          return of(false);
        })
      );
  }

  fetchUser(userId: string) {
    return this.apollo.watchQuery<any>({
      query: GET_USER,
      variables: {
        userId,
      },
      fetchPolicy: 'network-only',
    });
  }

  fetchRecipients(recipientEmail: string) {
    return this.apollo.watchQuery<any>({
      query: GET_TRANSFER_RECIPIENTS,
      variables: {
        recipientEmail,
      },
      fetchPolicy: 'network-only',
    });
  }

  private setUserData(data: any) {
    const expirationTime = new Date().getTime() + 60 * 60 * 0.5 * 1000;
    const user = {
      accessToken: data.authenticateUser.accessToken,
      email: data.authenticateUser.email,
      firstName: data.authenticateUser.firstName,
      userId: data.authenticateUser.userId,
      privilege: data.authenticateUser.privilege,
      isVerified: data.authenticateUser.isVerified,
      expirationTime,
    };
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
