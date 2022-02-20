import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyPaymentsPage } from './my-payments.page';

const routes: Routes = [
  {
    path: '',
    component: MyPaymentsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyPaymentsPageRoutingModule {}
