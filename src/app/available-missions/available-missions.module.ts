import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvailableMissionsPageRoutingModule } from './available-missions-routing.module';

import { AvailableMissionsPage } from './available-missions.page';
import { ProductItemComponent } from '../product-item/product-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvailableMissionsPageRoutingModule,
  ],
  declarations: [AvailableMissionsPage, ProductItemComponent],
})
export class AvailableMissionsPageModule {}
