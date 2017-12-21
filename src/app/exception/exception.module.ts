import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {OlmapModule} from "../olmap/olmap.module";
import {CommonsModule} from "../commons/commons.module";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ExceptionRoutingModule} from "./exception-routing.module";
import {ExceptionComponent} from "./exception.component";
import {ExceptionNewComponent} from "./exception-new.component";
import {ExceptionNewRuleComponent} from "./exception-new-rule.component";
import {ExceptionNewSurfaceComponent} from "./exception-new-surface.component";
import {ExceptionNewRuleIcao14Component} from "./exception-new-rule-icao.component";
import {RegulationService} from "../regulation/regulation.service";
import {AnalysisService} from "../analysis/analysis.service";
import {AnalysisExceptionService} from "./analysis-exception.service";
import {AirportService} from "../airport/airport.service";
import {RegulationIcaoService} from "../regulation/regulation-icao.service";
import {RegulationFaaService} from "../regulation/regulation-faa.service";
import {ExceptionDetailRuleIcao14} from "./exception-detail-rule-icao.component";
import {ExceptionDetailRuleIcaoEdit} from "./exception-detail-rule-icao-edit.component";
import {ExceptionDetailRuleIcaoView} from "./exception-detail-rule-icao-view.component";
import {ExceptionNewDynamicSurfaceComponent} from "./exception-new-dynamic_surface.component";
import {DirectionClassificationService} from "../direction/direction-classification.service";
import {RunwayService} from "../runway/runway.service";
import {DirectionService} from "../direction/direction.service";

@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    CommonsModule,
    OlmapModule,
    ExceptionRoutingModule
  ],
  declarations: [
    ExceptionComponent,
    ExceptionNewComponent,
    ExceptionNewRuleComponent,
    ExceptionNewRuleIcao14Component,
    ExceptionNewSurfaceComponent,
    ExceptionNewDynamicSurfaceComponent,
    ExceptionDetailRuleIcao14,
    ExceptionDetailRuleIcaoView,
    ExceptionDetailRuleIcaoEdit
  ],
  providers: [
    RegulationService,
    AnalysisService,
    AnalysisExceptionService,
    AirportService,
    RegulationIcaoService,
    RegulationFaaService,
    DirectionClassificationService,
    RunwayService,
    DirectionService
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})

export class ExceptionModule {

}
