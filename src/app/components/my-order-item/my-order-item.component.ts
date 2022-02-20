import { Component, Input, OnInit } from '@angular/core';
import {
  AlertController,
  IonicSafeString,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/interfaces/order';
import { AuthService } from 'src/app/services/auth.service';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-my-order-item',
  templateUrl: './my-order-item.component.html',
  styleUrls: ['./my-order-item.component.scss'],
})
export class MyOrderItemComponent implements OnInit {
  @Input() item: Order;
  userSub: Subscription;
  userEmail = null;
  isSeller = false;
  isBuyer = false;
  isAdmin = false;

  constructor(
    private authService: AuthService,
    private orderService: OrdersService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.authService.email.subscribe((email) => {
      if (!email) {
        this.navCtrl.navigateBack('/available-products');
      }
      this.userEmail = email;
      if (this.userEmail === this.item.buyerEmail) {
        this.isBuyer = true;
      }
      if (this.userEmail === this.item.sellerEmail) {
        this.isSeller = true;
      }
    });
    this.authService.privilege.subscribe((res) => {
      if (!res) {
        this.navCtrl.navigateBack('/available-products');
      }
      if (res === 'admin') {
        this.isAdmin = true;
      }
    });
  }

  releaseFunds() {
    const paymentData = {
      id: this.item.id,
      transactionReference: this.item.transactionReference,
    };
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'please wait...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.orderService.releasingFunds(paymentData).subscribe(
          (resData) => {
            if (resData.data.releaseFunds) {
              loadingEl.dismiss();
              this.presentAlert(
                '<p style=color:white;> Your funds is now on its way to the Seller</p>',
                'Success!'
              );
            }
          },
          (errorResponse) => {
            console.log('An error occurred');
            loadingEl.dismiss();
            this.presentAlert(
              '<p style=color:white;> An error occured, please contact Admin' +
                errorResponse +
                '</p>',
              'Error'
            );
          }
        );
      });
  }

  notifyBuyerDispatch() {
    console.log('I have dispatched');
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
}
