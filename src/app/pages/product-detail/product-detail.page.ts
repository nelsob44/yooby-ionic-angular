import { BoundText } from '@angular/compiler/src/render3/r3_ast';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Product } from '../../interfaces/product';
import { ProductsService } from '../../services/products.service';
import { ModalController } from '@ionic/angular';
import { ModalComponent } from '../../components/modal/modal.component';
import BasketItem from 'src/app/interfaces/basketItem';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit, OnDestroy {
  productQuantity;
  basketLength: number;
  modalBasket: BasketItem[] = [];
  productDetail: Product;
  private productSub: Subscription;
  private basketSub: Subscription;

  constructor(
    private service: ProductsService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
    public modalController: ModalController
  ) {}

  async presentModal(basket: BasketItem[]) {
    console.log({ basket });
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
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/available-products');
      }
      const productId: number = parseInt(paramMap.get('id'), 10);
      this.productSub = this.service
        .getProduct(productId)
        .subscribe((product) => {
          this.productDetail = product;
        });
    });
  }
  ionViewWillEnter() {
    this.basketSub = this.service.getShoppingBasket().subscribe((items) => {
      this.basketLength = items.length;
    });
  }
  onCartModalOpen($event) {
    return this.service.getShoppingBasket().subscribe((basket) => {
      this.presentModal(basket);
    });
  }

  updateQuantity(quantity: number | string, updateStatus: string) {
    if (updateStatus === null) {
      this.productQuantity = quantity;
    } else if (updateStatus === 'add') {
      if (isNaN(this.productQuantity)) {
        this.productQuantity = 1;
      } else {
        this.productQuantity++;
      }
    } else if (updateStatus === 'reduce') {
      if (this.productQuantity === 1) {
        return;
      }
      this.productQuantity--;
    }
  }

  addToBasket() {
    const basketArray: BasketItem[] = [];
    const basketItem: BasketItem = {
      id: this.productDetail.id || '1zx',
      unitCost: this.productDetail.price,
      title: this.productDetail.title,
      image: this.productDetail.image,
      quantity: parseInt(this.productQuantity, 10) || 1,
      subTotal:
        parseInt(this.productQuantity, 10) * this.productDetail.price ||
        this.productDetail.price,
    };
    // check if basket is empty or not
    const isItemInBasket = localStorage.getItem('naijaMartBasket');
    if (isItemInBasket) {
      localStorage.removeItem('naijaMartBasket');
      // convert basket to array
      const basketState = JSON.parse(isItemInBasket);
      // check if item to add already exists in basket
      const currentBasketIndex = basketState.findIndex(
        (item) => item.id === basketItem.id
      );
      if (currentBasketIndex > -1) {
        // if item exists in basket, replace the quantity with current value
        const newBasketItem = {
          ...basketState[currentBasketIndex],
          quantity:
            basketState[currentBasketIndex].quantity + basketItem.quantity,
          subTotal:
            basketState[currentBasketIndex].subTotal + basketItem.subTotal,
        };
        // replace the item in old basket with new one reflecting updated quantity
        basketState[currentBasketIndex] = newBasketItem;
        // replace local storage basket
        localStorage.setItem('naijaMartBasket', JSON.stringify(basketState));
        this.service.updateShoppingBasket(basketState);
        this.basketLength = basketState.length;
      } else {
        // if item does not already exist in basket, add it to basket
        basketState.push(basketItem);
        localStorage.setItem('naijaMartBasket', JSON.stringify(basketState));
        this.service.updateShoppingBasket(basketState);
        this.basketLength = basketState.length;
      }
    } else {
      // if basket is empty, add new item
      basketArray.push(basketItem);

      localStorage.setItem('naijaMartBasket', JSON.stringify(basketArray));
      this.service.updateShoppingBasket(basketArray);
      this.basketLength = basketArray.length;
    }
  }

  ngOnDestroy() {
    if (this.productSub) {
      this.productSub.unsubscribe();
    }
    if (this.basketSub) {
      this.basketSub.unsubscribe();
    }
  }
}
