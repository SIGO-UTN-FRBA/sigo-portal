import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {CommonsModule} from "../commons/commons.module";
import {ObjectOwnerDetailComponent} from "./owner-detail.component";

const objectOwnerRoutes : Routes = [
  {
    path: ':objectOwnerId/detail',
    component: ObjectOwnerDetailComponent,
    data:{
      breadcrumb: { name: 'owner', active: true}
      }
}
];

@NgModule({
  imports:[
    RouterModule.forChild(objectOwnerRoutes),
    CommonsModule
  ],
  declarations: [],
  exports:[
    RouterModule
  ]
})

export class ObjectOwnerRoutingModule {

}
