import {NgModule} from "@angular/core";
import {OlComponent} from "../olmap/ol.component";

@NgModule({
  declarations:[
    OlComponent
  ],
  exports: [
    OlComponent
  ]
})

export class OlmapModule{}
