import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product, ImagePath } from '../../interfaces/product';
import { Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import {
  AlertController,
  IonicSafeString,
  LoadingController,
} from '@ionic/angular';

@Component({
  selector: 'app-my-product-item',
  templateUrl: './my-product-item.component.html',
  styleUrls: ['./my-product-item.component.scss'],
})
export class MyProductItemComponent implements OnInit {
  @Input() item: Product;
  @Output() productDelete = new EventEmitter<string>();

  imagePath: ImagePath;
  isLoading = false;
  editMessage =
    '<p style=color:white;>Are you sure you wish to edit the product?</p>';
  deleteMessage =
    '<p style=color:white;>Are you sure you wish to delete the product?</p>';

  constructor(
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
  }

  viewDetail(id: string) {
    this.router.navigate(['/product-detail', id, { type: 'my-products' }]);
  }

  async presentAlertConfirm(id: string, type: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Confirm!',
      message:
        type === 'delete'
          ? new IonicSafeString(this.deleteMessage)
          : new IonicSafeString(this.editMessage),
      translucent: true,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'alert-secondary',
          handler: () => false,
        },
        {
          text: type === 'delete' ? 'Delete' : 'Edit',
          handler: async () => {
            if (type === 'delete') {
              await this.deleteProductItem(id);
            } else {
              await this.editProductItem(id);
            }
          },
        },
      ],
    });

    await alert.present();
  }

  editProductItem(id: string) {
    console.log('edit id ', id);
    this.router.navigate(['/edit-product', id, { type: 'my-products' }]);
  }

  deleteProductItem(id: string) {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Deleting product....' })
      .then((loadingEl) => {
        loadingEl.present();

        this.productService.deleteProduct(id).subscribe(
          (resData) => {
            if (resData) {
              this.presentAlert(
                '<p style=color:white;>' + resData.data.deleteProduct + '</p>',
                'Success'
              );
              this.productDelete.emit('deleted');
            }
            this.isLoading = false;
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
