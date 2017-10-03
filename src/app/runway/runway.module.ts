import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {RunwayComponent} from "./runway.component";
import {RunwayRoutingModule} from "./runway-routing.module";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RunwayService} from "./runway.service";
import {RunwayNewComponent} from "./runway-new-component";
import {RunwayCatalogService} from "./runway-catalog.service";
import {RunwayDetailComponent} from "./runway-detail.component";
import {RunwayDetailGeneralViewComponent} from "./runway-detail-general-view.component";
import {DirectionService} from "../direction/direction.service";
import {RunwayDetailGeneralEditComponent} from "./runway-detail-general-edit.component";

@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    RunwayRoutingModule
  ],
  declarations:[
    RunwayComponent,
    RunwayDetailComponent,
    RunwayNewComponent,
    RunwayDetailGeneralViewComponent,
    RunwayDetailGeneralEditComponent
  ],
  providers:[
    RunwayService,
    RunwayCatalogService,
    DirectionService
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})

export class RunwayModule{}
