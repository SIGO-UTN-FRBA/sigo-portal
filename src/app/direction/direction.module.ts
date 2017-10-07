import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {DirectionDetailComponent} from "./direction-detail.component";
import {DirectionService} from "./direction.service";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {CommonsModule} from "../commons/commons.module";
import {OlmapModule} from "../olmap/olmap.module";
import {OlComponent} from "../olmap/ol.component";
import {OlService} from "../olmap/ol.service";
import {DirectionDetailGeneralViewComponent} from "./direction-detail-general-view.component";
import {DirectionComponent} from "./direction.component";
import {DirectionRoutingModule} from "./direction-routing.module";
import {DirectionDetailGeneralEditComponent} from "./direction-detail-general-edit-component";
import {DirectionDetailApproachViewComponent} from "./direction-detail-approach-view-component";
import {DirectionCatalogService} from "./direction-catalog.service";

@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    CommonsModule,
    OlmapModule,
    DirectionRoutingModule
  ],
  declarations:[
    DirectionComponent,
    DirectionDetailComponent,
    DirectionDetailGeneralViewComponent,
    DirectionDetailGeneralEditComponent,
    DirectionDetailApproachViewComponent
  ],
  providers:[
    DirectionService,
    OlService,
    OlComponent,
    DirectionCatalogService
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})

export class DirectionModule{}
