import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  IonicSafeString,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { switchMap, switchMapTo, take, tap } from 'rxjs/operators';
import { ImagePath } from 'src/app/interfaces/product';
import { User } from 'src/app/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.page.html',
  styleUrls: ['./user-profile.page.scss'],
})
export class UserProfilePage implements OnInit, OnDestroy {
  userInfo: User = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    country: '',
    city: '',
    address: '',
    privilegeLevel: '',
    isVerified: '',
  };
  userSub: Subscription;
  userId = null;
  editMessage =
    '<p style=color:white;>Are you sure you wish to edit your profile?</p>';

  imagePath: ImagePath = {
    url: '',
    key: '',
  };
  imagesArray = [];
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.authService.userId.subscribe((id) => {
      if (!id) {
        this.navCtrl.navigateBack('/available-products');
      }
      this.userId = id;
    });
  }
  ionViewWillEnter() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Retrieving your profile....' })
      .then((loadingEl) => {
        loadingEl.present();

        this.authService.fetchUser(this.userId).valueChanges.subscribe(
          (data) => {
            this.userInfo = data.data.getUser;
            this.authService.userProfile.next(this.userInfo);
            console.log(this.userInfo);
            loadingEl.dismiss();
            this.transformImagePath();
          },
          (error) => {
            if (error) {
              console.log(error);
              this.presentAlert(
                '<p style=color:white;>' + error + '</p>',
                'Error'
              );
            }
            loadingEl.dismiss();
          }
        );
      });
  }

  editUserProfile(userId: string) {
    this.router.navigate(['/edit-user-profile', userId]);
  }

  resendVerification(userId: string) {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Making user verification, please wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.authService.resendVerification(this.userId).subscribe(
          (resData) => {
            console.log(resData);
            // if (resData) {
            //   this.isVerified = true;
            // }

            // this.isLoading = false;
            loadingEl.dismiss();
          },
          (errorResponse) => {
            console.log(errorResponse);
            loadingEl.dismiss();
          }
        );
      });
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  async presentAlertConfirm(id: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: new IonicSafeString(this.editMessage),
      translucent: true,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-secondary',
          handler: () => false,
        },
        {
          text: 'Edit',
          handler: async () => {
            this.editUserProfile(id);
          },
        },
      ],
    });

    await alert.present();
  }

  async presentAlert(alertMessage: string, head: string) {
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
  private transformImagePath() {
    const imgs = this.userInfo.profilePic[0]?.split(',');
    this.imagePath = {
      url: imgs[1],
      key: imgs[0],
    };
  }
}
