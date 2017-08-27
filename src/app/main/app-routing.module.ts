import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './not-found.component';
import {NgModule} from "@angular/core";
import {HomeComponent} from "./home.component";

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
