import {Component, OnInit} from '@angular/core';
import {STATUS_INDICATOR} from '../commons/status-indicator';
import {ApiError} from '../main/apiError';
import {AnalysisService} from '../analysis/analysis.service';
import {AnalysisWizardService} from '../analysis/analysis-wizard.service';
import {convertToParamMap} from '@angular/router';
import {Analysis} from '../analysis/analysis';
import {AuthService} from '../auth/auth.service';
import {AirportService} from '../airport/airport.service';

@Component({
  template:`
    <h1 i18n="@@home.title">
      Home
    </h1>
    <p i18n="@@home.main_description">
      This is a summary about your activity in the application.
    </p>
    <hr/>

    <div class="container-fluid">
      <div class="panel panel-default">
        <div class="panel-heading">
          <div class="panel-heading">
            <h3 class="panel-title" i18n="@@home.current_analysis.title">Your analysis cases in progress</h3>
          </div>
        </div>
        
        <div [ngSwitch]="initAnalysisStatus" class="panel-body" style="max-height: 40em; overflow: auto;">
          <div *ngSwitchCase="indicator.LOADING">
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.EMPTY">
            <app-empty-indicator type="result" entity="cases yet"></app-empty-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR">
            <app-error-indicator [errors]="[onInitAnalysisError]"></app-error-indicator>
          </div>
          
          <ul *ngSwitchCase="indicator.ACTIVE" class="media-list">
            <li *ngFor="let analysis of analysisResults" class="media media-border">
              <div class="media-left"></div>
              <div class="media-body">
                <h4 class="media-heading">
                  <a routerLink="/analysis/{{analysis.id}}/stages/{{stages[analysis.stageId]}}">{{(analysis.airport.codeFIR)?analysis.airport.codeFIR:analysis.airport.codeLocal}}</a>
                  <span class="label" [ngClass]="{'label-info': analysis.statusId <= 1, 'label-default': analysis.statusId == 2, 'label-danger': analysis.statusId == 3}">{{stages[analysis.stageId]}}</span>
                </h4>
                <p>{{analysis.airport.nameFIR}}</p>
                <p>Creation: <i>{{analysis.creationDate | date:'yyyy-MM-dd HH:mm'}}</i></p>
                <p>Edition: <i>{{analysis.editionDate | date:'yyyy-MM-dd HH:mm'}}</i></p>
              </div>
            </li>
          </ul>
          
        </div>
      </div>
    </div>
  `
})

export class HomeComponent implements OnInit {
  initAnalysisStatus: number;
  onInitAnalysisError: ApiError;
  indicator;
  stages: Array<string>;
  analysisResults: Analysis[];

  constructor(
    private analysisService : AnalysisService,
    private wizardService: AnalysisWizardService,
    private airportService: AirportService,
    private authService: AuthService
  ){
    this.indicator = STATUS_INDICATOR;
    this.stages = this.wizardService.stages();
    this.analysisResults = [];
  }

  ngOnInit(): void {
    this.initAnalysisStatus = STATUS_INDICATOR.LOADING;
    this.onInitAnalysisError = null;

    let paramMap = convertToParamMap({current: true, user: this.authService.getUserId()});

    this.analysisService
      .search(paramMap)
      .then( data => this.analysisResults = data.sort((a,b) => b.editionDate - a.editionDate))
      .then(() =>
        Promise.all(this.analysisResults.map( a =>
          this.airportService.get(a.airportId)
            .then( data => a.airport = data)
            .catch(error => Promise.reject(error))
        ))
      )
      .then(data => {
        if(data.length > 0 ){
          this.initAnalysisStatus = STATUS_INDICATOR.ACTIVE;
        } else {
          this.initAnalysisStatus = STATUS_INDICATOR.EMPTY;
        }
      })
      .catch(error => {
        this.onInitAnalysisError = error;
        this.initAnalysisStatus = STATUS_INDICATOR.ERROR;
      });
  }

}
