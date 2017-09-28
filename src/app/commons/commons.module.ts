import {NgModule} from "@angular/core";
import {LoadingIndicatorComponent} from "./loading-indicator.component";
import {EmptyIndicatorComponent} from "./empty-indicator.component";

@NgModule({
  declarations:[
    LoadingIndicatorComponent,
    EmptyIndicatorComponent
  ],
  exports: [
    LoadingIndicatorComponent,
    EmptyIndicatorComponent
  ]
})

export class CommonsModule{}
