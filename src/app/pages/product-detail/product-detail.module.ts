import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProductDetailPageRoutingModule } from './product-detail-routing.module';

import { ProductDetailPage } from './product-detail.page';
import { ShoppingCartBadgeComponent } from '../../components/shopping-cart-badge/shopping-cart-badge.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductDetailPageRoutingModule,
  ],
  declarations: [ProductDetailPage, ShoppingCartBadgeComponent],
})
export class ProductDetailPageModule {}
