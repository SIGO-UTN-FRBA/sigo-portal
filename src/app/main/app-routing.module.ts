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
import {RoleGuardService} from '../auth/role-guard.service';

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
    canActivate: [AuthGuardService, RoleGuardService]
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
    canActivate: [AuthGuardService, RoleGuardService]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuardService, RoleGuardService]
  },
  {
    path: 'airports',
    loadChildren: 'app/airport/airport.module#AirportModule',
    canActivate: [AuthGuardService, RoleGuardService]
  },
  {
    path: 'objects',
    loadChildren: 'app/object/object.module#PlacedObjectModule',
    canActivate: [AuthGuardService, RoleGuardService]
  },
  {
    path: 'regulations',
    loadChildren: 'app/regulation/regulation.module#RegulationModule',
    canActivate: [AuthGuardService, RoleGuardService]
  },
  {
    path: 'analysis',
    loadChildren: 'app/analysis/analysis.module#AnalysisModule',
    canActivate: [AuthGuardService, RoleGuardService]
  },
  {
    path: 'owners',
    loadChildren: 'app/owner/owner.module#ObjectOwnerModule',
    canActivate: [AuthGuardService, RoleGuardService]
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
