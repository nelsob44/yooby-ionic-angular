import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RequestResetPageRoutingModule } from './request-reset-routing.module';

import { RequestResetPage } from './request-reset.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RequestResetPageRoutingModule
  ],
  declarations: [RequestResetPage]
})
export class RequestResetPageModule {}
