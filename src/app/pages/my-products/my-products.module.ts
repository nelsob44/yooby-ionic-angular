import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyProductsPageRoutingModule } from './my-products-routing.module';
import { MyProductItemComponent } from '../../components/my-product-item/my-product-item.component';
import { SharedModule } from '../../shared/shared.module';
import { MyProductsPage } from './my-products.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyProductsPageRoutingModule,
    SharedModule,
  ],
  declarations: [MyProductsPage, MyProductItemComponent],
})
export class MyProductsPageModule {}
