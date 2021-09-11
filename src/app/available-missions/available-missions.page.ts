import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import Product from '../interfaces/product';
import { StarWarsService } from '../services/star-wars.service';

@Component({
  selector: 'app-available-missions',
  templateUrl: './available-missions.page.html',
  styleUrls: ['./available-missions.page.scss'],
})
export class AvailableMissionsPage implements OnInit, OnDestroy {
  private productsSub: Subscription;
  private loadedProducts: Product[];
  constructor(
    private service: StarWarsService,
    private loadingCtrl: LoadingController
  ) {}

  ngOnInit() {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Retrieving products....' })
      .then((loadingEl) => {
        loadingEl.present();

        this.productsSub = this.service.fetchProducts().subscribe(
          (items) => {
            this.loadedProducts = items;
            loadingEl.dismiss();
          },
          (errorResponse) => {
            alert('sorry there was an error retrieving the products');
            console.log(errorResponse);
            loadingEl.dismiss();
          }
        );
      });
  }

  ngOnDestroy() {
    if (this.productsSub) {
      this.productsSub.unsubscribe();
    }
  }
}
