import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RunwayDetailComponent} from "./runway.component";
import {CommonsModule} from "../commons/commons.module";
import {RunwayNewComponent} from "./runway-new-component";

const runwayRoutes : Routes = [
  {
    path: 'new',
    component: RunwayNewComponent
  },
  {
    path: ':runwayId/detail',
    component: RunwayDetailComponent
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
