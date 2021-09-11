import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  public authType: string;
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.authType = this.activatedRoute.snapshot.paramMap.get('authType');
  }
}
