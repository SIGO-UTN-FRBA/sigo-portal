import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AirportService} from "./airport.service";
import {Airport} from "./airport";
import {ApiError} from "../main/apiError";
import {STATUS_INDICATOR} from "../commons/status-indicator";

@Component({
  selector: 'app-airport-general-edit',
  template: `
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
            <app-error-indicator [error]="onInitError"></app-error-indicator>
          </div>
          <form #airportForm="ngForm"
                *ngSwitchCase="indicator.ACTIVE"
                role="form" 
                class="form container-fluid" 
                (ngSubmit)="onSubmit()">

            <app-error-indicator [error]="onSubmitError" *ngIf="onSubmitError"></app-error-indicator>
            
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
                  class="form-control"
                  name="inputNameFir"
                  [(ngModel)]="airport.nameFIR"
                  required>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label 
                  for="inputCodeFir" 
                  class="control-label" 
                  i18n="@@airport.detail.section.general.inputCodeFir">
                  Code ICAO
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="inputCodeFir"
                  [ngModel]="airport.codeFIR"
                  disabled
                  required>
              </div>
              <div class="col-md-6 col-sm-12">
                <label 
                  for="inputCodeIATA" 
                  class="control-label" 
                  i18n="@@airport.detail.section.general.inputCodeIATA">
                  Code IATA
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="inputCodeIATA"
                  [(ngModel)]="airport.codeIATA"
                  required>
              </div>
            </div>
            <hr>
            <div class="row">
              <div class="pull-right">
                <button
                  (click)="onCancel()"
                  type="button" 
                  class="btn btn-default" 
                  i18n="@@commons.button.cancel">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  [disabled]="airportForm.invalid"
                  class="btn btn-success" 
                  i18n="@@commons.button.save">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
  `
})


export class AirportDetailGeneralEditComponent implements OnInit{
  status: number;
  airport : Airport;
  @Input() airportId : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  onInitError : ApiError;
  onSubmitError : ApiError;
  indicator;

  constructor(
    private airportService : AirportService
  ){
    this.airport = new Airport();
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.onInitError = null;

    this.status = STATUS_INDICATOR.LOADING;

    this.airportService
      .get(this.airportId)
      .then( data => {
        this.airport = data;
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error =>{
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      })
  }

  onSubmit(){

    this.onSubmitError = null;

    this.airportService
      .update(this.airport)
      .then( () => this.disallowEdition() )
      .catch(error => this.onSubmitError = error);
  };

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}
