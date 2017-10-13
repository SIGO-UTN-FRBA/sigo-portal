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
import {DirectionRoutingModule} from "./direction-routing.module";
import {DirectionDetailGeneralEditComponent} from "./direction-detail-general-edit-component";
import {DirectionDetailApproachViewComponent} from "./direction-detail-approach-view-component";
import {DirectionCatalogService} from "./direction-catalog.service";
import {DirectionDetailGeometryViewComponent} from "./direction-detail-geometry-view.component";
import {DirectionDetailGeometryEditComponent} from "./direction-detail-geometry-edit.component";
import {DirectionDetailTakeoffViewComponent} from "./direction-detail-takeoff-view.component";
import {DirectionDetailApproachEditComponent} from "./direction-detail-approach-edit-component";
import {DirectionDetailTakeoffEditComponent} from "./direction-detail-takeoff-edit.component";
import {DirectionDetailDistancesViewComponent} from "./direction-detail-distances-view.component";
import {DirectionNewComponent} from "./direction-new-component";


@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    CommonsModule,
    OlmapModule,
    DirectionRoutingModule
  ],
  declarations:[
    DirectionDetailComponent,
    DirectionDetailGeneralViewComponent,
    DirectionDetailGeneralEditComponent,
    DirectionDetailApproachViewComponent,
    DirectionDetailApproachEditComponent,
    DirectionDetailTakeoffViewComponent,
    DirectionDetailTakeoffEditComponent,
    DirectionDetailGeometryViewComponent,
    DirectionDetailGeometryEditComponent,
    DirectionDetailDistancesViewComponent,
    DirectionNewComponent
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
