import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  IonicSafeString,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { ProductsService } from 'src/app/services/products.service';

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
  selector: 'app-add-product',
  templateUrl: './add-product.page.html',
  styleUrls: ['./add-product.page.scss'],
})
export class AddProductPage implements OnInit, OnDestroy {
  form: FormGroup;
  isVerified = false;
  isLogin = true;
  isLoading = false;
  dateMax;
  filesToUpload: any = [];
  userSub: Subscription;
  constructor(
    private authService: AuthService,
    private productService: ProductsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.userSub = this.authService.isVerified.subscribe((verified) => {
      if (verified) {
        this.isVerified = true;
      } else {
        this.presentAlert(
          '<p style=color:white;>You must verify your account to be able to add your goods</p>',
          'Attention!'
        );
      }
      console.log('login', this.isLogin, 'verified', this.isVerified);
    });
    this.form = new FormGroup({
      category: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.minLength(2)],
      }),
      description: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.minLength(2)],
      }),
      videoLink: new FormControl(null, {
        updateOn: 'blur',
        validators: [
          Validators.pattern(
            '(?:(?:(?:ht|f)tp)s?://)?[\\w_-]+(?:\\.[\\w_-]+)+([\\w.,@?^=%&:/~+#-]*[\\w@?^=%&/~+#-])?'
          ),
        ],
      }),
      theImage: new FormControl(null, {
        updateOn: 'blur',
        validators: [],
      }),
      price: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.minLength(1)],
      }),
      title: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.minLength(2)],
      }),
      minOrder: new FormControl(null, {
        updateOn: 'blur',
        validators: [],
      }),
      sellerCountry: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.minLength(2)],
      }),
      sellerLocation: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.minLength(2)],
      }),
      furtherDetails: new FormControl(null, {
        updateOn: 'blur',
        validators: [],
      }),
      availableQuantity: new FormControl(null, {
        updateOn: 'blur',
        validators: [Validators.min(1)],
      }),
      discount: new FormControl(null, {
        updateOn: 'blur',
        validators: [],
      }),
      promoStartDate: new FormControl(null, {
        updateOn: 'blur',
        validators: [],
      }),
      promoEndDate: new FormControl(null, {
        updateOn: 'blur',
        validators: [],
      }),
    });

    const date = new Date().getFullYear();
    this.dateMax = (date + 5).toString() + '-' + '12' + '-' + '31';
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

  onAddProduct() {
    if (this.form.status === 'INVALID') {
      return;
    }
    let youTubeVideoId = '';
    if (
      this.form.value.videoLink !== null &&
      this.form.value.videoLink !== undefined &&
      this.form.value.videoLink !== ''
    ) {
      const youTubeLink = this.form.value.videoLink
        .replace(/(<([^>]+)>)/gi, '')
        .split('=');

      const youTubeIdString = youTubeLink[1].split('&');
      youTubeVideoId = youTubeIdString[0];
    }

    const productData = {
      category: this.form.value.category.replace(/(<([^>]+)>)/gi, ''),
      description: this.form.value.description.replace(/(<([^>]+)>)/gi, ''),
      price: this.form.value.price,
      title:
        this.form.value.title &&
        this.form.value.title.replace(/(<([^>]+)>)/gi, ''),
      videoLink: youTubeVideoId,
      minOrder: this.form.value.minOrder,
      sellerCountry:
        this.form.value.sellerCountry &&
        this.form.value.sellerCountry.replace(/(<([^>]+)>)/gi, ''),
      sellerLocation:
        this.form.value.sellerLocation &&
        this.form.value.sellerLocation.replace(/(<([^>]+)>)/gi, ''),
      furtherDetails:
        this.form.value.furtherDetails &&
        this.form.value.furtherDetails.replace(/(<([^>]+)>)/gi, ''),
      availableQuantity: this.form.value.availableQuantity,
      discount: this.form.value.discount,
      promoStartDate:
        this.form.value.promoStartDate &&
        this.form.value.promoStartDate.toString().replace(/(<([^>]+)>)/gi, ''),
      promoEndDate:
        this.form.value.promoEndDate &&
        this.form.value.promoEndDate.toString().replace(/(<([^>]+)>)/gi, ''),
    };

    this.isLoading = true;
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'please wait...' })
      .then((loadingEl) => {
        loadingEl.present();
        this.productService
          .addProduct(productData, this.filesToUpload)
          .subscribe(
            (resData) => {
              console.log(resData);
              if (resData) {
                this.filesToUpload = [];
                this.form.reset();
                this.presentAlert(
                  '<p style=color:white;>Product was successfully added</p>',
                  'Success'
                );
                this.router.navigate(['my-products']);
              }
              this.isLoading = false;
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

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
