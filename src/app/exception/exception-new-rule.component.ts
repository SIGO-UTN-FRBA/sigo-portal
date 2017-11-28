import {Component, OnInit} from "@angular/core";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {AppError} from "../main/ierror";
import {ActivatedRoute, Router} from "@angular/router";
import {AirportService} from "../airport/airport.service";
import {AnalysisService} from "../analysis/analysis.service";
import {RegulationService, RegulationType} from "../regulation/regulation.service";

@Component({
  template:`
    <h1 i18n="@@exception.rule.new.title">
      New analysis exception for regulation rule
    </h1>
    <p i18n="@@exception.rule.new.main_description">
      This section allows users to override a regulation rule.
    </p>
    <hr/>
    <div class="container-fluid">
      <div class="panel panel-default">
        <div class="panel-body" [ngSwitch]="onInitStatus">
          <div *ngSwitchCase="indicator.LOADING">
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
            <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
          </div>
          <ng-container *ngSwitchCase="indicator.ACTIVE">
            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label
                  for="inputClassification"
                  class="control-label"
                  i18n="@@exception.rule.detail.section.general.inputRegulation">
                  Regulation
                </label>
                <p class="form-control-static">{{regulation.name}}</p>
              </div>
            </div>
          </ng-container>
        </div>
      </div>
      <br>
      <router-outlet></router-outlet>
    </div>
  `
})

export class ExceptionNewRuleComponent implements OnInit {

  onInitStatus:number;
  indicator;
  onInitError:AppError;
  private analysisId: number;
  regulation:RegulationType;

  constructor(
    private regulationService:RegulationService,
    private airportService:AirportService,
    private analysisService:AnalysisService,
    private route:ActivatedRoute,
    private router:Router
  ){
    this.indicator=STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.onInitStatus=STATUS_INDICATOR.LOADING;
    this.onInitError=null;

    this.analysisId = this.route.parent.snapshot.params['analysisId'];

    this.analysisService.get(this.analysisId)
      .then(data => this.airportService.get(data.airportId))
      .then(data => {
        this.regulation = this.regulationService.types()[data.regulationId];
        this.onInitStatus=STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError=error;
        this.onInitStatus=STATUS_INDICATOR.ERROR;
      })
      .then(()=> this.router.navigate([`/analysis/${this.analysisId}/exceptions/new/rule/${this.regulation.code}`]))

  }
}
