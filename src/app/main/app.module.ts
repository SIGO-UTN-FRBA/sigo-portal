import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './not-found.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from './home.component';
import {CommonsModule} from '../commons/commons.module';
import {AuthService} from '../auth/auth.service';
import {CallbackComponent} from './callback.component';
import {ProfileComponent} from './profile.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    CallbackComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    CommonsModule
  ],
  exports: [],
  providers: [
    AuthService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
