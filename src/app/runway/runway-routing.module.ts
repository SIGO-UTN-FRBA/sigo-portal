import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RunwayDetailComponent} from "./runway.component";
import {CommonsModule} from "../commons/commons.module";

const runwayRoutes : Routes = [
  {
    path: ':runwayId',
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
