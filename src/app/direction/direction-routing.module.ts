import {RouterModule, Routes} from "@angular/router";
import {DirectionComponent} from "./direction.component";
import {NgModule} from "@angular/core";
import {DirectionDetailComponent} from "./direction-detail.component";

const directionRoutes : Routes = [
  {
    path: '',
    component: DirectionComponent,
    children: [
      // TODO /new -> DirectionNewComponent
      {
        path: ':directionId/detail',
        component: DirectionDetailComponent
      }
    ]
  }
];

@NgModule({
  imports:[
    RouterModule.forChild(directionRoutes)
  ],
  declarations: [],
  exports:[
    RouterModule
  ]
})

export class DirectionRoutingModule {

}
