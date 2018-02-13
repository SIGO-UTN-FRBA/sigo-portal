import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {OlmapModule} from "../olmap/olmap.module";
import {FormsModule} from "@angular/forms";
import {CommonsModule} from "../commons/commons.module";
import {PlacedObjectRoutingModule} from "./object-routing.module";
import {ObjectSearchComponent} from "./object-search.component";
import {PlacedObjectComponent} from "./object.component";
import {OlService} from "../olmap/ol.service";
import {OlComponent} from "../olmap/ol.component";
import {ObjectListComponent} from "./object-list.component";
import {PlacedObjectDetailComponent} from "./object-detail.component";
import {ElevatedObjectService} from "./object.service";
import {PlacedObjectCatalogService} from "./object-catalog.service";
import {ObjectNewComponent} from "./object-new.component";
import {ObjectOwnerService} from "../owner/owner.service";
import {LocationService} from "../location/location.service";
import {PlacedObjectDetailGeneralEditComponent} from "./object-detail-general-edit.component";
import {PlacedObjectDetailGeneralViewComponent} from "./object-detail-general-view.component";
import {PlacedObjectDetailGeometryEditComponent} from "./object-detail-geometry-edit.component";
import {PlacedObjectDetailGeometryViewComponent} from "./object-detail-geometry-view.component";
import {ObjectNewTrackComponent} from './object-new-track.component';
import {ObjectNewPlacedComponent} from './object-new-placed.component';
import {TrackDetailGeneralViewComponent} from './track-detail-general-view.component';
import {TrackDetailComponent} from './track-detail.component';
import {TrackDetailGeneralEditComponent} from './track-detail-general-edit.component';

@NgModule({

  imports: [
    CommonModule,
    FormsModule,
    OlmapModule,
    CommonsModule,
    PlacedObjectRoutingModule
  ],
  declarations: [
    PlacedObjectComponent,
    ObjectSearchComponent,
    ObjectListComponent,
    PlacedObjectDetailComponent,
    ObjectNewComponent,
    ObjectNewTrackComponent,
    ObjectNewPlacedComponent,
    PlacedObjectDetailGeneralEditComponent,
    PlacedObjectDetailGeneralViewComponent,
    PlacedObjectDetailGeometryEditComponent,
    PlacedObjectDetailGeometryViewComponent,
    TrackDetailComponent,
    TrackDetailGeneralViewComponent,
    TrackDetailGeneralEditComponent
  ],
  providers: [
    OlService,
    OlComponent,
    ElevatedObjectService,
    PlacedObjectCatalogService,
    ObjectOwnerService,
    LocationService
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})

export class PlacedObjectModule {

}
