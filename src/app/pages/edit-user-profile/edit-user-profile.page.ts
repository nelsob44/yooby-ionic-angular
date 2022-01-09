import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  AlertController,
  IonicSafeString,
  LoadingController,
  NavController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

const base64toBlob = (base64Data, contentType) => {
  contentType = contentType || '';
  const sliceSize = 1024;
  const byteCharacters = window.atob(base64Data);
  const bytesLength = byteCharacters.length;
  const slicesCount = Math.ceil(bytesLength / sliceSize);
  const byteArrays = new Array(slicesCount);

  for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    const begin = sliceIndex * sliceSize;
    const end = Math.min(begin + sliceSize, bytesLength);

    const bytes = new Array(end - begin);
    for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
      bytes[i] = byteCharacters[offset].charCodeAt(0);
    }
    byteArrays[sliceIndex] = new Uint8Array(bytes);
  }
  return new Blob(byteArrays, { type: contentType });
};

@Component({
  selector: 'app-edit-user-profile',
  templateUrl: './edit-user-profile.page.html',
  styleUrls: ['./edit-user-profile.page.scss'],
})
export class EditUserProfilePage implements OnInit {
  form: FormGroup;
  userSub: Subscription;
  userId = null;
  filesToUpload: any = [];
  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertController: AlertController,
    private loadingCtrl: LoadingController,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      console.log(params);
      // if (!params.userId) {
      //   this.navCtrl.navigateBack('/available-products');
      // }
      this.userSub = this.authService.myUserProfile.subscribe((user) => {
        console.log(user);
        if (!user) {
          this.navCtrl.navigateBack('/user-profile');
        }
        this.userId = user.id;
        this.form = new FormGroup({
          firstName: new FormControl(user.firstName, {
            updateOn: 'blur',
            validators: [Validators.minLength(2)],
          }),
          lastName: new FormControl(user.lastName, {
            updateOn: 'blur',
            validators: [Validators.minLength(2)],
          }),
          country: new FormControl(user.country, {
            updateOn: 'blur',
            validators: [Validators.minLength(2)],
          }),
          city: new FormControl(user.city, {
            updateOn: 'blur',
            validators: [Validators.minLength(2)],
          }),
          address: new FormControl(user.address, {
            updateOn: 'blur',
            validators: [Validators.minLength(2)],
          }),
          phoneNumber: new FormControl(user.phoneNumber, {
            updateOn: 'blur',
            validators: [Validators.minLength(9)],
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
      });
    });
  }

  onImagePicked(imageData: string | File) {
    let imageFile;
    if (typeof imageData === 'string') {
      try {
        imageFile = base64toBlob(
          imageData.replace('data:image/png;base64,', ''),
          'image/jpeg'
        );
        this.filesToUpload.push(imageFile);
      } catch (error) {
        this.presentAlert(error, 'Error');
        return;
      }
    } else {
      imageFile = imageData;
      this.filesToUpload.push(imageData);
    }
    this.form.patchValue({ theImage: imageFile });
  }

  onClickSubmit() {
    console.log(this.form);
    // if (this.form.status === 'INVALID') {
    //   return;
    // }
    const authData = {
      id: this.userId.replace(/(<([^>]+)>)/gi, ''),
      password:
        this.form.get('password').value &&
        this.form.get('password').value.replace(/(<([^>]+)>)/gi, ''),
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
      confirmPassword:
        this.form.get('confirmPassword').value &&
        this.form.get('confirmPassword').value.replace(/(<([^>]+)>)/gi, ''),
    };
    //console.log(authData);
    //return;
    if (authData.password !== authData.confirmPassword) {
      this.presentAlert(
        '<p style=color:white;>Your passwords do not match.</p>',
        'Success'
      );
      return;
    }
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Updating profile, please wait...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        this.authService.updateUser(authData, this.filesToUpload).subscribe(
          (resData) => {
            console.log(resData);
            if (resData) {
              this.filesToUpload = [];
              this.form.reset();
              this.presentAlert(
                '<p style=color:white;>Your profile was successfully updated</p>',
                'Success'
              );
              this.navCtrl.navigateBack('/user-profile');
            }

            loadingEl.dismiss();
          },
          (errorResponse) => {
            loadingEl.dismiss();
            this.presentAlert(
              '<p style=color:white;>' + errorResponse + '</p>',
              'Error'
            );
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
