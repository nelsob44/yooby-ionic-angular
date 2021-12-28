import { Component, Input, OnInit } from '@angular/core';
import { ImagePath, Product } from '../../interfaces/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Input() item: Product;
  imagePath: ImagePath;
  constructor(private router: Router) {}

  ngOnInit() {
    const imgs = this.item.images[0].split(',');
    this.imagePath = {
      url: imgs[1],
      key: imgs[0],
    };
  }

  viewDetail(id: number | string) {
    this.router.navigate([
      '/product-detail',
      id,
      { type: 'available-products' },
    ]);
  }
}
