import {NgModule} from "@angular/core";
import {LoadingIndicatorComponent} from "./loading-indicator.component";
import {EmptyIndicatorComponent} from "./empty-indicator.component";
import {BreadcrumbComponent} from "./breadcrumb.component";
import {CommonModule} from "@angular/common";
import {RouterModule} from "@angular/router";

@NgModule({
  imports:[
    CommonModule,
    RouterModule
  ],
  declarations:[
    LoadingIndicatorComponent,
    EmptyIndicatorComponent,
    BreadcrumbComponent
  ],
  exports: [
    LoadingIndicatorComponent,
    EmptyIndicatorComponent,
    BreadcrumbComponent
  ]
})

export class CommonsModule{}
