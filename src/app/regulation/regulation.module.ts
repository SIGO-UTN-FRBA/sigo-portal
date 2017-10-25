import {NgModule} from "@angular/core";
import {RegulationFaaService} from "./regulation-faa.service";
import {RegulationIcaoService} from "./regulation-icao.service";
import {RegulationService} from "./regulation.service";

@NgModule({
  providers:[
    RegulationService,
    RegulationFaaService,
    RegulationIcaoService
  ]
})

export class RegulationModule {

}
