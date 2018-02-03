import {
  AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren
} from '@angular/core';
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {AirportService} from "./airport.service";
import {OlComponent} from "../olmap/ol.component";
import {ApiError} from "../main/apiError";
import Feature = ol.Feature;
import GeoJSON = ol.format.GeoJSON;

@Component({
  selector: 'app-airport-geometry-view',
  providers: [ OlComponent ],
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@airport.detail.section.spatial.title">
            Spatial
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
        <div *ngSwitchCase="indicator.LOADING" class="container-fluid">
          <app-loading-indicator></app-loading-indicator>
        </div>
        <div *ngSwitchCase="indicator.EMPTY" class="container-fluid">
          <app-empty-indicator type="definition" entity="point"></app-empty-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [errors]="[onInitError]"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE">
          <div class="form container-fluid">
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label for="inputGeoJSON" class="control-label"
                       i18n="@@airport.detail.section.spatial.inputCoordinates">
                  Point
                </label>
                <p class="form-control-static">{{coordinateText}}</p>
              </div>
            </div>
          </div>
          <br>
          <app-map #mapAirport
                   [rotate]="true"
                   [fullScreen]="true"
                   [scale]="true"
                   [layers]="['airport']"
          >
          </app-map>
        </div>
      </div>

    </div>
  `
})

export class AirportDetailGeometryViewComponent implements OnInit, AfterViewInit{

  @Input() airportId : number;
  private olmap: OlComponent;
  onInitError :ApiError;
  @ViewChildren('mapAirport') mapAirport: QueryList<ElementRef>;
  indicator;
  status : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  feature  : Feature;
  coordinateText : string;

  constructor(
    private airportService : AirportService
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.status = STATUS_INDICATOR.LOADING;

    this.airportService
      .getFeature(this.airportId)
      .then(data => {
        this.feature = data;
        if(!this.feature.getGeometry()){
          this.status = STATUS_INDICATOR.EMPTY;
        } else {
          let jsonFeature = JSON.parse(new GeoJSON().writeFeature(data));
          this.coordinateText = JSON.stringify(jsonFeature.geometry.coordinates);
          this.status = STATUS_INDICATOR.ACTIVE;
        }
      })
      .catch(error => {
        this.onInitError = error;
        console.error(error);
        this.status = STATUS_INDICATOR.ERROR;
      });
  }

  ngAfterViewInit(): void {
    this.mapAirport.changes.subscribe(item => {
      if(!(this.olmap = item.first))
        return;

      this.locateFeature();
    });
  }

  allowEdition() {
    this.editChange.emit(true);
  }

  locateFeature(){
    this.olmap.addAirport(this.feature,{center: true, zoom: 12});
  }
}
