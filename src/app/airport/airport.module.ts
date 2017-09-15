import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }   from '@angular/forms';

import {AirportRoutingModule} from "./airport-routing.module";
import {AirportComponent} from "./airport.component";
import {AirportSearchComponent} from "./airoport-search.component";
import {AirportService} from "./airport.service";
import {AirportListComponent} from "./airport-list.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AirportRoutingModule
  ],
  declarations: [
    AirportComponent,
    AirportSearchComponent,
    AirportListComponent
  ],
  providers: [
    AirportService
  ]
})

export class AirportModule{}
