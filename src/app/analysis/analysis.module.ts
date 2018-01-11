import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {AnalysisService} from "./analysis.service";
import {AnalysisComponent} from "./analysis.component";
import {CommonModule} from "@angular/common";
import { FormsModule }   from '@angular/forms';
import {CommonsModule} from "../commons/commons.module";
import {OlmapModule} from "../olmap/olmap.module";
import {AnalysisRoutingModule} from "./analysis-routing.module";
import {AnalysisCaseSearchComponent} from "./analysis-search.component";
import {AnalysisCaseListComponent} from "./analysis-list.component";
import {AirportService} from "../airport/airport.service";
import {AnalysisWizardAnalysisComponent} from "./analysis-wizard-analysis.component";
import {AnalysisWizardExceptionComponent} from "./analysis-wizard-exception.component";
import {AnalysisWizardInformComponent} from "./analysis-wizard-inform.component";
import {AnalysisWizardObjectComponent} from "./analysis-wizard-object.component";
import {AnalysisCaseService} from "./analysis-case.service";
import {PlacedObjectService} from "../object/object.service";
import {PlacedObjectCatalogService} from "../object/object-catalog.service";
import {BlockUIModule} from "ng-block-ui";
import {BlockTemplateComponent} from "../commons/block-template.component";
import {AnalysisObjectService} from "./analysis-object.service";
import {AnalysisExceptionService} from "../exception/analysis-exception.service";
import {RegulationService} from "../regulation/regulation.service";
import {AnalysisWizardService} from "./analysis-wizard.service";
import {RunwayService} from "../runway/runway.service";
import {DirectionService} from "../direction/direction.service";
import {AnalysisSurfaceService} from "./analysis-surface.service";
import {AnalysisObstacleService} from "./analysis-obstacle.service";

@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    AnalysisRoutingModule,
    CommonsModule,
    OlmapModule,
    BlockUIModule
  ],
  declarations: [
    AnalysisComponent,
    AnalysisCaseSearchComponent,
    AnalysisCaseListComponent,
    AnalysisWizardObjectComponent,
    AnalysisWizardExceptionComponent,
    AnalysisWizardAnalysisComponent,
    AnalysisWizardInformComponent
  ],
  providers: [
    AnalysisCaseService,
    AnalysisService,
    AirportService,
    PlacedObjectService,
    PlacedObjectCatalogService,
    AnalysisObjectService,
    AnalysisExceptionService,
    RegulationService,
    AnalysisWizardService,
    RunwayService,
    DirectionService,
    AnalysisSurfaceService,
    AnalysisObstacleService
  ],
  entryComponents: [
    BlockTemplateComponent
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})

export class AnalysisModule {

}
