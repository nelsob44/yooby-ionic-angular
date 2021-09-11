import { Component, OnInit } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
})
export class SideNavComponent implements OnInit {
  constructor(private menu: MenuController, private router: Router) {}

  ngOnInit() {}

  menuClick(menuItem: string) {
    this.router.navigate([`/${menuItem}`]);
  }
  powerClick() {
    console.log('clicked power button');
  }
  openMenu() {
    this.menu.open();
  }
}
