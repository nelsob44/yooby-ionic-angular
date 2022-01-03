import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import {
  LoadingController,
  AlertController,
  IonicSafeString,
} from '@ionic/angular';

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.page.html',
  styleUrls: ['./request-reset.page.scss'],
})
export class RequestResetPage implements OnInit {
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email.replace(/(<([^>]+)>)/gi, '');

    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'please wait...' })
      .then((loadingEl) => {
        loadingEl.present();
        //let productObs: Observable<any>;
        this.authService.sendPasswordResetLink(email).subscribe(
          (resData) => {
            console.log(resData);
            if (resData) {
              form.reset();
              this.presentAlert(
                '<p style=color:white;>' + resData.data.sendResetLink + '</p>',
                'Success'
              );
              //this.router.navigate(['my-products']);
            }
            this.isLoading = false;
            loadingEl.dismiss();
          },
          (errorResponse) => {
            console.log(errorResponse);
            loadingEl.dismiss();
            this.presentAlert(
              '<p style=color:white;>Sorry there was an error. please try again later or contact Admin</p>',
              'Error'
            );
            this.isLoading = false;
          }
        );
      });
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
