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
    DirectionDetailGeneralViewComponent
  ],
  providers:[
    DirectionService,
    OlService,
    OlComponent
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})

export class DirectionModule{}
