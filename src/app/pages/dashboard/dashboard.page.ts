import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import {
  AlertController,
  IonicSafeString,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ImagePath } from 'src/app/interfaces/product';
import { AuthService } from 'src/app/services/auth.service';

import { OrdersService } from 'src/app/services/orders.service';
import { PaymentService } from 'src/app/services/payment.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, AfterViewInit, OnDestroy {
  regularCommissionValue = 0;
  premiumCommissionValue = 0;
  lastUpdatedBy;
  updatedAt;
  searchInput;
  userSearchInput;
  orderItem;
  userInfo;
  showSearchButton = false;
  showUserSearchButton = false;
  showOrderDetails = false;
  showUserDetails = false;

  bulkPayoutMessage =
    '<p style=color:white;>Are you sure you wish to continue the bulk payout?</p>';
  otherMessage =
    '<p style=color:white;>Are you sure you wish to make this operation?</p>';

  private commisionsSub: Subscription;
  private orderSub: Subscription;
  constructor(
    private authService: AuthService,
    private paymentService: PaymentService,
    private orderService: OrdersService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  ngAfterViewInit() {
    this.retrieveData();
  }

  ngOnInit() {}

  searchOrder() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Retrieving order...' })
      .then((loadingEl) => {
        loadingEl.present();

        this.orderSub = this.orderService
          .fetchOrder(this.searchInput)
          .valueChanges.subscribe(
            (data) => {
              console.log(data.data);
              if (data.data) {
                this.orderItem = data.data.getOrder;
                this.showOrderDetails = true;
              }
              loadingEl.dismiss();
            },
            (error) => {
              if (error) {
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

  searchUser() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Retrieving user profile....' })
      .then((loadingEl) => {
        loadingEl.present();

        this.authService.fetchUser(this.userSearchInput).valueChanges.subscribe(
          (data) => {
            if (data.data.getUser) {
              this.userInfo = data.data.getUser;
              this.showUserDetails = true;
            }
            loadingEl.dismiss();
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

  isSearching() {
    this.showSearchButton = this.searchInput !== '' ? true : false;
    if (!this.showSearchButton) {
      this.showOrderDetails = false;
    }
  }

  isSearchingUser() {
    this.showUserSearchButton = this.userSearchInput !== '' ? true : false;
    if (!this.showUserSearchButton) {
      this.showUserDetails = false;
    }
  }

  updateRegularCommission() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'please wait...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.orderService
          .updateRegularCommission(this.regularCommissionValue)
          .subscribe(
            (resData) => {
              if (resData.data.updateRegularCommission) {
                loadingEl.dismiss();
                this.presentAlert(
                  '<p style=color:white;>' +
                    resData.data.updateRegularCommission +
                    ' </p>',
                  'Success!'
                );
              }
            },
            (errorResponse) => {
              console.log('An error occurred');
              loadingEl.dismiss();
              this.presentAlert(
                '<p style=color:white;> An error occured updating regular commission' +
                  errorResponse +
                  '</p>',
                'Error'
              );
            }
          );
      });
  }

  updatePremiumCommission() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'please wait...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.orderService
          .updatePremiumCommission(this.premiumCommissionValue)
          .subscribe(
            (resData) => {
              if (resData.data.updatePremiumCommission) {
                loadingEl.dismiss();
                this.presentAlert(
                  '<p style=color:white;>' +
                    resData.data.updatePremiumCommission +
                    '</p>',
                  'Success!'
                );
              }
            },
            (errorResponse) => {
              console.log('An error occurred');
              loadingEl.dismiss();
              this.presentAlert(
                '<p style=color:white;> An error occured updating premiun commission' +
                  errorResponse +
                  '</p>',
                'Error'
              );
            }
          );
      });
  }

  initiateBulkPayout() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'please wait...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.paymentService.withdrawToBankBulk('Admin action').subscribe(
          (resData) => {
            if (resData) {
              this.presentAlert(
                '<p style=color:white;>Withdrawal requests were successfully submitted</p>',
                'Success'
              );
              console.log(resData);
            }
            loadingEl.dismiss();
          },
          (errorResponse) => {
            console.log('An error occurred');
            loadingEl.dismiss();
            this.presentAlert(
              '<p style=color:white;>' + errorResponse + '</p>',
              'Error'
            );
          }
        );
      });
  }

  ngOnDestroy() {
    if (this.commisionsSub) {
      this.commisionsSub.unsubscribe();
    }
    if (this.orderSub) {
      this.orderSub.unsubscribe();
    }
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

  async presentAlertConfirm(type: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message:
        type === 'bulkPayout'
          ? new IonicSafeString(this.bulkPayoutMessage)
          : new IonicSafeString(this.otherMessage),
      translucent: true,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-secondary',
          handler: () => false,
        },
        {
          text: type === 'bulkPayout' ? 'Continue' : 'Other',
          handler: async () => {
            if (type === 'bulkPayout') {
              await this.initiateBulkPayout();
            } else {
              return false;
            }
          },
        },
      ],
    });

    await alert.present();
  }

  private retrieveData() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Retrieving data....' })
      .then((loadingEl) => {
        loadingEl.present();

        this.commisionsSub = this.orderService
          .fetchCommissions()
          .valueChanges.subscribe(
            (data) => {
              if (data.data.getCommissions) {
                this.regularCommissionValue =
                  data.data.getCommissions.regularRate;
                this.premiumCommissionValue =
                  data.data.getCommissions.premiumRate;
                this.lastUpdatedBy = data.data.getCommissions.lastUpdatedBy;
                this.updatedAt = data.data.getCommissions.updatedAt;
              }
              loadingEl.dismiss();
            },
            (error) => {
              if (error) {
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
}
