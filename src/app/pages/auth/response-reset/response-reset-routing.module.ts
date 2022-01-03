import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResponseResetPage } from './response-reset.page';

const routes: Routes = [
  {
    path: '',
    component: ResponseResetPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResponseResetPageRoutingModule {}
