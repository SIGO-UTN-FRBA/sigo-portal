import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {DirectionDetailComponent} from "./direction-detail.component";

const directionRoutes : Routes = [

    // TODO /new -> DirectionNewComponent
  {
    path: 'new'
  },
  {
    path: ':directionId/detail',
    data:{
      breadcrumb: {active: true, name: 'direction'}
    },
    component: DirectionDetailComponent
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
