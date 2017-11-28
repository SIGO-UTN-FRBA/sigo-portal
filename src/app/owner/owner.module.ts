import {NgModule} from "@angular/core";
import {ObjectOwnerService} from "./owner.service";
import {ObjectOwnerDetailComponent} from "./owner-detail.component";
import {objectOwnerDetailGeneralViewComponent} from "./owner-detail-general.view.component";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {CommonsModule} from "../commons/commons.module";
import {objectOwnerDetailGeneralEditComponent} from "./owner-detail-general.edit.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CommonsModule
  ],
  declarations: [
    ObjectOwnerDetailComponent,
    objectOwnerDetailGeneralViewComponent,
    objectOwnerDetailGeneralEditComponent
  ],
  providers: [
    ObjectOwnerService
  ]
})

export class ObjectOwnerModule {

}
