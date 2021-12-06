import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SideNavComponent } from './components/side-nav/side-nav.component';
import { ModalComponent } from './components/modal/modal.component';
import { BasketItemComponent } from './components/basket-item/basket-item.component';

//const uri = 'http://localhost:4000/graphql';
const uri = 'https://malamino-backend.herokuapp.com/graphql';

const createApollo: any = (httpLink: HttpLink) => {
  const basic = setContext((operation, context) => ({
    headers: {
      accept: 'charset=utf-8',
    },
  }));

  const auth = setContext((operation, context) => {
    const token = JSON.parse(localStorage.getItem('authDataMalamino'));
    console.log(token);
    if (token === null) {
      return {};
    } else {
      return {
        headers: {
          authorization: `Bearer ${token.accessToken}`,
        },
      };
    }
  });

  const link = ApolloLink.from([
    basic,
    auth,
    httpLink.create({ uri, withCredentials: true }),
  ]);
  const cache = new InMemoryCache();

  return {
    link,
    cache,
  };
};

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    ModalComponent,
    BasketItemComponent,
  ],
  entryComponents: [ModalComponent, BasketItemComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
