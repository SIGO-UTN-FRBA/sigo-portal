import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CommonsModule} from '../commons/commons.module';
import {RunwayNewComponent} from './runway-new-component';
import {RunwayDetailComponent} from './runway-detail.component';

const runwayRoutes: Routes = [
  {
    path: 'new',
    component: RunwayNewComponent
  },
  {
    path: ':runwayId',
    children: [
      {
        path: 'detail',
        component: RunwayDetailComponent
      },
      {
        path: 'directions',
        loadChildren: 'app/direction/direction.module#DirectionModule'
      },
      {
        path: '',
        redirectTo: 'detail'
      }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(runwayRoutes),
    CommonsModule
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})

export class RunwayRoutingModule {

}
