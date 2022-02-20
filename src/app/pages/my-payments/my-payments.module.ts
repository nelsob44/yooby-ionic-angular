import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyPaymentsPageRoutingModule } from './my-payments-routing.module';

import { MyPaymentsPage } from './my-payments.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyPaymentsPageRoutingModule
  ],
  declarations: [MyPaymentsPage]
})
export class MyPaymentsPageModule {}
