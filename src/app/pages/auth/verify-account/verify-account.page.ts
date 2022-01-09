import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.page.html',
  styleUrls: ['./verify-account.page.scss'],
})
export class VerifyAccountPage implements OnInit {
  userId = null;
  isLoading = false;
  isVerified = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      this.userId = params.userId;
    });
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Making user verification, please wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.authService.verifyUser(this.userId).subscribe(
          (resData) => {
            if (resData) {
              this.isVerified = true;
            }

            this.isLoading = false;
            loadingEl.dismiss();
          },
          (errorResponse) => {
            console.log(errorResponse);
            loadingEl.dismiss();
          }
        );
      });
  }
}
