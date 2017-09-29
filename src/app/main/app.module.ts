import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule }    from '@angular/http';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './not-found.component';
import {AppRoutingModule} from "./app-routing.module";
import {HomeComponent} from "./home.component";
import {NavbarComponent} from "./navbar.component";
import {CommonsModule} from "../commons/commons.module";


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PageNotFoundComponent,
    NavbarComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    CommonsModule
  ],
  exports: [],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
