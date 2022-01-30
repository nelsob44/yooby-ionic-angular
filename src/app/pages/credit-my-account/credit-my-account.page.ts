import { AfterViewInit, Component, OnInit } from '@angular/core';
import {
  AlertController,
  IonicSafeString,
  LoadingController,
  ModalController,
  NavController,
} from '@ionic/angular';
import { PaystackOptions } from 'angular4-paystack';
import { Account } from '../../interfaces/payment';
import { AuthService } from 'src/app/services/auth.service';
import { PaymentService } from 'src/app/services/payment.service';
import { ModalComponent } from '../../components/modal/modal.component';

@Component({
  selector: 'app-credit-my-account',
  templateUrl: './credit-my-account.page.html',
  styleUrls: ['./credit-my-account.page.scss'],
})
export class CreditMyAccountPage implements OnInit, AfterViewInit {
  reference = '';
  title = 'Ready to pay';
  options: PaystackOptions = {
    amount: 100,
    email: 'user@email.com',
    ref: `${Math.ceil(Math.random() * 10e10)}`,
  };
  purpose = '';
  loggedInUser;
  transactionId;
  amountEmpty = true;
  myAccount: Account = {
    currentBalance: 0,
    accountType: '',
    lastCreditFrom: '',
    lastPaymentTo: '',
    lastTransactionAmount: 0,
    updatedAt: '',
  };
  boxValue;

  constructor(
    private navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    public modalController: ModalController,
    private paymentService: PaymentService,
    private authService: AuthService
  ) {}

  async presentModal(isCreditTransfer: boolean) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      componentProps: { isCreditTransfer },
      backdropDismiss: false,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      //this.ionViewWillEnter();
    }
  }

  onTransferCredit() {
    this.presentModal(true);
  }

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

  ngOnInit() {
    this.reference = `ref-${Math.ceil(Math.random() * 10e13)}`;
    this.authService.email.subscribe((eml) => {
      this.loggedInUser = eml;
      this.options.email = eml;
    });
  }

  ngAfterViewInit(): void {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Retrieving products....' })
      .then((loadingEl) => {
        loadingEl.present();

        this.paymentService.fetchMyAccountBalance().valueChanges.subscribe(
          (data) => {
            if (data.data) {
              console.log(data.data);
              this.myAccount = data.data.getAccountBalance;
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

  onAddPayment() {
    const paymentData = {
      amount: this.options.amount,
      transactionReference: this.options.ref,
      paymentFrom: this.loggedInUser,
      transactionType: 'Credit Top Up',
      paymentTo: 'Platform',
    };
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'please wait...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.paymentService.initializeAccountCrediting(paymentData).subscribe(
          (resData) => {
            if (resData) {
              this.presentAlert(
                '<p style=color:white;>Payment was successfully initialized</p>',
                'Success'
              );
              console.log(resData);
              this.transactionId = resData.data.createTransaction.id;
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
      id: this.transactionId,
      transactionReference: this.options.ref,
    };
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'please wait...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.paymentService.completingCreditTransaction(paymentData).subscribe(
          async (resData) => {
            console.log({ resData });
            if (resData.data.completeTransaction.isCompleteTransaction) {
              this.boxValue = 0;
              setTimeout(() => {
                this.navCtrl.navigateBack('/available-products');
              }, 6000);
            }
            loadingEl.dismiss();
            //this.closeModal();
            //location.reload();
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

  updateAmount() {
    console.log('box value is ', this.boxValue);
    this.options.amount = this.boxValue * 100;
    if (this.boxValue >= 2000) {
      this.amountEmpty = false;
    } else {
      this.amountEmpty = true;
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
}
