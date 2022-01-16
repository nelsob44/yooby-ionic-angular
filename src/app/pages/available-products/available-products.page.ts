import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  AlertController,
  IonicSafeString,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Subscription } from 'rxjs';
import BasketItem from '../../interfaces/basketItem';
import { Product } from '../../interfaces/product';
import { ModalComponent } from '../../components/modal/modal.component';
import { ProductsService } from '../../services/products.service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-available-products',
  templateUrl: './available-products.page.html',
  styleUrls: ['./available-products.page.scss'],
})
export class AvailableProductsPage implements OnInit, OnDestroy {
  basketLength: number;
  loadedProducts: Product[];
  itemsPerPage = 4;
  totalItems = 0;
  offset = 1;
  hasNextPage = false;
  hasPrevPage = false;
  isLoading = false;
  numberOfPages = 1;
  private productsSub: Subscription;
  private basketSub: Subscription;

  constructor(
    private service: ProductsService,
    private loadingCtrl: LoadingController,
    public modalController: ModalController,
    private alertController: AlertController
  ) {}

  async presentModal(basket: BasketItem[]) {
    const modal = await this.modalController.create({
      component: ModalComponent,
      cssClass: 'my-custom-class',
      swipeToClose: true,
      componentProps: { basket },
      backdropDismiss: false,
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.ionViewWillEnter();
    }
  }

  async ngOnInit() {
    const { value } = await Storage.get({ key: 'paymentCheckErrors' });
    const parsedData = JSON.parse(value);
    console.log(parsedData);
    if (parsedData === null) {
      return {};
    } else {
      let display = '';
      const htmlData = parsedData.map((el, index) => {
        display += index + 1 + ') ' + el + '<br/><br/>';
      });
      this.presentAlert(
        '<p style=color:white;>' + `${display}` + '</p>',
        'Attention!'
      );
    }
  }

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

    this.basketSub = this.service.getShoppingBasket().subscribe((items) => {
      this.basketLength = items.length;
    });
  }

  onCartModalOpen($event): Subscription {
    return this.service.getShoppingBasket().subscribe((basket) => {
      this.presentModal(basket);
    });
  }

  ngOnDestroy() {
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }
    if (this.basketSub) {
      this.basketSub.unsubscribe();
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

  private retrieveData(offsetValue: number, itemsPerPageValue: number) {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Retrieving products....' })
      .then((loadingEl) => {
        loadingEl.present();

        this.productsSub = this.service
          .fetchProducts(offsetValue, itemsPerPageValue)
          .valueChanges.subscribe(
            (data) => {
              if (data.data) {
                this.loadedProducts = data.data.getAvailableProducts.product;
                this.service.productsRetrieved.next(
                  data.data.getAvailableProducts.product
                );
                this.totalItems = data.data.getAvailableProducts.totalItems;
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
