import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from "@angular/core";
import {OlmapModule} from "../olmap/olmap.module";
import {CommonsModule} from "../commons/commons.module";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {ExceptionRoutingModule} from "./exception-routing.module";
import {ExceptionComponent} from "./exception.component";
import {ExceptionNewComponent} from "./exception-new.component";
import {ExceptionNewRuleComponent} from "./exception-new-rule.component";
import {ExceptionNewSurfaceComponent} from "./exception-new-surface.component";

@NgModule({
  imports:[
    CommonModule,
    FormsModule,
    CommonsModule,
    OlmapModule,
    ExceptionRoutingModule
  ],
  declarations: [
    ExceptionComponent,
    ExceptionNewComponent,
    ExceptionNewRuleComponent,
    ExceptionNewSurfaceComponent
  ],
  providers: [

  ],
  schemas:[ CUSTOM_ELEMENTS_SCHEMA ]
})

export class ExceptionModule {

}
