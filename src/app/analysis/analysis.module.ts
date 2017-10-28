import {NgModule} from "@angular/core";
import {AnalysisCaseService} from "./analysisCase.service";
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

@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    AnalysisRoutingModule,
    CommonsModule,
    OlmapModule
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
    AirportService
  ]
})

export class AnalysisModule {

}
