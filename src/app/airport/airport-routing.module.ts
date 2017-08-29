import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {AirportComponent} from "./airport.component";
import {AirportFinderComponent} from "./finder.component";

const airportRoutes : Routes = [
  {
    path: '',
    component: AirportComponent,
    children:[
      {
        path: 'finder',
        component: AirportFinderComponent
      },
      {
        path: '',
        redirectTo: 'finder'
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
