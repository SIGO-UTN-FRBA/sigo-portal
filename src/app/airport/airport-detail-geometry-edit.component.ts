import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AirportService} from "./airport.service";
import Point = ol.geom.Point;
import {ApiError} from "../main/apiError";
import {STATUS_INDICATOR} from "../commons/status-indicator";
import Coordinate = ol.Coordinate;
import GeoJSON = ol.format.GeoJSON;

@Component({
  selector: 'app-airport-geometry-edit',
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@airport.detail.section.spatial.title">
            Spatial
          </h3>
          <div class="clearfix"></div>
        </div>
      </div>

      <div class="panel-body" [ngSwitch]="status">

        <div *ngSwitchCase="indicator.LOADING">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        
        <form  #geometryForm="ngForm"
               *ngSwitchCase="indicator.ACTIVE"
               role="form" 
               class="form container-fluid" 
               (ngSubmit)="onSubmit()">

          <app-error-indicator [error]="onSubmitError" *ngIf="onSubmitError"></app-error-indicator>
          
          <div class="row">
            <div class="col-md-12 col-sm-12 form-group">
              <label for="inputCoordinates" class="control-label" i18n="@@airport.detail.section.spatial.inputCoordinates">
                Point
              </label>
              <textarea
                name="inputCoordinates"
                [(ngModel)]="coordinateText"
                class="form-control"
                placeholder='[0.0, 0.0]'
                rows="3"
                required>
              </textarea>
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
                [disabled]="geometryForm.invalid"
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

export class AirportDetailGeometryEditComponent implements OnInit{
  coordinateText : string;
  @Input() airportId : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  onInitError : ApiError;
  onSubmitError : ApiError;
  indicator;
  status : number;

  constructor(
    private airportService : AirportService
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.onInitError = null;

    this.status = STATUS_INDICATOR.LOADING;

    this.airportService
      .getFeature(this.airportId)
      .then( data => {
        let jsonFeature = JSON.parse(new GeoJSON().writeFeature(data));
        this.coordinateText = JSON.stringify(jsonFeature.geometry.coordinates);
        this.status = STATUS_INDICATOR.ACTIVE;
      })
      .catch(error => {
        this.onInitError = error;
        console.error(error);
        this.status = STATUS_INDICATOR.ERROR;
      })
  }

  onSubmit(){

    this.onSubmitError = null;

    let point : Point = new Point(JSON.parse(this.coordinateText) as Coordinate); //TODO validate

    this.airportService
      .updateFeature(this.airportId, point)
      .then( () => this.disallowEdition() )
      .catch(error => this.onSubmitError= error);
  };

  onCancel(){
    this.disallowEdition();
  };

  disallowEdition() {
    this.editChange.emit(false);
  }
}
