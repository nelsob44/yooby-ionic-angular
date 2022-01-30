import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreditMyAccountPage } from './credit-my-account.page';

const routes: Routes = [
  {
    path: '',
    component: CreditMyAccountPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreditMyAccountPageRoutingModule {}
