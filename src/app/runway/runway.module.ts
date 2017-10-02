import {NgModule} from "@angular/core";
import {RunwayDetailComponent} from "./runway.component";
import {RunwayRoutingModule} from "./runway-routing.module";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RunwayService} from "./runway.service";
import {RunwayNewComponent} from "./runway-new-component";
import {RunwayCatalogService} from "./runway-catalog.service";

@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    RunwayRoutingModule
  ],
  declarations:[
    RunwayDetailComponent,
    RunwayNewComponent
  ],
  providers:[
    RunwayService,
    RunwayCatalogService
  ]
})

export class RunwayModule{}
