import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';
import BasketItem from '../../interfaces/basketItem';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  @Input() basket: BasketItem[];
  sendBasketLength: number;
  totalCost: number;
  constructor(
    public modalController: ModalController,
    private service: ProductsService
  ) {}

  ngOnInit() {
    console.log(this.basket);
    this.calculateTotalCost();
  }
  calculateTotalCost() {
    if (this.basket && this.basket.length > 0) {
      this.totalCost = parseFloat(
        this.basket
          .reduce((ack: number, item) => ack + item.subTotal, 0)
          .toFixed(2)
      );
    }
  }
  closeModal() {
    this.modalController.dismiss({
      dismissed: true,
      sendBasketLength: this.sendBasketLength,
    });
  }
  onDeleteItem(id: number | string) {
    const currentBasket = localStorage.getItem('naijaMartBasket');
    const basketState = JSON.parse(currentBasket);
    const newBasket = basketState.filter((item) => item.id !== id);
    this.basket = newBasket;
    localStorage.removeItem('naijaMartBasket');
    localStorage.setItem('naijaMartBasket', JSON.stringify(newBasket));
    this.service.updateShoppingBasket(newBasket);
    this.sendBasketLength = newBasket.length;
    this.calculateTotalCost();
  }
}
