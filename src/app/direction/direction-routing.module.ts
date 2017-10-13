import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {DirectionDetailComponent} from "./direction-detail.component";
import {DirectionNewComponent} from "./direction-new-component";

const directionRoutes : Routes = [

  {
    path: 'new',
    component: DirectionNewComponent
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
