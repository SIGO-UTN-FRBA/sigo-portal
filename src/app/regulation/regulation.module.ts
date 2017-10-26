import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {RegulationFaaService} from "./regulation-faa.service";
import {RegulationIcaoService} from "./regulation-icao.service";
import {RegulationService} from "./regulation.service";
import {RegulationRoutingModule} from "./regulation-routing.module";
import {CommonsModule} from "../commons/commons.module";
import {CommonModule} from "@angular/common";
import {RegulationComponent} from "./regulation.component";
import {RegulationListComponent} from "./regulation-list.component";
import {FilterRulesBySurface, RegulationDetailICAOComponent} from "./regulation-detail-icao.component";
import {FormsModule} from "@angular/forms";

@NgModule({

  imports: [
    FormsModule,
    CommonModule,
    CommonsModule,
    RegulationRoutingModule
  ],
  declarations: [
    RegulationComponent,
    RegulationListComponent,
    RegulationDetailICAOComponent,
    FilterRulesBySurface
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
