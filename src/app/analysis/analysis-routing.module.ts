import {RouterModule, Routes} from "@angular/router";
import {AnalysisComponent} from "./analysis.component";
import {NgModule} from "@angular/core";
import {AnalysisCaseSearchComponent} from "./analysis-search.component";
import {AnalysisCaseListComponent} from "./analysis-list.component";
import {AnalysisWizardObjectComponent} from "./analysis-wizard-object.component";
import {AnalysisWizardExceptionComponent} from "./analysis-wizard-exception.component";
import {AnalysisWizardAnalysisComponent} from "./analysis-wizard-analysis.component";
import {AnalysisWizardInformComponent} from "./analysis-wizard-inform.component";

const analysisRoutes : Routes = [
  {
    path: '',
    component: AnalysisComponent,
    children:[
      {
        path: 'search',
        component: AnalysisCaseSearchComponent,
        children: [
          {
            path: 'list',
            component: AnalysisCaseListComponent
          }
        ]
      },
      {
        path:':analysisId/stages/object',
        component: AnalysisWizardObjectComponent
      },
      {
        path:':analysisId/stages/exception',
        component: AnalysisWizardExceptionComponent
      },
      {
        path:':analysisId/stages/analysis',
        component: AnalysisWizardAnalysisComponent
      },
      {
        path:':analysisId/stages/inform',
        component: AnalysisWizardInformComponent
      },
      {
        path: '',
        redirectTo: 'search'
      }
    ]
  }
];

@NgModule({
  imports:[
    RouterModule.forChild(analysisRoutes)
  ],
  declarations: [],
  exports:[
    RouterModule
  ]
})

export class AnalysisRoutingModule {

}
