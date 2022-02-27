import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyOrdersPageRoutingModule } from './my-orders-routing.module';
// import { MyOrderItemComponent } from '../../components/my-order-item/my-order-item.component';
import { SharedModule } from '../../shared/shared.module';
import { MyOrdersPage } from './my-orders.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyOrdersPageRoutingModule,
    SharedModule,
  ],
  declarations: [MyOrdersPage],
})
export class MyOrdersPageModule {}
