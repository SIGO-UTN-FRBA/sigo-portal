import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {Http, HttpModule, RequestOptions} from '@angular/http';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './not-found.component';
import {AppRoutingModule} from './app-routing.module';
import {HomeComponent} from '../home/home.component';
import {CommonsModule} from '../commons/commons.module';
import {AuthService} from '../auth/auth.service';
import {CallbackComponent} from './callback.component';
import {ProfileComponent} from './profile.component';
import {AuthConfig, AuthHttp} from 'angular2-jwt';
import {AuthGuardService} from '../auth/auth-guard.service';
import {UnauthorizedComponent} from './unauthorized.component';
import {UnauthenticatedComponent} from './unauthenticated.component';
import {WelcomeComponent} from './welcome.component';
import {RoleGuardService} from '../auth/role-guard.service';
import {AnalysisService} from '../analysis/analysis.service';
import {AnalysisWizardService} from '../analysis/analysis-wizard.service';
import {HomeModule} from '../home/home.module';


export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    noTokenScheme: true,
    tokenGetter: (() => localStorage.getItem('access_token'))
  }), http, options);
}

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    CallbackComponent,
    ProfileComponent,
    UnauthorizedComponent,
    UnauthenticatedComponent,
    WelcomeComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AppRoutingModule,
    CommonsModule,
    HomeModule
  ],
  exports: [],
  providers: [
    AuthService,
    {
      provide: AuthHttp,
      useFactory: authHttpServiceFactory,
      deps: [Http, RequestOptions]
    },
    AuthGuardService,
    RoleGuardService
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }
