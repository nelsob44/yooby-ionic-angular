import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ShoppingCartBadgeComponent } from '../components/shopping-cart-badge/shopping-cart-badge.component';
import { ImagePickerComponent } from './image-picker/image-picker.component';
import { TruncateWordsPipe } from './pipes/truncate-words.pipe';
import { YoutubePlayerComponent } from './youtube-player/youtube-player.component';
import { SideMenuComponent } from './side-menu/side-menu.component';
import { MyOrderItemComponent } from '../components/my-order-item/my-order-item.component';

@NgModule({
  declarations: [
    ShoppingCartBadgeComponent,
    ImagePickerComponent,
    TruncateWordsPipe,
    YoutubePlayerComponent,
    SideMenuComponent,
    MyOrderItemComponent,
  ],
  imports: [CommonModule, IonicModule],
  exports: [
    ShoppingCartBadgeComponent,
    ImagePickerComponent,
    TruncateWordsPipe,
    YoutubePlayerComponent,
    SideMenuComponent,
    MyOrderItemComponent,
  ],
})
export class SharedModule {}
