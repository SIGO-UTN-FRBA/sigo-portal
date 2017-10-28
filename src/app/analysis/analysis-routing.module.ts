import {RouterModule, Routes} from "@angular/router";
import {AnalysisComponent} from "./analysis.component";
import {NgModule} from "@angular/core";
import {AnalysisCaseSearchComponent} from "./analysis-search.component";
import {AnalysisCaseListComponent} from "./analysis-list.component";

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
