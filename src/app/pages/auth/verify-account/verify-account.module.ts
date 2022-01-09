import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VerifyAccountPageRoutingModule } from './verify-account-routing.module';

import { VerifyAccountPage } from './verify-account.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VerifyAccountPageRoutingModule
  ],
  declarations: [VerifyAccountPage]
})
export class VerifyAccountPageModule {}
