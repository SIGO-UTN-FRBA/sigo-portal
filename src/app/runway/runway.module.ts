import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {RunwayRoutingModule} from './runway-routing.module';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RunwayService} from './runway.service';
import {RunwayNewComponent} from './runway-new-component';
import {RunwayCatalogService} from './runway-catalog.service';
import {RunwayDetailComponent} from './runway-detail.component';
import {RunwayDetailGeneralViewComponent} from './runway-detail-general-view.component';
import {DirectionService} from '../direction/direction.service';
import {RunwayDetailGeneralEditComponent} from './runway-detail-general-edit.component';
import {RunwayDetailGeometryViewComponent} from './runway-detail-geometry-view.component';
import {OlComponent} from "../olmap/ol.component";
import {OlService} from "../olmap/ol.service";
import {OlmapModule} from "../olmap/olmap.module";
import {CommonsModule} from "../commons/commons.module";
import {RunwayDetailGeometryEditComponent} from "./runway-detail-geometry-edit.component";
import {RunwayDetailChildren} from "./runway-detail-children";
import {RunwayDetailStripViewComponent} from "./runway-detail-strip-view.component";
import {RunwayDetailStripEditComponent} from "./runway-detail-strip-edit.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RunwayRoutingModule,
    CommonsModule,
    OlmapModule
  ],
  declarations: [
    RunwayDetailComponent,
    RunwayNewComponent,
    RunwayDetailGeneralViewComponent,
    RunwayDetailGeneralEditComponent,
    RunwayDetailStripViewComponent,
    RunwayDetailStripEditComponent,
    RunwayDetailGeometryViewComponent,
    RunwayDetailGeometryEditComponent,
    RunwayDetailChildren
  ],
  providers: [
    RunwayService,
    RunwayCatalogService,
    DirectionService,
    OlService,
    OlComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})

export class RunwayModule {

}
