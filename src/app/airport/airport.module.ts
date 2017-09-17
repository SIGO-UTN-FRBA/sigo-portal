import { NgModule }       from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }   from '@angular/forms';

import {AirportRoutingModule} from "./airport-routing.module";
import {AirportComponent} from "./airport.component";
import {AirportSearchComponent} from "./airoport-search.component";
import {AirportService} from "./airport.service";
import {AirportListComponent} from "./airport-list.component";
import {AirportDetailComponent} from "./airport-detail.component";
import {RunwayService} from "../runway/runway.service";
import {AirportDetailViewComponent} from "./airport-detail-view.component";
import {AirportDetailEditionComponent} from "./airport-detail-edition.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AirportRoutingModule
  ],
  declarations: [
    AirportComponent,
    AirportSearchComponent,
    AirportListComponent,
    AirportDetailComponent,
    AirportDetailViewComponent,
    AirportDetailEditionComponent
  ],
  providers: [
    AirportService,
    RunwayService
  ]
})

export class AirportModule{}
