import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import {
  LoadingController,
  AlertController,
  IonicSafeString,
  ToastController,
} from '@ionic/angular';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  form: FormGroup;
  isLogin = true;
  isLoading = false;
  title = environment.title;
  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      firstName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.minLength(2)],
      }),
      lastName: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.minLength(2)],
      }),
      email: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.minLength(5)],
      }),
      country: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.minLength(3)],
      }),
      city: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.minLength(2)],
      }),
      address: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.minLength(2)],
      }),
      phoneNumber: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.minLength(2)],
      }),
      password: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.required, Validators.minLength(5)],
      }),
      confirmPassword: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.minLength(5)],
      }),
    });
  }

  onClickSubmit() {
    console.log(this.isLogin);
    console.log(this.form.status);
    console.log(this.form.status);
    if (this.form.status === 'INVALID') {
      return;
    }
    const authData = {
      email: this.form.get('email').value.replace(/(<([^>]+)>)/gi, ''),
      password: this.form.get('password').value.replace(/(<([^>]+)>)/gi, ''),
      firstName:
        this.form.get('firstName').value &&
        this.form.get('firstName').value.replace(/(<([^>]+)>)/gi, ''),
      lastName:
        this.form.get('lastName').value &&
        this.form.get('lastName').value.replace(/(<([^>]+)>)/gi, ''),
      country:
        this.form.get('country').value &&
        this.form.get('country').value.replace(/(<([^>]+)>)/gi, ''),
      city:
        this.form.get('city').value &&
        this.form.get('city').value.replace(/(<([^>]+)>)/gi, ''),
      address:
        this.form.get('address').value &&
        this.form.get('address').value.replace(/(<([^>]+)>)/gi, ''),
      phoneNumber:
        this.form.get('phoneNumber').value &&
        this.form.get('phoneNumber').value.replace(/(<([^>]+)>)/gi, ''),
    };
    console.log('Form values ', authData);
    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'please wait...' })
      .then((loadingEl) => {
        loadingEl.present();
        let authObs: Observable<any>;
        if (this.isLogin) {
          authObs = this.authService.login(authData);
        } else {
          authObs = this.authService.signup(authData);
        }
        authObs.subscribe(
          (resData) => {
            console.log(resData);
            if (this.isLogin && resData) {
              this.router.navigate(['available-products']);
            }
            if (!this.isLogin && resData) {
              this.isLogin = true;
              this.presentAlert(
                '<p style=color:white;>Sign up successful. Please log in now</p>',
                'Success'
              );
            }
            this.isLoading = false;
            loadingEl.dismiss();
          },
          (errorResponse) => {
            loadingEl.dismiss();
            this.presentAlert(errorResponse, 'Error');
          }
        );
      });
  }

  toggleLogin() {
    this.isLogin = !this.isLogin;
  }

  forgotPassword() {
    this.router.navigate(['/auth/request-reset']);
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
  async presentToast() {
    const toast = await this.toastController.create({
      message: new IonicSafeString('<ion-button>Hello!</ion-button>'),
      cssClass: 'my-custom-class',
      duration: 12000,
      translucent: true,
    });
    toast.present();
  }
}
