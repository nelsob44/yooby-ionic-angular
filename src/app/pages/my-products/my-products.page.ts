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
  itemsPerPage = 4;
  totalItems = 0;
  offset = 1;
  hasNextPage = false;
  hasPrevPage = false;
  isLoading = false;
  numberOfPages = 1;

  private myProductsSub: Subscription;
  constructor(
    private service: ProductsService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController
  ) {}

  ngOnInit() {}
  nextPage() {
    this.offset++;
    this.retrieveData(this.offset, this.itemsPerPage);
  }

  prevPage() {
    this.offset--;
    this.retrieveData(this.offset, this.itemsPerPage);
  }

  ionViewWillEnter() {
    this.retrieveData(this.offset, this.itemsPerPage);
  }

  ngOnDestroy() {
    if (this.myProductsSub) {
      this.myProductsSub.unsubscribe();
    }
  }

  onImageDelete(event) {
    console.log('event is ', event);
    this.myProductsSub = this.service
      .fetchMyProducts(1, 4)
      .valueChanges.subscribe(
        (data) => {
          if (data.data) {
            this.loadedProducts = data.data.getMyProducts.product;
            this.service.myProducts.next(data.data.getMyProducts.product);
            this.totalItems = data.data.getMyProducts.totalItems;
            this.numberOfPages = Math.ceil(this.totalItems / this.itemsPerPage);
            if (this.numberOfPages > this.offset) {
              this.hasNextPage = true;
            } else {
              this.hasNextPage = false;
            }
            if (this.offset > 1) {
              this.hasPrevPage = true;
            } else {
              this.hasPrevPage = false;
            }
            if (this.loadedProducts.length < 1) {
              this.presentAlert(
                '<p style=color:white;>You have not added any products</p>',
                'Notice'
              );
            }
          }
        },
        (error) => {
          if (error) {
            this.presentAlert(
              '<p style=color:white;>' + error + '</p>',
              'Error'
            );
          }
        }
      );
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

  private retrieveData(offsetValue: number, itemsPerPageValue: number) {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Retrieving products....' })
      .then((loadingEl) => {
        loadingEl.present();

        this.myProductsSub = this.service
          .fetchMyProducts(offsetValue, itemsPerPageValue)
          .valueChanges.subscribe(
            (data) => {
              if (data.data) {
                this.loadedProducts = data.data.getMyProducts.product;
                this.service.myProducts.next(data.data.getMyProducts.product);
                this.totalItems = data.data.getMyProducts.totalItems;
                this.numberOfPages = Math.ceil(
                  this.totalItems / this.itemsPerPage
                );
                if (this.numberOfPages > this.offset) {
                  this.hasNextPage = true;
                } else {
                  this.hasNextPage = false;
                }
                if (this.offset > 1) {
                  this.hasPrevPage = true;
                } else {
                  this.hasPrevPage = false;
                }
                if (this.loadedProducts.length < 1) {
                  this.presentAlert(
                    '<p style=color:white;>You have not added any products</p>',
                    'Notice'
                  );
                }
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
}
