import {NgModule} from "@angular/core";
import {RegulationFaaService} from "./regulation-faa.service";
import {RegulationIcaoService} from "./regulation-icao.service";

@NgModule({
  providers:[
    RegulationFaaService,
    RegulationIcaoService
  ]
})

export class RegulationModule {

}
