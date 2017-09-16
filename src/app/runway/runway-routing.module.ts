import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RunwayDetailComponent} from "./runway.component";

const runwayRoutes : Routes = [
  {
    path: ':runwayId',
    component: RunwayDetailComponent
  }
];

@NgModule({
  imports:[
    RouterModule.forChild(runwayRoutes)
  ],
  declarations: [],
  exports:[
    RouterModule
  ]
})

export class RunwayRoutingModule{}
