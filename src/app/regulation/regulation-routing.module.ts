import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RegulationComponent} from "./regulation.component";
import {RegulationListComponent} from "./regulation-list.component";
import {CommonsModule} from "../commons/commons.module";
import {RegulationDetailICAOComponent} from "./regulation-detail-icao.component";

const regulationRoutes : Routes = [
  {
    path: '',
    component: RegulationComponent,
    children: [
      {
        path: 'list',
        component: RegulationListComponent,
        data:{
          breadcrumb: {active: true, name: 'Search'}
        }
      },
      {
        path: '0/detail',
        component: RegulationDetailICAOComponent,
        data:{
          breadcrumb: {active: true, name: 'ICAO Annex 14'}
        }
      },
      {
        path: '',
        redirectTo: 'list'
      }
    ]
  }
];

@NgModule({
  imports:[
    RouterModule.forChild(regulationRoutes),
    CommonsModule
  ],
  declarations: [],
  exports:[
    RouterModule
  ]
})

export class RegulationRoutingModule {

}
