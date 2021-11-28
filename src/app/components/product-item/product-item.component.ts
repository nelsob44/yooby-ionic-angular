import { Component, Input, OnInit } from '@angular/core';
import { Product } from '../../interfaces/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Input() item: Product;
  constructor(private router: Router) {}

  ngOnInit() {}

  viewDetail(id: number) {
    this.router.navigate(['/product-detail', id]);
  }
}
