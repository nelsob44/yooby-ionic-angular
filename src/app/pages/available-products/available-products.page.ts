import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController, ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import BasketItem from '../../interfaces/basketItem';
import { Product } from '../../interfaces/product';
import { ModalComponent } from '../../components/modal/modal.component';
import { ProductsService } from '../../services/products.service';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-available-products',
  templateUrl: './available-products.page.html',
  styleUrls: ['./available-products.page.scss'],
})
export class AvailableProductsPage implements OnInit, OnDestroy {
  basketLength: number;
  loadedProducts: Product[];
  private productsSub: Subscription;
  private basketSub: Subscription;
  constructor(
    private service: ProductsService,
    private loadingCtrl: LoadingController,
    public modalController: ModalController
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

  ngOnInit() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Retrieving products....' })
      .then((loadingEl) => {
        loadingEl.present();

        this.productsSub = this.service.fetchProducts().subscribe(
          (items) => {
            this.loadedProducts = items;
            loadingEl.dismiss();
          },
          (errorResponse) => {
            alert('sorry there was an error retrieving the products');
            console.log(errorResponse);
            loadingEl.dismiss();
          }
        );
      });
  }
  ionViewWillEnter() {
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
}
