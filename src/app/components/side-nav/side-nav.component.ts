import { Component, OnDestroy, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit, OnDestroy {
  nameSub: Subscription;
  firstName;
  constructor(
    private menu: MenuController,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.nameSub = this.authService.firstName.subscribe((data) => {
      this.firstName = data;
    });
  }

  menuClick(menuItem: string) {
    this.router.navigate([`/${menuItem}`]);
  }
  powerClick() {
    console.log('clicked power button');
  }
  openMenu() {
    this.menu.open();
  }

  ngOnDestroy() {
    if (this.nameSub) {
      this.nameSub.unsubscribe();
    }
  }
}
