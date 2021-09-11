import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyMissionsPage } from './my-missions.page';

const routes: Routes = [
  {
    path: '',
    component: MyMissionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyMissionsPageRoutingModule {}
