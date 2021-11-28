import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-shopping-cart-badge',
  templateUrl: './shopping-cart-badge.component.html',
  styleUrls: ['./shopping-cart-badge.component.scss'],
})
export class ShoppingCartBadgeComponent implements OnInit {
  @Input() numberOfItems: number;
  @Output() openCartModal = new EventEmitter<string>();
  basketSub: Subscription;
  constructor(private service: ProductsService) {}

  ngOnInit() {
    this.service.getNumberInBasket();
  }
  openCart() {
    this.openCartModal.emit('cartModal');
    console.log('Look at the cart');
  }
}
