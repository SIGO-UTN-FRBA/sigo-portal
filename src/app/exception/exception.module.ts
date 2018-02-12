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
import {AnalysisExceptionService} from "./exception.service";
import {AirportService} from "../airport/airport.service";
import {RegulationIcaoService} from "../regulation/regulation-icao.service";
import {RegulationFaaService} from "../regulation/regulation-faa.service";
import {ExceptionDetailRuleIcao14Component} from "./exception-detail-rule-icao.component";
import {ExceptionDetailRuleIcaoEditComponent} from "./exception-detail-rule-icao-edit.component";
import {ExceptionDetailRuleIcaoViewComponent} from "./exception-detail-rule-icao-view.component";
import {ExceptionNewDynamicSurfaceComponent} from "./exception-new-dynamic_surface.component";
import {DirectionClassificationService} from "../direction/direction-classification.service";
import {RunwayService} from "../runway/runway.service";
import {DirectionService} from "../direction/direction.service";
import {ExceptionDetailSurfaceComponent} from './exception-detail-surface.component';
import {ExceptionDetailSurfaceViewComponent} from './exception-detail-surface-view.component';
import {AnalysisExceptionSurfaceService} from './exception-surface.service';
import {AnalysisExceptionRuleService} from './exception-rule.service';
import {ExceptionDetailSurfaceEditComponent} from './exception-detail-surface-edit.component';

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
    ExceptionDetailRuleIcao14Component,
    ExceptionDetailRuleIcaoViewComponent,
    ExceptionDetailRuleIcaoEditComponent,
    ExceptionDetailSurfaceComponent,
    ExceptionDetailSurfaceViewComponent,
    ExceptionDetailSurfaceEditComponent
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
    DirectionService,
    AnalysisExceptionSurfaceService,
    AnalysisExceptionRuleService,
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})

export class ExceptionModule {

}
