import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {AirportComponent} from "./airport.component";
import {AirportSearchComponent} from "./airport-search.component";
import {AirportListComponent} from "./airport-list.component";
import {AirportDetailComponent} from "./airport-detail.component";
import {AirportNewComponent} from "./airport-new-component";

const airportRoutes : Routes = [
  {
    path: '',
    component: AirportComponent,
    children:[
      {
        path: 'search',
        component: AirportSearchComponent,
        children: [
          {
            path: 'list',
            component: AirportListComponent
          }
        ]
      },
      {
        path: 'new',
        component: AirportNewComponent
      },
      {
        path: ':airportId',
        data:{
          breadcrumb: { active: true, name: 'airport'}
        },
        children: [
          {
            path: 'detail',
            component: AirportDetailComponent,
            data:{
              breadcrumb: { active: false}
            },
          },
          {
            path: 'runways',
            loadChildren: 'app/runway/runway.module#RunwayModule',
            data:{
              breadcrumb: { active: false}
            },
          },
          {
            path: '',
            redirectTo: 'detail'
          }
        ]
      },
      {
        path: '',
        redirectTo: 'search'
      }
    ]
  }
];

@NgModule({
  imports:[
    RouterModule.forChild(airportRoutes)
  ],
  declarations: [],
  exports:[
    RouterModule
  ]
})

export class AirportRoutingModule{}
