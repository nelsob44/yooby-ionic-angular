import { Component, OnInit, Input } from '@angular/core';
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
import { Recipient } from '../../interfaces/user';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() basket: BasketItem[];
  @Input() isCreditTransfer = false;
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
  searchList = [];
  searchResult = null;
  chosenRecipient: Recipient;
  proceedWithTransfer = false;
  transferValue;
  amountEmpty = true;

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

  updateSearch(recipientEmail: string) {
    console.log('recipient is ', recipientEmail);
    this.authService.fetchRecipients(recipientEmail).valueChanges.subscribe(
      (data) => {
        if (data.data) {
          console.log(data.data);
          this.searchList = data.data.getRecipients;
        }
      },
      (error) => {
        if (error) {
          this.presentAlert('<p style=color:white;>' + error + '</p>', 'Error');
        }
      }
    );
  }

  updateAmount(amount: number | string) {
    this.transferValue = amount;
    if (this.transferValue >= 2000) {
      this.amountEmpty = false;
    } else {
      this.amountEmpty = true;
    }
  }

  onSendCredit() {
    const numericTransferValue = parseInt(this.transferValue, 10);
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Transferring credit....' })
      .then((loadingEl) => {
        loadingEl.present();

        this.paymentService
          .makeCreditTransfer(
            numericTransferValue,
            this.chosenRecipient.userEmail
          )
          .subscribe(
            (data) => {
              if (data.data.transferCredit) {
                console.log(data.data);
                this.dismiss();
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

  chooseRecipient(recipient: Recipient) {
    console.log({ recipient });
    this.searchResult = recipient.userEmail;
    this.chosenRecipient = recipient;
    this.proceedWithTransfer = true;
    setTimeout(() => {
      this.searchList = [];
    }, 1100);
    console.log('search is ', this.searchResult);
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
          async (resData) => {
            if (resData.data.completePayment.isCompleteTransaction) {
              localStorage.removeItem('naijaMartBasket');
              const removeErrorMessages = async () => {
                await Storage.remove({ key: 'paymentCheckErrors' });
              };
              removeErrorMessages();
            }
            loadingEl.dismiss();
            this.closeModal();
            location.reload();
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
    console.log('credit transfer is ', this.isCreditTransfer);
    this.calculateTotalCost();
    this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
    this.purpose = JSON.stringify(this.basket);
    this.authService.email.subscribe((eml) => {
      this.loggedInUser = eml;
      this.options.email = eml;
    });
  }
  calculateTotalCost() {
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

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
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
