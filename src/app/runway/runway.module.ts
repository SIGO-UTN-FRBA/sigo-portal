import {NgModule} from "@angular/core";
import {RunwayDetailComponent} from "./runway.component";
import {RunwayRoutingModule} from "./runway-routing.module";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {RunwayService} from "./runway.service";

@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    RunwayRoutingModule
  ],
  declarations:[
    RunwayDetailComponent
  ],
  providers:[
    RunwayService
  ]
})

export class RunwayModule{}
