import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  AlertController,
  IonicSafeString,
  LoadingController,
  ModalController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Storage } from '@capacitor/storage';
import { PaystackOptions } from 'angular4-paystack';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ProductsService } from 'src/app/services/products.service';
import BasketItem from '../../interfaces/basketItem';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() basket: BasketItem[];
  sendBasketLength: number;
  totalCost: number;
  reference = '';
  title = 'Ready to pay';
  options: PaystackOptions = {
    amount: 0,
    email: 'user@email.com',
    ref: `${Math.ceil(Math.random() * 10e10)}`,
  };
  noItems = false;
  purpose = '';
  loggedInUser;
  paymentId;
  private userSub: Subscription;
  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    public modalController: ModalController,
    private service: ProductsService,
    private paymentService: PaymentService,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  // checkEligibility() {
  //   setTimeout(() => {
  //     this.paymentInit();
  //   }, 3000);
  // }

  paymentInit() {
    console.log('Payment initialized');
    this.onAddPayment();
  }

  paymentDone(ref: any) {
    this.title = 'Payment successfull';
    console.log(this.title, ref);
    this.onCompletePayment();
  }

  paymentCancel() {
    console.log('payment failed');
  }

  async checkEligibility() {
    const paymentData = {
      amount: this.options.amount,
      purpose: this.purpose,
      transactionReference: this.options.ref,
      paymentFrom: this.loggedInUser,
      paymentTo: 'platform User',
    };
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'please wait...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.paymentService.paymentEligibility(paymentData).subscribe(
          (resData) => {
            if (resData) {
              console.log(resData);
              if (resData.data.checkPaymentEligibility[0] === 'Success') {
                this.paymentInit();
              } else {
                const setErrors = async () => {
                  await Storage.set({
                    key: 'paymentCheckErrors',
                    value: JSON.stringify(resData.data.checkPaymentEligibility),
                  });
                };
                setErrors();
                this.presentToast(
                  '<p style=color:white;>' +
                    resData.data.checkPaymentEligibility[0] +
                    '</p>'
                );
                setTimeout(() => {
                  this.presentAlert(
                    '<p style=color:white;>' +
                      resData.data.checkPaymentEligibility[0] +
                      '</p>',
                    'Attention!'
                  );
                }, 3000);
                location.reload();
              }
            }
            loadingEl.dismiss();
            return;
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

  onAddPayment() {
    const paymentData = {
      amount: this.options.amount,
      purpose: this.purpose,
      transactionReference: this.options.ref,
      paymentFrom: this.loggedInUser,
      paymentTo: 'platform User',
    };
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'please wait...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.paymentService.initializePayment(paymentData).subscribe(
          (resData) => {
            if (resData) {
              this.presentAlert(
                '<p style=color:white;>Payment was successfully initialized</p>',
                'Success'
              );
              console.log(resData);
              this.paymentId = resData.data.makePayment.id;
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

  onCompletePayment() {
    const paymentData = {
      id: this.paymentId,
      transactionReference: this.options.ref,
    };
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'please wait...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.paymentService.completingPayment(paymentData).subscribe(
          (resData) => {
            if (resData.data.completePayment.isCompleteTransaction) {
              this.presentAlert(
                '<p style=color:white;>Payment was successfully completed</p>',
                'Success'
              );
              console.log(resData);
              localStorage.removeItem('naijaMartBasket');
              localStorage.removeItem('paymentCheckErrors');
            }
            loadingEl.dismiss();
            this.closeModal();
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

  ngOnInit() {
    console.log('basket is ', this.basket);
    this.calculateTotalCost();
    this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
    this.purpose = JSON.stringify(this.basket);
    this.authService.email.subscribe((eml) => {
      this.loggedInUser = eml;
    });
  }
  calculateTotalCost() {
    console.log('length is ', this.basket.length);
    if (this.basket && this.basket.length > 0) {
      this.totalCost = parseFloat(
        this.basket
          .reduce((ack: number, item) => ack + item.subTotal, 0)
          .toFixed(2)
      );
      this.options.amount = this.totalCost * 100;
    }
    if (this.basket && this.basket.length < 1) {
      this.totalCost = 0;
      this.noItems = !this.noItems;
    }
    this.purpose = JSON.stringify(this.basket);
  }
  closeModal() {
    this.modalController.dismiss({
      dismissed: true,
      sendBasketLength: this.sendBasketLength,
    });
  }
  onDeleteItem(id: number | string) {
    const currentBasket = localStorage.getItem('naijaMartBasket');
    const basketState = JSON.parse(currentBasket);
    const newBasket = basketState.filter((item) => item.id !== id);
    this.basket = newBasket;
    localStorage.removeItem('naijaMartBasket');
    localStorage.setItem('naijaMartBasket', JSON.stringify(newBasket));
    this.service.updateShoppingBasket(newBasket);
    this.sendBasketLength = newBasket.length;
    this.calculateTotalCost();
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

  async presentToast(messageData) {
    const toast = await this.toastController.create({
      header: 'Attention!',
      message: new IonicSafeString(messageData),
      cssClass: 'my-custom-class',
      color: 'warning',
      duration: 20000,
      translucent: true,
      position: 'top',
      buttons: [
        {
          side: 'start',
          icon: 'star',
          text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          },
        },
        {
          text: 'Done',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    toast.present();
  }
}
