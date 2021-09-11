import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvailableMissionsPage } from './available-missions.page';

const routes: Routes = [
  {
    path: '',
    component: AvailableMissionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvailableMissionsPageRoutingModule {}
