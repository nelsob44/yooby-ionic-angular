import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvailableProductsPageRoutingModule } from './available-products-routing.module';

import { AvailableProductsPage } from './available-products.page';
import { TruncateWordsPipe } from '../../pipes/truncate-words.pipe';
import { ProductItemComponent } from '../../components/product-item/product-item.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvailableProductsPageRoutingModule,
    SharedModule,
  ],
  declarations: [
    AvailableProductsPage,
    ProductItemComponent,
    TruncateWordsPipe,
    // ShoppingCartBadgeComponent,
  ],
})
export class AvailableProductsPageModule {}
