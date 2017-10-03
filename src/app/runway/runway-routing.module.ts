import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RunwayComponent} from "./runway.component";
import {CommonsModule} from "../commons/commons.module";
import {RunwayNewComponent} from "./runway-new-component";
import {RunwayDetailComponent} from "./runway-detail.component";

const runwayRoutes : Routes = [
  {
    path: '',
    component: RunwayComponent,
    children:[
      {
        path: 'new',
        component: RunwayNewComponent
      },
      {
        path: ':runwayId/detail',
        component: RunwayDetailComponent
      }
    ]
  }
];

@NgModule({
  imports:[
    RouterModule.forChild(runwayRoutes),
    CommonsModule
  ],
  declarations: [],
  exports:[
    RouterModule
  ]
})

export class RunwayRoutingModule{}
