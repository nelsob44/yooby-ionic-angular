import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import BasketItem from 'src/app/interfaces/basketItem';
import { ImagePath } from '../../interfaces/product';

@Component({
  selector: 'app-basket-item',
  templateUrl: './basket-item.component.html',
  styleUrls: ['./basket-item.component.scss'],
})
export class BasketItemComponent implements OnInit {
  @Input() basketItem: BasketItem;
  @Output() sendDeleteItem = new EventEmitter<string | number>();
  imagePath: ImagePath;
  constructor() {}

  ngOnInit() {
    console.log(this.basketItem);
    const imgs = this.basketItem.image[0].split(',');
    this.imagePath = {
      url: imgs[1],
      key: imgs[0],
    };
  }
  deleteItem(id: string | number) {
    this.sendDeleteItem.emit(id);
  }
}
