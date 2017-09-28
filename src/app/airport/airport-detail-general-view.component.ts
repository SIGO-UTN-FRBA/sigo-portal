import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {Airport} from "./airport";
import {AirportService} from "./airport.service";
import {ActivatedRoute} from "@angular/router";
import {STATUS_INDICATOR} from "../commons/status-indicator";

@Component({
  selector: 'airport-general-view',
  template:`
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@airport.detail.section.general.title">
            General
          </h3>
          <div class="col-md-6 btn-group">
            <a
              (click)="allowEdition();"
              class="btn btn-default pull-right"
              i18n="@@commons.button.edit">
              Edit
            </a>
          </div>
          <div class="clearfix"></div>
        </div>
      </div>
      
      <div [ngSwitch]="status" class="panel-body">

        <div *ngSwitchCase="indicator.LOADING">
          <loading-indicator></loading-indicator>
        </div>
        
        <div *ngSwitchCase="indicator.ACTIVE">
          <form #airportForm="ngForm" role="form" class="form container-fluid">
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label for="inputNameFir" class="control-label" i18n="@@airport.detail.section.general.inputNameFir">
                  Name ICAO
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="inputNameFir"
                  [ngModel]="airport.nameFIR"
                  readonly>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 col-sm-12 form-group">
                <label for="inputCodeFir" class="control-label" i18n="@@airport.detail.section.general.inputCodeFir">
                  Code ICAO
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="inputCodeFir"
                  [ngModel]="airport.codeFIR"
                  readonly>
              </div>
              <div class="col-md-6 col-sm-12">
                <label for="inputCodeIATA" class="control-label" i18n="@@airport.detail.section.general.inputCodeIATA">
                  Code IATA
                </label>
                <input
                  type="text"
                  class="form-control"
                  name="inputCodeIATA"
                  [ngModel]="airport.codeIATA"
                  readonly>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})

export class AirportDetailGeneralViewComponent implements OnInit{

  airport : Airport;
  indicator;
  status : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    private airportService : AirportService,
    private route : ActivatedRoute
  ){
    this.airport = new Airport();
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit() : void {

    this.status = this.indicator.LOADING;

    let airportId : number = +this.route.snapshot.params['airportId'];

    this.airportService
      .get(airportId)
      .then(data => {
        this.airport = data;
        this.status = this.indicator.ACTIVE;
      })

  }

  allowEdition() {
    this.editChange.emit(true);
  }
}
