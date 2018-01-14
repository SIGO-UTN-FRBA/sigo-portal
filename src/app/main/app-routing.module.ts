import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './not-found.component';
import {NgModule} from '@angular/core';
import {HomeComponent} from './home.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'airports',
    loadChildren: 'app/airport/airport.module#AirportModule'
  },
  {
    path: 'objects',
    loadChildren: 'app/object/object.module#PlacedObjectModule'
  },
  {
    path: 'regulations',
    loadChildren: 'app/regulation/regulation.module#RegulationModule'
  },
  {
    path: 'analysis',
    loadChildren: 'app/analysis/analysis.module#AnalysisModule'
  },
  {
    path: 'owners',
    loadChildren: 'app/owner/owner.module#ObjectOwnerModule'
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
