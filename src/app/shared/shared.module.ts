import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ShoppingCartBadgeComponent } from '../components/shopping-cart-badge/shopping-cart-badge.component';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { TruncateWordsPipe } from './pipes/truncate-words.pipe';

@NgModule({
  declarations: [
    ShoppingCartBadgeComponent,
    ImagePickerComponent,
    TruncateWordsPipe,
  ],
  imports: [CommonModule, IonicModule],
  exports: [
    ShoppingCartBadgeComponent,
    ImagePickerComponent,
    TruncateWordsPipe,
  ],
})
export class SharedModule {}
