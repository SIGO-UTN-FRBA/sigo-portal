import {Component, OnInit} from "@angular/core";
import {AnalysisCase} from "./analysisCase";
import {ApiError} from "../main/apiError";
import {AnalysisCaseService} from "./analysisCase.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {ActivatedRoute} from "@angular/router";
import {AirportService} from "../airport/airport.service";
import AnalysisWizardStages from "./analysisWizardStages";
import { DatePipe } from '@angular/common';

@Component({
  template:`
    <div [ngSwitch]="status" class="container-fluid">

      <div *ngSwitchCase="indicator.LOADING">
        <app-loading-indicator></app-loading-indicator>
      </div>
      <div *ngSwitchCase="indicator.EMPTY">
        <app-empty-indicator type="result" entity="cases"></app-empty-indicator>
      </div>
      <div *ngSwitchCase="indicator.ERROR">
        <app-error-indicator [error]="onInitError"></app-error-indicator>
      </div>

      <ul *ngSwitchCase="indicator.ACTIVE" class="media-list">
        <li *ngFor="let analysis of results" class="media media-border">
          <div class="media-left">

          </div>
          <div class="media-body">
            <h4 class="media-heading">
              <a routerLink="/analysis/{{analysis.id}}/wizard/{{stages[analysis.status]}}">{{analysis.airport.codeFIR}}</a>
            </h4>
            <p>{{analysis.airport.nameFIR}}</p>
            <p>Creation: <i>{{analysis.creationDate | date:'yyyy-MM-dd HH:mm'}}</i></p>
            <p>User: <i>Mark Otto</i></p>
          </div>
          <div class="media-right">
            <button type="button" 
                    (click)="cloneCase(analysis)"
                    *ngIf="analysis.status == 1"
                    class="btn btn-default btn-sm" 
                    i18n="@@commons.button.new">
              New
            </button>
          </div>
        </li>
      </ul>
    </div>
  `
})

export class AnalysisCaseListComponent implements OnInit {

  results : AnalysisCase[];
  status : number;
  indicator;
  onInitError : ApiError;
  stages: Array<string>;

  constructor(
    private caseService : AnalysisCaseService,
    private airportService : AirportService,
    private route: ActivatedRoute
  ){
    this.results = [];
    this.indicator = STATUS_INDICATOR;
    this.stages = AnalysisWizardStages;
  }

  ngOnInit(): void {

    this.onInitError = null;
    this.status = STATUS_INDICATOR.LOADING;

    this.caseService
      .search(this.route.snapshot.queryParamMap)
      .then(data => this.results = data)
      .then(()=> Promise.all(this.results.map(r => this.airportService.get(r.airportId).then((airport) => r.airport = airport))))
      .then(()=> this.status = STATUS_INDICATOR.ACTIVE)
      .catch(error => this.status=STATUS_INDICATOR.ERROR);

  }

  cloneCase(analysis: AnalysisCase) {

  }
}
