import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PlacedObjectSearchComponent} from "./object-search.component";
import {PlacedObjectComponent} from "./object.component";
import {PlacedObjectListComponent} from "./object-list.component";
import {PlacedObjectDetailComponent} from "./object-detail.component";
import {PlacedObjectNewComponent} from "./object-new.component";

const objectRoutes : Routes = [
  {
    path: '',
    component: PlacedObjectComponent,
    children: [

      {
        path: 'search',
        component: PlacedObjectSearchComponent,
        children: [
          {
            path: 'list',
            component: PlacedObjectListComponent
          }
        ]
      },
      {
        path: 'new',
        component: PlacedObjectNewComponent
      },
      {
        path: ':objectType/:objectId',
        data:{
          breadcrumb: { active: true, name: 'object'}
        },
        children:[
          {
            path: 'detail',
            component: PlacedObjectDetailComponent,
            data:{
              breadcrumb: { active: false }
            },
          },
          {
            path: '',
            redirectTo: 'detail'
          }
        ]
      },
      {
        path: '',
        redirectTo: 'search'
      }
    ]
  }
];

@NgModule({
  imports:[
    RouterModule.forChild(objectRoutes)
  ],
  declarations: [],
  exports:[
    RouterModule
  ]
})

export class PlacedObjectRoutingModule {

}
