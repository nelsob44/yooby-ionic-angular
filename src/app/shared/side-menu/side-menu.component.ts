import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit, OnDestroy {
  authSub: Subscription;
  adminSub: Subscription;
  isLoggedIn = false;
  isAdmin = false;
  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.authSub = this.authService.userAuthenticated.subscribe((data) => {
      this.isLoggedIn = data;
    });

    this.adminSub = this.authService.userIsAdmin.subscribe((val) => {
      this.isAdmin = val;
    });
  }

  menuClick(menuItem: string) {
    if (menuItem !== 'auth') {
      this.router.navigate([`/${menuItem}`]);
    } else {
      if (!this.isLoggedIn) {
        this.router.navigate([`/${menuItem}`]);
      } else {
        this.isLoggedIn = false;
        this.authService.logout();
      }
    }
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    if (this.adminSub) {
      this.adminSub.unsubscribe();
    }
  }
}
