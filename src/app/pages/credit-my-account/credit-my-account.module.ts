import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { CreditMyAccountPageRoutingModule } from './credit-my-account-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { CreditMyAccountPage } from './credit-my-account.page';
import { Angular4PaystackModule } from 'angular4-paystack';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreditMyAccountPageRoutingModule,
    SharedModule,
    Angular4PaystackModule.forRoot(environment.pstackPKTest),
  ],
  declarations: [CreditMyAccountPage],
})
export class CreditMyAccountPageModule {}
