import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {RegulationFaaService} from "./regulation-faa.service";
import {RegulationIcaoService} from "./regulation-icao.service";
import {RegulationService} from "./regulation.service";
import {RegulationRoutingModule} from "./regulation-routing.module";
import {CommonsModule} from "../commons/commons.module";
import {CommonModule} from "@angular/common";
import {RegulationComponent} from "./regulation.component";
import {RegulationListComponent} from "./regulation-list.component";
import {RegulationDetailComponent} from "./regulation-detail.component";

@NgModule({

  imports: [
    CommonModule,
    CommonsModule,
    RegulationRoutingModule
  ],
  declarations: [
    RegulationComponent,
    RegulationListComponent,
    RegulationDetailComponent
  ],
  providers:[
    RegulationService,
    RegulationFaaService,
    RegulationIcaoService
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})

export class RegulationModule {

}
