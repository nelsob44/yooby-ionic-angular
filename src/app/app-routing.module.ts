import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.module').then((m) => m.AuthPageModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/dashboard/dashboard.module').then(
        (m) => m.DashboardPageModule
      ),
  },
  {
    path: 'photos',
    loadChildren: () =>
      import('./pages/photos/photos.module').then((m) => m.PhotosPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: 'available-products',
    loadChildren: () =>
      import('./pages/available-products/available-products.module').then(
        (m) => m.AvailableProductsPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'chat',
    loadChildren: () =>
      import('./pages/chat/chat.module').then((m) => m.ChatPageModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'my-products',
    loadChildren: () =>
      import('./pages/my-products/my-products.module').then(
        (m) => m.MyProductsPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'product-detail/:id',
    loadChildren: () =>
      import('./pages/product-detail/product-detail.module').then(
        (m) => m.ProductDetailPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'add-product',
    loadChildren: () =>
      import('./pages/add-product/add-product.module').then(
        (m) => m.AddProductPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-product/:id',
    loadChildren: () =>
      import('./pages/edit-product/edit-product.module').then(
        (m) => m.EditProductPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'user-profile',
    loadChildren: () =>
      import('./pages/user-profile/user-profile.module').then(
        (m) => m.UserProfilePageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'edit-user-profile/:userId',
    loadChildren: () =>
      import('./pages/edit-user-profile/edit-user-profile.module').then(
        (m) => m.EditUserProfilePageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'credit-my-account',
    loadChildren: () =>
      import('./pages/credit-my-account/credit-my-account.module').then(
        (m) => m.CreditMyAccountPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'my-payments',
    loadChildren: () =>
      import('./pages/my-payments/my-payments.module').then(
        (m) => m.MyPaymentsPageModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'my-orders',
    loadChildren: () =>
      import('./pages/my-orders/my-orders.module').then(
        (m) => m.MyOrdersPageModule
      ),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
