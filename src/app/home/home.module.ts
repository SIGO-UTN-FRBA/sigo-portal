import {NgModule} from '@angular/core';
import {HomeComponent} from './home.component';
import {AnalysisService} from '../analysis/analysis.service';
import {AnalysisWizardService} from '../analysis/analysis-wizard.service';
import {AuthService} from '../auth/auth.service';
import {CommonsModule} from '../commons/commons.module';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AirportService} from '../airport/airport.service';

@NgModule({
  imports: [
    CommonModule,
    CommonsModule,
    RouterModule
  ],
  declarations: [
    HomeComponent
  ],
  exports: [
    HomeComponent
  ],
  providers: [
    AnalysisService,
    AnalysisWizardService,
    AuthService,
    AirportService
  ]
})

export class HomeModule{}
