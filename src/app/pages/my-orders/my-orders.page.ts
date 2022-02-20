import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AlertController,
  IonicSafeString,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { Order } from 'src/app/interfaces/order';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { OrdersService } from 'src/app/services/orders.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
})
export class MyOrdersPage implements OnInit, OnDestroy {
  loadedOrders: Order[];
  itemsPerPage = environment.itemsPerPage;
  totalItems = 0;
  offset = 1;
  hasNextPage = false;
  hasPrevPage = false;
  isLoading = false;
  numberOfPages = 1;
  private myOrdersSub: Subscription;
  constructor(
    private service: OrdersService,
    private loadingCtrl: LoadingController,
    public modalController: ModalController,
    private alertController: AlertController
  ) {}

  nextPage() {
    this.offset++;
    this.retrieveData(this.offset, this.itemsPerPage);
  }

  prevPage() {
    this.offset--;
    this.retrieveData(this.offset, this.itemsPerPage);
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.retrieveData(1, this.itemsPerPage);
  }

  ngOnDestroy() {
    if (this.myOrdersSub) {
      this.myOrdersSub.unsubscribe();
    }
  }

  async presentAlert(alertMessage: string, head: string) {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: head,
      message: new IonicSafeString(alertMessage),
      translucent: true,
      buttons: ['OK'],
    });

    await alert.present();

    const { role } = await alert.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  private retrieveData(offsetValue: number, itemsPerPageValue: number) {
    this.loadingCtrl
      .create({ keyboardClose: true, message: 'Retrieving orders....' })
      .then((loadingEl) => {
        loadingEl.present();

        this.myOrdersSub = this.service
          .fetchMyOrders(offsetValue, itemsPerPageValue)
          .valueChanges.subscribe(
            (data) => {
              console.log(data.data);
              if (data.data) {
                this.loadedOrders = data.data.getMyOrders.order;
                this.service.myOrders.next(data.data.getMyOrders.order);
                this.totalItems = data.data.getMyOrders.totalItems;
                this.numberOfPages = Math.ceil(
                  this.totalItems / this.itemsPerPage
                );
                if (this.numberOfPages > this.offset) {
                  this.hasNextPage = true;
                } else {
                  this.hasNextPage = false;
                }
                if (this.offset > 1) {
                  this.hasPrevPage = true;
                } else {
                  this.hasPrevPage = false;
                }
                if (this.loadedOrders.length < 1) {
                  this.presentAlert(
                    '<p style=color:white;>You have no active orders to view</p>',
                    'Notice'
                  );
                }
              }
              loadingEl.dismiss();
            },
            (error) => {
              if (error) {
                this.presentAlert(
                  '<p style=color:white;>' + error + '</p>',
                  'Error'
                );
              }
              loadingEl.dismiss();
            }
          );
      });
  }
}
