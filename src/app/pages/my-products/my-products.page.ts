import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AlertController,
  IonicSafeString,
  LoadingController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import { ProductsService } from '../../services/products.service';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-my-products',
  templateUrl: './my-products.page.html',
  styleUrls: ['./my-products.page.scss'],
})
export class MyProductsPage implements OnInit, OnDestroy {
  loadedProducts: Product[];
  private myProductsSub: Subscription;
  constructor(
    private service: ProductsService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Retrieving products....' })
      .then((loadingEl) => {
        loadingEl.present();

        this.myProductsSub = this.service
          .fetchMyProducts()
          .valueChanges.subscribe(({ data, loading, error }) => {
            if (data) {
              this.loadedProducts = data.getMyProducts;
              this.service.myProducts.next(data.getMyProducts);
              console.log(this.loadedProducts);
              if (this.loadedProducts.length < 1) {
                this.presentAlert(
                  '<p style=color:white;>You have not added any products</p>',
                  'Notice'
                );
              }
            }
            if (error) {
              this.presentAlert(
                '<p style=color:white;>' + error + '</p>',
                'Error'
              );
            }
            loadingEl.dismiss();
          });
      });
  }

  ngOnDestroy() {
    if (this.myProductsSub) {
      this.myProductsSub.unsubscribe();
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
