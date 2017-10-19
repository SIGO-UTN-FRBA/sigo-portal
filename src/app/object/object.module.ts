import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {OlmapModule} from "../olmap/olmap.module";
import {FormsModule} from "@angular/forms";
import {CommonsModule} from "../commons/commons.module";
import {PlacedObjectRoutingModule} from "./object-routing.module";
import {PlacedObjectSearchComponent} from "./object-search.component";
import {PlacedObjectComponent} from "./object.component";
import {OlService} from "../olmap/ol.service";
import {OlComponent} from "../olmap/ol.component";
import {PlacedObjectListComponent} from "./object-list.component";
import {PlacedObjectDetailComponent} from "./object-detail.component";
import {PlacedObjectService} from "./object.service";
import {PlacedObjectCatalogService} from "./object-catalog.service";
import {PlacedObjectNewComponent} from "./object-new.component";
import {ObjectOwnerService} from "../owner/owner.service";
import {LocationService} from "../location/location.service";

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
    PlacedObjectSearchComponent,
    PlacedObjectListComponent,
    PlacedObjectDetailComponent,
    PlacedObjectNewComponent
  ],
  providers: [
    OlService,
    OlComponent,
    PlacedObjectService,
    PlacedObjectCatalogService,
    ObjectOwnerService,
    LocationService
  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})

export class PlacedObjectModule {

}
