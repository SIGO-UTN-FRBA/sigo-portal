import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RegulationComponent} from "./regulation.component";
import {RegulationListComponent} from "./regulation-list.component";
import {CommonsModule} from "../commons/commons.module";

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
        path: ':regulationId/detail',
        component: RegulationListComponent,
        data:{
          breadcrumb: {active: true, name: 'Regulation'}
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
