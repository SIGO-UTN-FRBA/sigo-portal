import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule }   from '@angular/common';
import { FormsModule }   from '@angular/forms';

import {AirportRoutingModule} from "./airport-routing.module";
import {AirportComponent} from "./airport.component";
import {AirportSearchComponent} from "./airoport-search.component";
import {AirportService} from "./airport.service";
import {AirportListComponent} from "./airport-list.component";
import {AirportDetailComponent} from "./airport-detail.component";
import {RunwayService} from "../runway/runway.service";
import {AirportDetailGeneralViewComponent} from "./airport-detail-general-view.component";
import {AirportDetailGeneralEditionComponent} from "./airport-detail-general-edition.component";
import {CommonsModule} from "../commons/commons.module";
import {AirportDetailChildren} from "./airport-detail-children";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AirportRoutingModule,
    CommonsModule
  ],
  declarations: [
    AirportComponent,
    AirportSearchComponent,
    AirportListComponent,
    AirportDetailComponent,
    AirportDetailGeneralViewComponent,
    AirportDetailGeneralEditionComponent,
    AirportDetailChildren
  ],
  providers: [
    AirportService,
    RunwayService
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AirportModule{}
