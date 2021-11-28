import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import BasketItem from 'src/app/interfaces/basketItem';

@Component({
  selector: 'app-basket-item',
  templateUrl: './basket-item.component.html',
  styleUrls: ['./basket-item.component.scss'],
})
export class BasketItemComponent implements OnInit {
  @Input() basketItem: BasketItem;
  @Output() sendDeleteItem = new EventEmitter<string | number>();
  constructor() {}

  ngOnInit() {
    console.log(this.basketItem);
  }
  deleteItem(id: string | number) {
    this.sendDeleteItem.emit(id);
  }
}
