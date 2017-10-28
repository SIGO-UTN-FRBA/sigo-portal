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
    AnalysisCaseListComponent
  ],
  providers: [
    AnalysisCaseService
  ]
})

export class AnalysisModule {

}
