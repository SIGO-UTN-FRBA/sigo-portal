import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {AirportComponent} from "./airport.component";
import {AirportSearchComponent} from "./airoport-search.component";
import {AirportListComponent} from "./airport-list.component";
import {AirportDetailComponent} from "./airport-detail.component";
import {AirportDetailEditionComponent} from "./airport-detail-edition.component";
import {AirportDetailViewComponent} from "./airport-detail-view.component";

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
        path: ':airportId',
        component: AirportDetailComponent,
        children: [
          {
            path: 'view',
            component: AirportDetailViewComponent
          },
          {
            path: 'edit',
            component: AirportDetailEditionComponent
          },
          {
            path: '',
            redirectTo: 'view'
          }
        ]
      },
      {
        path: ':airportId/runways',
        loadChildren: 'app/runway/runway.module#RunwayModule'
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
