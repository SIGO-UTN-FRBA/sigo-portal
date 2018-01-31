import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './not-found.component';
import {NgModule} from '@angular/core';
import {HomeComponent} from './home.component';
import {CallbackComponent} from './callback.component';
import {ProfileComponent} from './profile.component';
import {AuthGuardService} from '../auth/auth-guard.service';
import {UnauthorizedComponent} from './unauthorized.component';
import {UnauthenticatedComponent} from './unauthenticated.component';
import {WelcomeComponent} from './welcome.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    component: WelcomeComponent
  },
  { path: 'callback',
    component: CallbackComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'unauthenticated',
    component: UnauthenticatedComponent
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: 'airports',
    loadChildren: 'app/airport/airport.module#AirportModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'objects',
    loadChildren: 'app/object/object.module#PlacedObjectModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'regulations',
    loadChildren: 'app/regulation/regulation.module#RegulationModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'analysis',
    loadChildren: 'app/analysis/analysis.module#AnalysisModule',
    canActivate: [AuthGuardService]
  },
  {
    path: 'owners',
    loadChildren: 'app/owner/owner.module#ObjectOwnerModule',
    canActivate: [AuthGuardService]
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ]
})

export class AppRoutingModule { }
