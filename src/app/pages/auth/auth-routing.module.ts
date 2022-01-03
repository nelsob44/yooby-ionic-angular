import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthPage } from './auth.page';

const routes: Routes = [
  {
    path: '',
    component: AuthPage,
  },
  {
    path: 'request-reset',
    loadChildren: () => import('./request-reset/request-reset.module').then( m => m.RequestResetPageModule)
  },
  {
    path: 'response-reset',
    loadChildren: () => import('./response-reset/response-reset.module').then( m => m.ResponseResetPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthPageRoutingModule {}
