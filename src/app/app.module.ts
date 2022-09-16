import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { MyFavoritesComponent } from './components/my-favorites/my-favorites.component';
import { DataCardComponent } from './components/data-card/data-card.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoaderComponent } from './loader/loader.component';
import { ErrorHandingInterceptor } from './interceptors/error-handling-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    MyFavoritesComponent,
    DataCardComponent,
    NavbarComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorHandingInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
