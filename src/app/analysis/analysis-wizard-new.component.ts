import {Component, OnInit} from '@angular/core';
import {STATUS_INDICATOR} from '../commons/status-indicator';
import {AppError} from '../main/ierror';
import {Airport} from '../airport/airport';
import {AnalysisService} from './analysis.service';
import {convertToParamMap, Router} from '@angular/router';
import {AirportService} from '../airport/airport.service';

@Component({
  template:`
    <h1 i18n="@@airport.new.title">
      New Analysis
    </h1>
    <p i18n="@@airport.new.main_description">
      This section allows users to create an analysis case.
    </p>
    <hr/>
    <div class="panel panel-default">
      <div class="panel-body" [ngSwitch]="initStatus">
        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE" class="container-fluid">
          <form #analysisForm="ngForm"
                role="form" class="form"
                (ngSubmit)="onSubmit()"
          >
            <div class="container-fluid" *ngIf="onSubmitError">
              <app-error-indicator [errors]="[onSubmitError]"></app-error-indicator>  
            </div>
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label
                  for="inputAirport"
                  class="control-label"
                  i18n="@@analysis.new.airport">
                  Airport
                </label>
                <select name="inputAirport"
                        [(ngModel)]="airportId"
                        class="form-control"
                        required
                >
                  <option *ngFor="let airport of airports" [value]="airport.id">
                    {{airport.codeFIR}} - {{airport.nameFIR}}
                  </option>
                </select>
              </div>
            </div>
          </form>
          <br>
          <hr>
          <div class="row">
            <div class="pull-right">
              <button
                type="button"
                (click)="onCancel()"
                class="btn btn-default"
                i18n="@@commons.button.cancel">
                Cancel
              </button>
              <button
                type="button"
                (click)="analysisForm.ngSubmit.emit()"
                [disabled]="analysisForm.form.invalid"
                class="btn btn-success"
                i18n="@@commons.button.create">
                Create
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})

export class AnalysisWizardNewComponent implements OnInit {
  initStatus: number;
  indicator;
  onInitError: AppError;
  onSubmitError: AppError;
  airportId: number;
  airports: Airport[];

  constructor(
    private analysisService: AnalysisService,
    private airportService: AirportService,
    private router: Router
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {
    this.initStatus = STATUS_INDICATOR.LOADING;
    this.onInitError = null;

    let params = convertToParamMap({"withoutCases": true});

    this.airportService
      .search(params)
      .then( data => this.airports = data.sort((a,b) => (a.codeFIR+'-'+a.nameFIR).localeCompare(b.codeFIR+'-'+b.nameFIR)))
      .then(() => this.initStatus = STATUS_INDICATOR.ACTIVE)
      .catch(error => {
        this.onInitError = error;
        this.initStatus = STATUS_INDICATOR.ERROR;
      });
  }

  onSubmit(){

    this.onSubmitError = null;

    this.analysisService
      .create({airportId: this.airportId})
      .then(() => this.router.navigateByUrl(`/analysis/search/list?id=${this.airportId}`) )
      .catch(error => this.onSubmitError = error);
  };

  onCancel(){
    return this.router.navigate([`/airports/search`])
  };
}
