import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  previousAuthState = false;
  private authSub: Subscription;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authSub = this.authService.userAuthenticated.subscribe((user) => {
      if (user) {
        this.previousAuthState = true;
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
