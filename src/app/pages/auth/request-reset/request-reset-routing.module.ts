import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequestResetPage } from './request-reset.page';

const routes: Routes = [
  {
    path: '',
    component: RequestResetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RequestResetPageRoutingModule {}
