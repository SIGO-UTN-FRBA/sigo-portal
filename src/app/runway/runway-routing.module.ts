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
    data:{
      breadcrumb: { name: 'runway', active: true}
    },
    children: [
      {
        path: 'detail',
        component: RunwayDetailComponent,
        data:{
          breadcrumb: { name: '', active: false}
        }
      },
      {
        path: 'directions',
        loadChildren: 'app/direction/direction.module#DirectionModule',
        data:{
          breadcrumb: { name: '', active: false}
        }
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
