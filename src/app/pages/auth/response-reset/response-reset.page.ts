import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import {
  LoadingController,
  AlertController,
  IonicSafeString,
} from '@ionic/angular';

@Component({
  selector: 'app-response-reset',
  templateUrl: './response-reset.page.html',
  styleUrls: ['./response-reset.page.scss'],
})
export class ResponseResetPage implements OnInit {
  resetPasswordToken = null;
  isLoading = false;

  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log({ params });
      this.resetPasswordToken = params.token;
    });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email.replace(/(<([^>]+)>)/gi, '');
    const passwordConfirmation = form.value.passwordConfirmation.replace(
      /(<([^>]+)>)/gi,
      ''
    );
    const password = form.value.password.replace(/(<([^>]+)>)/gi, '');
    if (passwordConfirmation !== password) {
      this.presentAlert(
        '<p style=color:white;>Your Passwords do not match. Please check again</p>',
        'Error!'
      );
      return;
    }

    const resetPasswordToken = this.resetPasswordToken.replace(
      /(<([^>]+)>)/gi,
      ''
    );

    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'please wait...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.authService
          .changePassword(email, password, resetPasswordToken)
          .subscribe(
            (resData) => {
              if (resData) {
                form.reset();
                this.router.navigateByUrl('/auth');
              }
              this.isLoading = false;
              loadingEl.dismiss();
            },
            (errorResponse) => {
              loadingEl.dismiss();
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
