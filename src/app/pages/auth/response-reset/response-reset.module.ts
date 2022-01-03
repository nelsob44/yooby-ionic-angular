import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResponseResetPageRoutingModule } from './response-reset-routing.module';

import { ResponseResetPage } from './response-reset.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResponseResetPageRoutingModule
  ],
  declarations: [ResponseResetPage]
})
export class ResponseResetPageModule {}
