import {AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {OlComponent} from '../olmap/ol.component';
import {STATUS_INDICATOR} from "../commons/status-indicator";
import {RunwayService} from "./runway.service";
import Map = ol.Map;
import Polygon = ol.geom.Polygon;
import {ApiError} from "../main/apiError";
import Feature = ol.Feature;
import GeoJSON = ol.format.GeoJSON;

@Component({
  selector: 'app-runway-geometry-view',
  providers: [ OlComponent ],
  template: `
    <div class="panel panel-default">
      <div class="panel-heading">
        <div class="row">
          <h3 class="panel-title panel-title-with-buttons col-md-6" i18n="@@runway.detail.section.spatial.title">
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
          <app-empty-indicator type="definition" entity="geometry"></app-empty-indicator>
        </div>
        <div *ngSwitchCase="indicator.ERROR" class="container-fluid">
          <app-error-indicator [error]="onInitError"></app-error-indicator>
        </div>
        <div *ngSwitchCase="indicator.ACTIVE">
          <div class="form container-fluid">
            <div class="row">
              <div class="col-md-12 col-sm-12 form-group">
                <label for="inputGeoJSON" class="control-label" i18n="@@runway.detail.section.spatial.inputGeoJSON">
                  Polygon
                </label>
                <p class="form-control-static">{{coordinatesText}}</p>
              </div>
            </div>
          </div>
          <br>
          <app-map #mapRunway (map)="map"></app-map>
        </div>
      </div>

    </div>
  `
})

export class RunwayDetailGeometryViewComponent implements OnInit, AfterViewInit {
  map: Map;
  @Input() airportId : number;
  @Input() runwayId: number;
  private olmap: OlComponent;
  onInitError : ApiError;
  @ViewChild('mapRunway') set content(content: OlComponent) {
    this.olmap = content;
  }
  indicator;
  status : number;
  @Input() edit : boolean;
  @Output() editChange:EventEmitter<boolean> = new EventEmitter<boolean>();
  feature  : Feature;
  coordinatesText : string;

  constructor(
    private runwayService : RunwayService
  ){
    this.indicator = STATUS_INDICATOR;
  }

  ngOnInit(): void {

    this.onInitError = null;
    this.coordinatesText = '';
    this.status = STATUS_INDICATOR.LOADING;

    this.runwayService
      .getFeature(this.airportId, this.runwayId)
      .then(data => {
        this.feature=data;
        if(!this.feature.getGeometry())
          this.status = STATUS_INDICATOR.EMPTY;
        else {
          let jsonFeature = JSON.parse(new GeoJSON().writeFeature(data));
          this.coordinatesText = JSON.stringify(jsonFeature.geometry.coordinates);
          this.status = STATUS_INDICATOR.ACTIVE;
        }
      })
      .catch(error =>{
        this.onInitError = error;
        this.status = STATUS_INDICATOR.ERROR;
      });
  }

  ngAfterViewInit(): void {

    setTimeout(()=> {if (this.feature.getGeometry()) this.locateFeature()},500);
  }

  allowEdition() {
    this.editChange.emit(true);
  }

  locateFeature(){
    this.olmap.addRunway(this.feature,{center: true, zoom: 15});
  }
}
