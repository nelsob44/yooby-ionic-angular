import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ShoppingCartBadgeComponent } from '../components/shopping-cart-badge/shopping-cart-badge.component';

@NgModule({
  declarations: [ShoppingCartBadgeComponent],
  imports: [CommonModule, IonicModule],
  exports: [ShoppingCartBadgeComponent],
})
export class SharedModule {}
