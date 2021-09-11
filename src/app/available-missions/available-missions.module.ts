import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvailableMissionsPageRoutingModule } from './available-missions-routing.module';

import { AvailableMissionsPage } from './available-missions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvailableMissionsPageRoutingModule
  ],
  declarations: [AvailableMissionsPage]
})
export class AvailableMissionsPageModule {}
