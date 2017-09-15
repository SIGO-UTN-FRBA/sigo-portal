import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }   from '@angular/forms';

import {AirportRoutingModule} from "./airport-routing.module";
import {AirportComponent} from "./airport.component";
import {AirportSearchComponent} from "./airoport-search.component";
import {AirportService} from "./airport.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AirportRoutingModule
  ],
  declarations: [
    AirportComponent,
    AirportSearchComponent
  ],
  providers: [
    AirportService
  ]
})

export class AirportModule{}
