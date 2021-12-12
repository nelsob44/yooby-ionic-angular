import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ShoppingCartBadgeComponent } from '../components/shopping-cart-badge/shopping-cart-badge.component';
import { ImagePickerComponent } from './image-picker/image-picker.component';

@NgModule({
  declarations: [ShoppingCartBadgeComponent, ImagePickerComponent],
  imports: [CommonModule, IonicModule],
  exports: [ShoppingCartBadgeComponent, ImagePickerComponent],
})
export class SharedModule {}
