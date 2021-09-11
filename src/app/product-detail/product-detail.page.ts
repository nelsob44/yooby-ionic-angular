import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import Product from '../interfaces/product';
import { StarWarsService } from '../services/star-wars.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit, OnDestroy {
  private productDetail: Product;
  private productSub: Subscription;

  constructor(
    private service: StarWarsService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has('id')) {
        this.navCtrl.navigateBack('/available-missions');
      }
      const productId: number = parseInt(paramMap.get('id'), 10);
      this.productSub = this.service
        .getProduct(productId)
        .subscribe((product) => {
          this.productDetail = product;
        });
    });
  }

  ngOnDestroy() {
    if (this.productSub) {
      this.productSub.unsubscribe();
    }
  }
}
