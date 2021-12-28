import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ImagePath, Product } from '../../interfaces/product';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ProductsService } from 'src/app/services/products.service';
import {
  AlertController,
  IonicSafeString,
  LoadingController,
} from '@ionic/angular';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit, OnDestroy {
  @Input() item: Product;
  imagePath: ImagePath;
  isAdmin = false;
  isLoading = false;
  userSub: Subscription;
  constructor(
    private authService: AuthService,
    private router: Router,
    private productService: ProductsService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const imgs = this.item.images[0].split(',');
    this.imagePath = {
      url: imgs[1],
      key: imgs[0],
    };
    this.userSub = this.authService.privilege.subscribe((privilege) => {
      if (privilege) {
        if (privilege === 'admin') {
          this.isAdmin = true;
        }
      }
    });
  }

  viewDetail(id: number | string) {
    this.router.navigate([
      '/product-detail',
      id,
      { type: 'available-products' },
    ]);
  }

  ngOnDestroy() {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  async presentAlertConfirm(id: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message: new IonicSafeString(
        '<p style=color:white;>Are you sure you wish to delete the product?</p>'
      ),
      translucent: true,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-secondary',
          handler: () => false,
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteProductItem(id);
          },
        },
      ],
    });

    await alert.present();
  }

  deleteProductItem(id: string) {
    console.log({ id });
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Deleting product....' })
      .then((loadingEl) => {
        loadingEl.present();

        this.productService.deleteProduct(id).subscribe(
          (resData) => {
            console.log(resData.data);
            if (resData) {
              this.presentAlert(
                '<p style=color:white;>' + resData.data.deleteProduct + '</p>',
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
}
