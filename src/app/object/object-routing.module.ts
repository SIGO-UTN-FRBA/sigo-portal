import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {ObjectSearchComponent} from "./object-search.component";
import {PlacedObjectComponent} from "./object.component";
import {ObjectListComponent} from "./object-list.component";
import {PlacedObjectDetailComponent} from "./object-detail.component";
import {ObjectNewComponent} from "./object-new.component";
import {ObjectNewPlacedComponent} from './object-new-placed.component';
import {ObjectNewTrackComponent} from './object-new-track.component';
import {TrackDetailComponent} from './track-detail.component';

const objectRoutes : Routes = [
  {
    path: '',
    component: PlacedObjectComponent,
    children: [
      {
        path: 'search',
        component: ObjectSearchComponent,
        children: [
          {
            path: 'list',
            component: ObjectListComponent
          }
        ]
      },
      {
        path: 'new',
        component: ObjectNewComponent
      },
      {
        path: 'new/placedObject',
        component: ObjectNewPlacedComponent
      },
      {
        path: 'new/track',
        component: ObjectNewTrackComponent
      },
      {
        path: 'placedObjects/:objectId',
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
        path: 'tracks/:objectId',
        data:{
          breadcrumb: { active: true, name: 'object'}
        },
        children:[
          {
            path: 'detail',
            component: TrackDetailComponent,
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
