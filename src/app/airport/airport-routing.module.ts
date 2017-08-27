import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {AirportComponent} from "./airport.component";

const airportRoutes : Routes = [
  {
    path: '',
    component: AirportComponent
  }
];

@NgModule({
  imports:[
    RouterModule.forChild(airportRoutes)
  ],
  exports:[
    RouterModule
  ]
})

export class AirportRoutingModule{}
