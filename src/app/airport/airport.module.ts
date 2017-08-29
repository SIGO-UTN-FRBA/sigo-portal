import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }   from '@angular/forms';

import {AirportRoutingModule} from "./airport-routing.module";
import {AirportComponent} from "./airport.component";
import {AirportFinderComponent} from "./finder.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AirportRoutingModule
  ],
  declarations: [
    AirportComponent,
    AirportFinderComponent
  ]
})

export class AirportModule{}
