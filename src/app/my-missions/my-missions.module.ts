import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyMissionsPageRoutingModule } from './my-missions-routing.module';

import { MyMissionsPage } from './my-missions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyMissionsPageRoutingModule
  ],
  declarations: [MyMissionsPage]
})
export class MyMissionsPageModule {}
