import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';

import {AirportRoutingModule} from "./airport-routing.module";
import {AirportComponent} from "./airport.component";

@NgModule({
  imports: [
    CommonModule,
    AirportRoutingModule
  ],
  declarations: [
    AirportComponent
  ]
})

export class AirportModule{}
