import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Airport} from "./airport";
import {AirportService} from "./airport.service";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {ApiError} from "../main/apiError";
import {Router} from "@angular/router";

@Component({
  selector: 'app-airport-general-view',
  template:`
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@airport.detail.section.general.title">
            General
          </h3>
          <div class="col-md-6">
            <div class="pull-right">
              <div class="btn-group">
                <button
                  (click)="delete();"
                  class="btn btn-default"
                  i18n="@@commons.button.delete">
                  Delete
                </button>
              </div>
              <div class="btn-group">
                <button
                  (click)="allowEdition();"
                  class="btn btn-default"
                  i18n="@@commons.button.edit">
                  Edit
                </button>
              </div>
            </div>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      
      <div [ngSwitch]="status" class="panel-body">
        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE" class="form container-fluid">
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label for="inputNameFir" class="control-label" i18n="@@airport.detail.section.general.inputNameFir">
                Name ICAO
              </label>
              <p class="form-control-static">{{airport.nameFIR}}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-4 col-sm-12 form-group">
              <label for="inputCodeFir" class="control-label" i18n="@@airport.detail.section.general.inputCodeFir">
                Code ICAO
              </label>
              <p class="form-control-static">{{airport.codeFIR}}</p>
            </div>
            <div class="col-md-4 col-sm-12">
              <label for="inputCodeIATA" class="control-label" i18n="@@airport.detail.section.general.inputCodeIATA">
                Code IATA
              </label>
              <p class="form-control-static">{{airport.codeIATA}}</p>
            </div>
            <div class="col-md-4 col-sm-12">
              <label for="inputCodeLocal" class="control-label" i18n="@@airport.detail.section.general.inputCodeLocal">
                Code Local
              </label>
              <p class="form-control-static">{{airport.codeLocal}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})

export class AirportDetailGeneralViewComponent implements OnInit {

  airport : Airport;
  @Input() airportId : number;
  indicator;
  status : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  onInitError : ApiError;

  constructor(
    private airportService : AirportService,
    private router : Router
  ){
    this.airport = new Airport();
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit() : void {

    this.onInitError = null;

    this.status = STATUS_INDICATOR.LOADING;

    this.airportService
      .get(this.airportId)
      .then(data => {
        this.airport = data;
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      });
  }

  allowEdition() {
    this.editChange.emit(true);
  }

  delete() {
      this.airportService
        .delete(this.airportId)
        .then(()=> this.router.navigate(['/airports']))
        .catch( error => {
          this.onInitError = error;
          this.status = STATUS_INDICATOR.ERROR;
        })
  }
}
