import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AirportService} from "./airport.service";
import {Airport} from "./airport";
import {Router} from "@angular/router";
import {Region} from "../region/region";
import {RegionService} from "../region/region.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {ApiError} from "../main/apiError";
import {RegulationService, RegulationType} from "../regulation/regulation.service";

@Component({
  template: `
    <h1 i18n="@@airport.new.title">
      New Airport
    </h1>
    <p i18n="@@airport.new.main_description">
      This section allows users to create an airport.
    </p>
    <hr/>
    
      <div class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title" i18n="@@airport.detail.section.general.title">
            General
          </h3>
        </div>
        <div class="panel-body" [ngSwitch]="status">
          <div *ngSwitchCase="indicator.LOADING">
            <app-loading-indicator></app-loading-indicator>
          </div>
          <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
            <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
          </div>
          <div *ngSwitchCase="indicator.ACTIVE" class="container-fluid">
            <form #airportForm="ngForm"
                  role="form" class="form"
                  (ngSubmit)="onSubmit()">

              <app-error-indicator [errors]="[onSubmitError]" *ngIf="onSubmitError"></app-error-indicator>

              <div class="row">
                <div class="col-md-12 col-sm-12 form-group">
                  <label
                    for="inputRegion"
                    class="control-label"
                    i18n="@@airport.detail.section.general.region">
                    Region
                  </label>
                  <select
                    class="form-control"
                    name="inputRegion"
                    [(ngModel)]="airport.regionId"
                    required>
                    <option *ngFor="let region of regions" [value]="region.id"> {{region.codeFIR}} - {{region.name}}</option>
                  </select>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 col-sm-12 form-group">
                  <label
                    for="inputNameFir"
                    class="control-label"
                    i18n="@@airport.detail.section.general.inputNameFir">
                    Name ICAO
                  </label>
                  <input
                    type="text"
                    maxlength="140"
                    class="form-control"
                    name="inputNameFir"
                    [(ngModel)]="airport.nameFIR"
                    required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-4 col-sm-12 form-group">
                  <label
                    for="inputCodeFir"
                    class="control-label"
                    i18n="@@airport.detail.section.general.inputCodeFir">
                    Code ICAO
                  </label>
                  <input
                    type="text"
                    maxlength="4"
                    minlength="4"
                    class="form-control"
                    name="inputCodeFir"
                    [(ngModel)]="airport.codeFIR"
                    required>
                </div>
                <div class="col-md-4 col-sm-12">
                  <label
                    for="inputCodeIATA"
                    class="control-label"
                    i18n="@@airport.detail.section.general.inputCodeIATA">
                    Code IATA
                  </label>
                  <input
                    type="text"
                    maxlength="3"
                    minlength="3"
                    class="form-control"
                    name="inputCodeIATA"
                    [(ngModel)]="airport.codeIATA"
                    required>
                </div>
                <div class="col-md-4 col-sm-12">
                  <label
                    for="inputCodeLocal"
                    class="control-label"
                    i18n="@@airport.detail.section.general.inputCodeLocal">
                    Code Local
                  </label>
                  <input
                    type="text"
                    maxlength="3"
                    minlength="3"
                    class="form-control"
                    name="inputCodeLocal"
                    [(ngModel)]="airport.codeLocal"
                    required>
                </div>
              </div>
              <div class="row">
                <div class="col-md-12 col-sm-12 form-group">
                  <label
                    for="inputRegulation"
                    class="control-label"
                    i18n="@@airport.detail.section.general.inputRegulation">
                    Regulation
                  </label>
                  <select class="form-control"
                          name="inputRegulation"
                          [(ngModel)]="airport.regulationId"
                          required
                  >
                    <option *ngFor="let regulation of regulations" [value]="regulation.ordinal">
                      {{regulation.name}}
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
                  (click)="airportForm.ngSubmit.emit()"
                  [disabled]="airportForm.form.invalid"
                  class="btn btn-success"
                  i18n="@@commons.button.create">
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
        <br>
      </div>
  `
})


export class AirportNewComponent implements OnInit{

  airport : Airport;
  regulations: RegulationType[];
  regions : Region[];
  status: number;
  onInitError: ApiError;
  onSubmitError: ApiError;
  indicator;

  constructor(
    private router : Router,
    private airportService : AirportService,
    private regulationService : RegulationService,
    private regionService : RegionService
  ){
    this.airport = new Airport();
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.status = STATUS_INDICATOR.LOADING;

    this.regulations = this.regulationService.types();

    this.regionService
      .list()
      .then(data => {
        this.regions = data;
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      });
  }

  onSubmit(){

    this.onSubmitError = null;

    this.airportService
      .save(this.airport)
      .then( (data) => this.router.navigate([`/airports/${data.id}/detail`]) )
      .catch(error => this.onSubmitError = error);
  };

  onCancel(){
    this.router.navigate([`/airports/search`])
  };

}
