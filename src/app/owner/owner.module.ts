import {NgModule} from "@angular/core";
import {ObjectOwnerService} from "./owner.service";
import {ObjectOwnerDetailComponent} from "./owner-detail.component";
import {ObjectOwnerDetailGeneralViewComponent} from "./owner-detail-general-view.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {CommonsModule} from "../commons/commons.module";
import {ObjectOwnerDetailGeneralEditComponent} from "./owner-detail-general-edit.component";
import {ObjectOwnerRoutingModule} from "./owner-routing.module";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonsModule,
    ObjectOwnerRoutingModule
  ],
  declarations: [
    ObjectOwnerDetailComponent,
    ObjectOwnerDetailGeneralViewComponent,
    ObjectOwnerDetailGeneralEditComponent
  ],
  providers: [
    ObjectOwnerService
  ]
})

  export class ObjectOwnerModule {

}
